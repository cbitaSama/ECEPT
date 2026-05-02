// Vercel serverless function — AI flashcard generation via Gemini 2.5 Flash.
// POST {sourceType, sourceData, sourceName, count, cardType}
// → {draftId, cards, count}
// Auth: Supabase JWT in Authorization header. Only premium/admin roles.
// No npm deps — uses native fetch (Node 18+) and Supabase REST API.

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  var authHeader = req.headers.authorization;
  if (!authHeader) { res.status(401).json({ error: 'No authorization header' }); return; }

  var supabaseUrl = process.env.SUPABASE_URL;
  var supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  var apiKey = process.env.GEMINI_API_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({ error: 'Supabase not configured' }); return;
  }
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY not configured' }); return;
  }

  // 1. Verify JWT via Supabase /auth/v1/user
  var userResp = await fetch(supabaseUrl + '/auth/v1/user', {
    headers: { 'Authorization': authHeader, 'apikey': supabaseAnonKey }
  });
  if (!userResp.ok) { res.status(401).json({ error: 'Unauthorized' }); return; }
  var user;
  try { user = await userResp.json(); } catch(e) { res.status(401).json({ error: 'Unauthorized' }); return; }
  if (!user || !user.id) { res.status(401).json({ error: 'Unauthorized' }); return; }

  // 2. Check role — only premium or admin
  var profileResp = await fetch(
    supabaseUrl + '/rest/v1/profiles?id=eq.' + encodeURIComponent(user.id) + '&select=role',
    { headers: { 'Authorization': authHeader, 'apikey': supabaseAnonKey, 'Accept': 'application/json' } }
  );
  var profiles;
  try { profiles = await profileResp.json(); } catch(e) { profiles = []; }
  var profile = Array.isArray(profiles) ? profiles[0] : null;
  if (!profile || (profile.role !== 'premium' && profile.role !== 'admin')) {
    res.status(403).json({ error: 'premium_required' }); return;
  }

  // 3. Parse body
  var body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) { body = {}; }
  }

  var sourceType = body.sourceType;
  var sourceData = body.sourceData;
  var sourceName = body.sourceName;
  var count = body.count;
  var cardType = body.cardType;

  if (!sourceType || !sourceData || !count || !cardType) {
    res.status(400).json({ error: 'Missing required fields' }); return;
  }

  var safeCount = Math.min(30, Math.max(5, parseInt(count) || 10));

  // 4. Build Gemini prompt
  var typeDesc = cardType === 'mixed' ? 'mezcla de basic y cloze' : cardType;
  var systemPrompt =
    'Eres un experto en educación médica. Tu tarea es generar flashcards de estudio a partir del contenido proporcionado.\n\n' +
    'INSTRUCCIONES:\n' +
    '- Generá exactamente ' + safeCount + ' flashcards\n' +
    '- Tipo solicitado: ' + typeDesc + '\n' +
    '- Para cards BASIC: "front" es la pregunta, "back" es la respuesta\n' +
    '- Para cards CLOZE: "front" contiene el texto con {{c1::palabra_clave}} marcando lo que se debe recordar, "back" debe estar vacío ("")\n' +
    '- Las flashcards deben cubrir los conceptos más importantes del contenido\n' +
    '- Idioma: español latinoamericano\n' +
    '- Incluí tags relevantes (máximo 3 por card, en minúsculas, sin espacios)\n\n' +
    'RESPONDÉ ÚNICAMENTE con un JSON array válido, sin markdown, sin explicaciones:\n' +
    '[\n' +
    '  {"card_type": "basic", "front": "¿Pregunta?", "back": "Respuesta", "tags": ["tag1", "tag2"]},\n' +
    '  {"card_type": "cloze", "front": "El {{c1::término}} se define como...", "back": "", "tags": ["tag1"]}\n' +
    ']';

  var geminiParts = [];
  if (sourceType === 'text') {
    geminiParts = [{ text: systemPrompt + '\n\nCONTENIDO:\n' + sourceData }];
  } else if (sourceType === 'pdf') {
    geminiParts = [
      { text: systemPrompt + '\n\nAnalizá el siguiente documento PDF y generá las flashcards:' },
      { inlineData: { mimeType: 'application/pdf', data: sourceData } }
    ];
  } else if (sourceType === 'image') {
    var mimeType = sourceData.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
    geminiParts = [
      { text: systemPrompt + '\n\nAnalizá la siguiente imagen y generá las flashcards:' },
      { inlineData: { mimeType: mimeType, data: sourceData } }
    ];
  } else {
    res.status(400).json({ error: 'Invalid sourceType' }); return;
  }

  var geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey);
  var geminiBody = JSON.stringify({
    contents: [{ role: 'user', parts: geminiParts }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 8192 }
  });

  var geminiResp = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: geminiBody
  });

  if (!geminiResp.ok) {
    var errText = await geminiResp.text();
    res.status(500).json({ error: 'Gemini API error: ' + geminiResp.status, detail: errText.slice(0, 200) }); return;
  }

  var geminiData = await geminiResp.json();
  var rawText = '';
  if (geminiData && Array.isArray(geminiData.candidates) && geminiData.candidates[0] &&
      geminiData.candidates[0].content && Array.isArray(geminiData.candidates[0].content.parts)) {
    geminiData.candidates[0].content.parts.forEach(function(p) {
      if (p && typeof p.text === 'string') rawText += p.text;
    });
  }
  rawText = rawText.trim();

  // Parse JSON — strip markdown fences and find array bounds
  var clean = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  var arrStart = clean.indexOf('[');
  var arrEnd = clean.lastIndexOf(']');
  if (arrStart >= 0 && arrEnd > arrStart) clean = clean.slice(arrStart, arrEnd + 1);

  var cards;
  try { cards = JSON.parse(clean); }
  catch(e) {
    res.status(500).json({ error: 'Invalid JSON from Gemini', raw: rawText.slice(0, 200) }); return;
  }

  if (!Array.isArray(cards)) {
    res.status(500).json({ error: 'Expected array from Gemini' }); return;
  }

  var validCards = cards
    .filter(function(c) { return c && c.front && c.card_type; })
    .map(function(c) {
      return {
        card_type: c.card_type === 'cloze' ? 'cloze' : 'basic',
        front: String(c.front).slice(0, 1000),
        back: String(c.back || '').slice(0, 1000),
        tags: Array.isArray(c.tags) ? c.tags.slice(0, 3).map(function(t) { return String(t).slice(0, 64); }) : []
      };
    });

  // 5. Save draft in Supabase (non-blocking — failure doesn't abort response)
  var draftId = null;
  try {
    var draftResp = await fetch(supabaseUrl + '/rest/v1/flashcard_drafts', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'apikey': supabaseAnonKey,
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
    if (draftResp.ok) {
      var draftData = await draftResp.json();
      draftId = Array.isArray(draftData) && draftData[0] ? draftData[0].id : null;
    }
  } catch(draftErr) {
    console.error('Draft save error:', draftErr.message);
  }

  res.status(200).json({ draftId: draftId, cards: validCards, count: validCards.length });
};
