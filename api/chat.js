// Vercel serverless function — Elion AI assistant (ECEPT).
// POST { messages, model, attachments? } → { reply, quota }
// Tier-gated: quota (free) → credits → 402 insufficient_credits.
// No npm deps — raw fetch (Node 18+).

const { TIERS, CREDIT_COSTS } = require('./_tiers');
const { getProfile, spendCredits, getDailyChatCount, incrementDailyChat } = require('./_credits');

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT =
  'Eres Elion, asistente de IA de ECEPT, webapp de estudio médico para estudiantes de medicina hispanohablantes.\n\n' +
  'REGLAS DE RESPUESTA:\n' +
  '- Sé directo y conciso. Respondé lo que se pregunta, sin relleno.\n' +
  '- Por defecto: 2-4 párrafos cortos máximo, o una lista de 5-8 items.\n' +
  '- Si la pregunta es simple (definición, dato puntual): 1-2 frases.\n' +
  '- Solo extendete si el usuario pide "explicame en detalle", "profundizá", "dame todo", o si es un caso clínico complejo.\n' +
  '- Si la respuesta natural es larga, ofrecé al final: "¿Querés que profundice en algún punto?"\n\n' +
  'FORMATO:\n' +
  '- Usá markdown: **negritas** para términos clave, listas para enumeraciones, ## headers solo si hay 3+ secciones.\n' +
  '- Para datos comparativos usá tablas markdown.\n' +
  '- Para advertencias clínicas: ⚠️ **Atención:** texto.\n' +
  '- Para perlas/tips: 💡 **Tip:** texto.\n' +
  '- Para datos críticos (dosis, contraindicaciones): 🚨 texto.\n\n' +
  'ESTILO:\n' +
  '- Español latinoamericano. Terminología médica correcta.\n' +
  '- Si no estás seguro de un dato, decilo explícitamente. No inventes.\n\n' +
  'NAVEGACIÓN ECEPT:\n' +
  'Cuando el usuario pregunte por un tema que existe en ECEPT, incluí un enlace markdown al final con el formato [Ver en ECEPT](#ruta).\n' +
  'Módulos disponibles: #reuma (Reumatología), #cir_menu (Cirugía), #anat_menu (Anatomía), #general (Generalidades/Inmunología), ' +
  '#epid (Epidemiología), #triadas (Tríadas y Síndromes), #labs (Laboratorios), #fisio (Fisiología), ' +
  '#receptores (Receptores celulares), #mediadores (Mediadores inflamación), #coagulacion (Coagulación), ' +
  '#salud_mental (Psiquiatría), #emergen_menu (Emergenciología), #trauma-u1 (Trauma), #vocabulario (Vocabulario médico), #flashcards (Flashcards).\n' +
  'Solo incluí el link si el módulo es directamente relevante. Un link máximo por respuesta.\n' +
  'Para subsecciones específicas usá el formato [texto](#modulo/subseccion). ' +
  'Ejemplos: [Receptores adrenérgicos](#receptores/adr), [Receptores muscarínicos](#receptores/musc), ' +
  '[Receptores dopaminérgicos](#receptores/dop), [Citocinas](#mediadores/citok), ' +
  '[Eicosanoides](#mediadores/eico), [Complemento](#mediadores/comp), ' +
  '[Coagulación](#labs/coag), [Hemograma](#labs/hemo).';

const VALID_MIMES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
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

  // ── 2. Body ──
  const body = req.body || {};
  const { messages, model, attachments } = body;

  if (!model || !CREDIT_COSTS[model] || model === 'gen_per_card') {
    res.status(400).json({ error: 'invalid_model', valid: Object.keys(CREDIT_COSTS).filter(k => k !== 'gen_per_card') });
    return;
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'invalid_request', message: 'messages must be a non-empty array' });
    return;
  }

  // ── 3. Profile + tier ──
  const profile = await getProfile(user.id);
  const role = profile?.role || 'student';
  const tier = TIERS[role] || TIERS.student;
  const currentCredits = profile?.credits || 0;

  // ── 4. Gating decision ──
  let paidWith;
  let daily = 0;
  let creditResult = null;
  const cost = CREDIT_COSTS[model];

  if (role === 'admin') {
    paidWith = 'free_admin';
  } else if (tier.models.includes(model)) {
    daily = await getDailyChatCount(user.id);
    paidWith = daily < tier.dailyChat ? 'quota' : 'credits';
  } else {
    // Model not in tier (e.g. student → 2.5-flash, or anyone → 2.5-pro)
    daily = await getDailyChatCount(user.id);
    paidWith = 'credits';
  }

  if (paidWith === 'credits') {
    try {
      creditResult = await spendCredits(user.id, cost, 'chat_' + model, { model });
    } catch (err) {
      console.error('spendCredits error:', err.message);
      res.status(500).json({ error: 'internal', message: err.message }); return;
    }
    if (!creditResult.ok && !creditResult.skipped) {
      res.status(402).json({ error: 'insufficient_credits', need: creditResult.need, have: creditResult.have });
      return;
    }
  }

  // ── 5. Validate attachments ──
  const validAttachments = [];
  if (Array.isArray(attachments) && attachments.length > 0) {
    for (const a of attachments) {
      if (!a || !a.mimeType || !a.data) continue;
      if (!VALID_MIMES.includes(a.mimeType)) {
        res.status(400).json({ error: 'invalid_attachment', message: `Unsupported type: ${a.mimeType}` });
        return;
      }
      if (Buffer.byteLength(a.data, 'base64') > MAX_ATTACHMENT_BYTES) {
        res.status(400).json({ error: 'invalid_attachment', message: `File too large (max 10 MB): ${a.name || ''}` });
        return;
      }
      validAttachments.push(a);
    }
  }

  // ── 6. Build Gemini contents ──
  const recent = messages.slice(-10);
  const contents = recent.map((m, idx) => {
    const parts = [{ text: String(m.content || '') }];
    // Attach files to the last message only
    if (idx === recent.length - 1 && validAttachments.length > 0) {
      validAttachments.forEach(a => parts.push({ inlineData: { mimeType: a.mimeType, data: a.data } }));
    }
    return { role: m.role === 'assistant' ? 'model' : 'user', parts };
  });

  // ── 7. Call Gemini ──
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  let geminiResp;
  try {
    geminiResp = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
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
  let reply = '';
  const cparts = geminiData?.candidates?.[0]?.content?.parts;
  if (Array.isArray(cparts)) {
    cparts.forEach(p => { if (p?.text) reply += p.text; });
  }
  reply = reply.trim();

  // ── 8. Post-success side-effects ──
  if (paidWith === 'quota') {
    try {
      daily = await incrementDailyChat(user.id);
    } catch (err) {
      console.error('incrementDailyChat error:', err.message);
      // Non-fatal — don't fail the response
    }
  }

  // Resolve updated credits (use spendCredits return value to avoid extra fetch)
  let updatedCredits = currentCredits;
  if (paidWith === 'credits' && creditResult?.ok) {
    updatedCredits = creditResult.balance;
  }

  // ── 9. Response ──
  res.status(200).json({
    reply,
    quota: {
      paidWith,
      dailyUsed: daily,
      dailyLimit: tier.dailyChat,
      credits: updatedCredits,
      spent: paidWith === 'credits' ? cost : 0
    }
  });
};
