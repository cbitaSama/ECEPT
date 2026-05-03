// Vercel serverless function — AI flashcard generation via Gemini 2.5 Flash.
// POST {sourceType, sourceData, sourceName, count, cardType}
// → {draftId, cards, count, quota}
// Tier-gated: monthly quota (premium) → credits → 402 insufficient_credits.
// No npm deps — raw fetch (Node 18+).

const { getProfile, spendCredits, getMonthlyGenCount } = require('./_credits.js');
const { TIERS, CREDIT_COSTS } = require('./_tiers.js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  // ── 1. Auth ──
  const authHeader = req.headers.authorization;
  if (!authHeader) { res.status(401).json({ error: 'unauthorized' }); return; }

  let user;
  try {
    const userResp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'Authorization': authHeader, 'apikey': ANON_KEY }
    });
    if (!userResp.ok) { res.status(401).json({ error: 'unauthorized' }); return; }
    user = await userResp.json();
  } catch (err) {
    console.error('auth fetch error:', err.message);
    res.status(401).json({ error: 'unauthorized' }); return;
  }
  if (!user || !user.id) { res.status(401).json({ error: 'unauthorized' }); return; }

  // ── 2. Body validation ──
  const body = req.body || {};
  const { sourceType, sourceData, sourceName, count, cardType } = body;

  if (!['text', 'pdf', 'image'].includes(sourceType)) {
    res.status(400).json({ error: 'invalid_request', message: 'sourceType must be text|pdf|image' }); return;
  }
  if (!['basic', 'cloze', 'mixed'].includes(cardType)) {
    res.status(400).json({ error: 'invalid_request', message: 'cardType must be basic|cloze|mixed' }); return;
  }
  if (!sourceData) {
    res.status(400).json({ error: 'invalid_request', message: 'sourceData is required' }); return;
  }

  const safeCount = Math.min(30, Math.max(5, parseInt(count) || 10));

  // Validate attachment size for non-text sources
  if (sourceType !== 'text' && Buffer.byteLength(sourceData, 'base64') > MAX_ATTACHMENT_BYTES) {
    res.status(400).json({ error: 'invalid_request', message: 'File too large (max 10 MB)' }); return;
  }

  // ── 3. Profile + tier ──
  const profile = await getProfile(user.id);
  const role = profile?.role || 'student';
  const tier = TIERS[role] || TIERS.student;

  // ── 4. Gating ──
  let paidWith = 'free_admin';
  let cost = 0;
  let monthlyUsed = 0;
  let creditResult = null;

  if (role !== 'admin') {
    monthlyUsed = await getMonthlyGenCount(user.id);

    if (tier.monthlyGen > 0 && monthlyUsed < tier.monthlyGen) {
      // Monthly quota available — free (counts as 1 generation regardless of count)
      paidWith = 'quota';
    } else {
      // Pay with credits
      cost = safeCount * CREDIT_COSTS.gen_per_card;
      try {
        creditResult = await spendCredits(user.id, cost, 'gen_' + safeCount + '_cards', { sourceType, cardType });
      } catch (err) {
        console.error('spendCredits error:', err.message);
        res.status(500).json({ error: 'internal', message: err.message }); return;
      }
      if (!creditResult.ok && !creditResult.skipped) {
        res.status(402).json({ error: 'insufficient_credits', need: creditResult.need, have: creditResult.have });
        return;
      }
      paidWith = 'credits';
    }
  }

  // ── 5. Build Gemini prompt ──
  const typeDesc = cardType === 'mixed' ? 'mezcla de basic y cloze' : cardType;
  const prompt =
    'Eres un experto en educación médica. Generá flashcards de estudio a partir ' +
    'del contenido proporcionado.\n\n' +
    'INSTRUCCIONES:\n' +
    '- Generá exactamente ' + safeCount + ' flashcards.\n' +
    '- Tipo: ' + typeDesc + '.\n' +
    '- BASIC: front=pregunta, back=respuesta.\n' +
    '- CLOZE: front=texto con {{c1::palabra_clave}}, back="".\n' +
    '- Cubrí los conceptos más importantes del contenido.\n' +
    '- Idioma: español latinoamericano.\n' +
    '- Tags: máximo 3 por card, en minúsculas, sin espacios (usar guiones).\n\n' +
    'RESPONDÉ ÚNICAMENTE con un JSON array válido, sin markdown, sin explicaciones:\n' +
    '[\n' +
    '  {"card_type":"basic","front":"...","back":"...","tags":["tag1","tag2"]},\n' +
    '  {"card_type":"cloze","front":"... {{c1::clave}} ...","back":"","tags":["tag1"]}\n' +
    ']';

  let geminiParts;
  if (sourceType === 'text') {
    geminiParts = [{ text: prompt + '\n\nCONTENIDO:\n' + sourceData }];
  } else if (sourceType === 'pdf') {
    geminiParts = [
      { text: prompt + '\n\nAnalizá el siguiente documento PDF y generá las flashcards:' },
      { inlineData: { mimeType: 'application/pdf', data: sourceData } }
    ];
  } else {
    // image — detect mime from base64 prefix
    let mimeType = 'image/jpeg';
    if (sourceData.startsWith('iVBORw')) mimeType = 'image/png';
    else if (sourceData.startsWith('UklGR')) mimeType = 'image/webp';
    geminiParts = [
      { text: prompt + '\n\nAnalizá la siguiente imagen y generá las flashcards:' },
      { inlineData: { mimeType, data: sourceData } }
    ];
  }

  // ── 6. Call Gemini ──
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  let geminiResp;
  try {
    geminiResp = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: geminiParts }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 8192 }
      })
    });
  } catch (err) {
    console.error('Gemini fetch error:', err.message);
    res.status(500).json({ error: 'gemini_error', message: err.message }); return;
  }

  if (!geminiResp.ok) {
    const errText = await geminiResp.text().catch(() => '');
    console.error('Gemini API error:', geminiResp.status, errText.slice(0, 300));
    res.status(500).json({ error: 'gemini_error', message: `Gemini returned ${geminiResp.status}` }); return;
  }

  const geminiData = await geminiResp.json();
  let rawText = '';
  const cparts = geminiData?.candidates?.[0]?.content?.parts;
  if (Array.isArray(cparts)) {
    cparts.forEach(p => { if (p?.text) rawText += p.text; });
  }
  rawText = rawText.trim();

  // ── 7. Parse and validate response ──
  const clean = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  const arrStart = clean.indexOf('[');
  const arrEnd = clean.lastIndexOf(']');
  const jsonStr = (arrStart >= 0 && arrEnd > arrStart) ? clean.slice(arrStart, arrEnd + 1) : clean;

  let cards;
  try {
    cards = JSON.parse(jsonStr);
  } catch (e) {
    console.error('Invalid JSON from Gemini:', rawText.slice(0, 300));
    res.status(500).json({ error: 'invalid_gemini_response' }); return;
  }

  if (!Array.isArray(cards)) {
    res.status(500).json({ error: 'invalid_gemini_response' }); return;
  }

  const validCards = cards
    .filter(c => c && c.front && c.card_type)
    .map(c => ({
      card_type: c.card_type === 'cloze' ? 'cloze' : 'basic',
      front: String(c.front).slice(0, 1000),
      back: String(c.back || '').slice(0, 1000),
      tags: Array.isArray(c.tags) ? c.tags.slice(0, 3).map(t => String(t).slice(0, 64)) : []
    }));

  // ── 8. Insert draft ──
  const draftRes = await fetch(`${SUPABASE_URL}/rest/v1/flashcard_drafts`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      user_id: user.id,
      source_name: sourceName || 'Sin nombre',
      source_type: sourceType,
      cards_json: validCards,
      status: 'pending'
    })
  });
  const draft = (await draftRes.json())[0];

  // ── 9. Updated credits ──
  const updatedProfile = await getProfile(user.id);

  // ── 10. Response ──
  res.status(200).json({
    draftId: draft?.id || null,
    cards: validCards,
    count: validCards.length,
    quota: {
      paidWith,
      monthlyUsed: paidWith === 'quota' ? monthlyUsed + 1 : monthlyUsed,
      monthlyLimit: tier.monthlyGen,
      credits: updatedProfile?.credits || 0,
      spent: cost
    }
  });
};
