// Vercel serverless function — Elion AI assistant (ECEPT).
// POST { messages, model, attachments?, conversationId? } → { reply, quota, conversationId }
// Tier-gated: quota (free) → credits → 402 insufficient_credits.
// Persists messages to chat_messages + manages chat_conversations.
// No npm deps — raw fetch (Node 18+).

const { TIERS, CREDIT_COSTS } = require('./_tiers');
const { getProfile, spendCredits, getDailyChatCount, incrementDailyChat } = require('./_credits');

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SVC_HEADERS = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json'
};

// Retry helper para Gemini — exponential backoff en 429/503/network errors.
// Returns the fetch Response. Throws on persistent network failure.
async function callGeminiWithRetry(url, body, maxRetries) {
  maxRetries = typeof maxRetries === 'number' ? maxRetries : 2;
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) return res;
      // Reintentar solo en 429 (rate limit) o 503 (overload)
      if ((res.status === 429 || res.status === 503) && attempt < maxRetries) {
        const waitMs = Math.pow(2, attempt) * 500; // 500ms, 1s, 2s
        console.warn(`[chat] Gemini ${res.status}, retry ${attempt + 1}/${maxRetries} in ${waitMs}ms`);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
      // Otros errores: devolver la response para que el caller maneje
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const waitMs = Math.pow(2, attempt) * 500;
        console.warn(`[chat] network error, retry ${attempt + 1}/${maxRetries} in ${waitMs}ms:`, err.message);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
    }
  }
  throw lastError || new Error('All retries failed');
}

const SYSTEM_PROMPT =
  'Eres Elion, asistente de IA de ECEPT, webapp de estudio médico para estudiantes de medicina hispanohablantes.\n\n' +
  'REGLAS DE RESPUESTA:\n' +
  '- Sé directo y conciso. Respondé lo que se pregunta, sin relleno.\n' +
  '- Por defecto: 2-4 párrafos cortos máximo, o una lista de 5-8 items.\n' +
  '- Si la pregunta es simple (definición, dato puntual): 1-2 frases.\n' +
  '- Solo extendete si el usuario pide "explicame en detalle", "profundizá", "dame todo", o si es un caso clínico complejo.\n' +
  '- Si la respuesta natural es larga, ofrecé al final: "¿Querés que profundice en algún punto?"\n\n' +
  'FORMATO — sé visualmente atractivo, los lectores valoran lo escaneable:\n\n' +
  'ESTRUCTURA: 2+ secciones → ## headers. Sub-secciones → ###. Listas 3+ items → bullets. ' +
  'Procesos en orden → numeradas. Datos comparativos → tablas markdown. Separá secciones con ---.\n\n' +
  'ÉNFASIS: **negrita** para términos clave, fármacos, diagnósticos. *cursiva* para nombres latinos. ' +
  '`código` para dosis (`500 mg/8h`), valores de laboratorio (`Na <135`), siglas técnicas.\n\n' +
  'CALLOUTS (usalos siempre que apliquen):\n' +
  '- ⚠️ **Atención:** advertencias clínicas importantes.\n' +
  '- 💡 **Tip:** perlas memotécnicas, trucos clínicos.\n' +
  '- 🚨 **Crítico:** dosis, contraindicaciones absolutas, urgencias.\n' +
  '- 📌 **Recordá:** conceptos fundacionales.\n' +
  '- 🔬 **Mecanismo:** mecanismo de acción o fisiopatología.\n' +
  '- 📊 **Datos:** epidemiología, números, estadísticas.\n' +
  '- 🩺 **Clínica:** presentación clínica típica.\n\n' +
  'EMOJIS ANCLA (uno por sección): 💊 fármacos · 🧬 genética · ❤️ cardio · 🧠 neuro · 🦠 infecto · 🩸 hema · 🦴 reuma · 🫁 respiratorio · 🧪 labs.\n\n' +
  'REGLA DE ORO: si puede ser tabla → tabla. Si puede ser callout → callout. La respuesta debe ser escaneable en 5 segundos.\n\n' +
  'ESTILO:\n' +
  '- Español latinoamericano. Terminología médica correcta.\n' +
  '- Si no estás seguro de un dato, decilo explícitamente. No inventes.\n\n' +
  'NAVEGACIÓN ECEPT — REGLAS ESTRICTAS:\n\n' +
  '1. Solo enlazá a contenido que EXISTE en ECEPT. Módulos disponibles:\n' +
  '   reuma · cir_menu · anat_menu · general · epid · triadas · fisio · coagulacion · vocabulario · flashcards · emergen_menu · trauma-u1\n\n' +
  '   Módulos con SUBSECCIONES (usá #modulo/subId para link directo):\n' +
  '   - receptores: adr (adrenérgicos), musc (muscarínicos), nic (nicotínicos),\n' +
  '     dop (dopaminérgicos), sero (serotoninérgicos), hist (histamínicos),\n' +
  '     opi (opioides), glu (glutamatérgicos), gaba (GABAérgicos), cb (cannabinoides)\n' +
  '   - mediadores: citok (citoquinas), eico (eicosanoides), comp (complemento),\n' +
  '     amin (aminas), pept (péptidos), nit (óxido nítrico)\n' +
  '   - labs: coag (coagulación), serieroja (serie roja), serieblanca (serie blanca),\n' +
  '     hepaticas, renal, ionograma, tiroideo\n' +
  '   - salud_mental: anx (ansiedad), toc, trm (trauma), som (somáticos),\n' +
  '     tca (alimentarios), sue (sueño), per (personalidad), imp (impulsos),\n' +
  '     dpr (depresivos), psicosis, neurosis\n\n' +
  '2. NUNCA inventes IDs. Si no estás seguro, enlazá al módulo padre sin subsección.\n' +
  '   IMPORTANTE: GABA está en receptores/gaba, NO en mediadores.\n' +
  '   Si el tema no existe en ECEPT (farmacología clínica, microbiología, embriología), NO incluyas link.\n\n' +
  '3. El TEXTO del link debe ser específico, NUNCA "Ver en ECEPT".\n' +
  '   ✓ [Receptores opioides en ECEPT](#receptores/opi)\n' +
  '   ✓ [Trastornos de ansiedad](#salud_mental/anx)\n' +
  '   ✓ [Eicosanoides](#mediadores/eico)\n' +
  '   ✓ [GABA en receptores](#receptores/gaba)\n' +
  '   ✗ [Ver en ECEPT](#receptores) ← nunca texto genérico\n\n' +
  '4. Si el tema toca varios módulos, incluí múltiples links precedidos por "📚 En ECEPT:".\n' +
  '   Ejemplo: "📚 En ECEPT: [Mediadores aminas](#mediadores/amin) · [Receptores serotoninérgicos](#receptores/sero) · [Trastornos de ansiedad](#salud_mental/anx)"';

const VALID_MIMES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

// ── Helpers ───────────────────────────────────────────────────────────────────

async function createConversation(uid, model) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/chat_conversations`, {
    method: 'POST',
    headers: { ...SVC_HEADERS, 'Prefer': 'return=representation' },
    body: JSON.stringify({ user_id: uid, title: 'Nueva conversación', model, archived: false })
  });
  const rows = await r.json();
  return Array.isArray(rows) ? rows[0] : rows;
}

async function verifyConvOwnership(convId, uid) {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/chat_conversations?id=eq.${convId}&user_id=eq.${uid}&select=id`,
    { headers: SVC_HEADERS }
  );
  const rows = await r.json();
  return Array.isArray(rows) && rows.length > 0;
}

async function insertMessage(convId, uid, role, content, attachments, model, paidWith, creditsSpent) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/chat_messages`, {
    method: 'POST',
    headers: { ...SVC_HEADERS, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      conversation_id: convId,
      user_id: uid,
      role,
      content: String(content || '').slice(0, 32000),
      attachments: attachments || null,
      model: model || null,
      paid_with: paidWith || null,
      credits_spent: creditsSpent || 0
    })
  });
  if (!r.ok) {
    const errBody = await r.text().catch(() => '');
    console.error(`insertMessage failed ${r.status} [${role}]:`, errBody.slice(0, 200));
  }
}

async function patchConvTitle(convId, title) {
  await fetch(
    `${SUPABASE_URL}/rest/v1/chat_conversations?id=eq.${convId}`,
    {
      method: 'PATCH',
      headers: { ...SVC_HEADERS, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ title: String(title).slice(0, 200) })
    }
  );
}

async function getUserContext(uid) {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/user_context?user_id=eq.${uid}&select=notes`,
      { headers: SVC_HEADERS }
    );
    if (!r.ok) return '';
    const rows = await r.json();
    return (Array.isArray(rows) && rows[0]) ? (rows[0].notes || '') : '';
  } catch (err) {
    return '';
  }
}

async function autoTitle(apiKey, userContent) {
  const titlePrompt =
    'Resumí en 4-6 palabras (sin comillas, sin emojis, sin punto final) ' +
    'el tema principal de esta consulta médica:\n\n' +
    String(userContent).slice(0, 200);
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: titlePrompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 32 }
      })
    });
    if (!r.ok) return null;
    const data = await r.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return null;
    let t = '';
    parts.forEach(p => { if (p?.text) t += p.text; });
    return t.trim().slice(0, 120) || null;
  } catch (err) {
    return null;
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

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

  const uid = user.id;

  // ── 2. Body ──
  const body = req.body || {};
  const { messages, model, attachments } = body;
  let { conversationId } = body;

  if (!model || !CREDIT_COSTS[model] || model === 'gen_per_card') {
    res.status(400).json({ error: 'invalid_model', valid: Object.keys(CREDIT_COSTS).filter(k => k !== 'gen_per_card') });
    return;
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'invalid_request', message: 'messages must be a non-empty array' });
    return;
  }

  // ── 3. Conversation ──
  let isNewConv = false;
  if (!conversationId) {
    try {
      const conv = await createConversation(uid, model);
      conversationId = conv && conv.id;
      isNewConv = true;
    } catch (err) {
      console.error('createConversation error:', err.message);
      // Non-fatal: proceed without persistence
    }
  } else {
    const owned = await verifyConvOwnership(conversationId, uid).catch(() => false);
    if (!owned) { res.status(403).json({ error: 'forbidden' }); return; }
  }

  // ── 4. Profile + tier ──
  const profile = await getProfile(uid);
  const role = profile?.role || 'student';
  const tier = TIERS[role] || TIERS.student;
  const currentCredits = profile?.credits || 0;

  // ── 5. Gating decision ──
  let paidWith;
  let daily = 0;
  let creditResult = null;
  const cost = CREDIT_COSTS[model];

  if (role === 'admin') {
    paidWith = 'free_admin';
  } else if (tier.models.includes(model)) {
    daily = await getDailyChatCount(uid);
    paidWith = daily < tier.dailyChat ? 'quota' : 'credits';
  } else {
    daily = await getDailyChatCount(uid);
    paidWith = 'credits';
  }

  if (paidWith === 'credits') {
    try {
      creditResult = await spendCredits(uid, cost, 'chat_' + model, { model });
    } catch (err) {
      console.error('spendCredits error:', err.message);
      res.status(500).json({ error: 'internal', message: err.message }); return;
    }
    if (!creditResult.ok && !creditResult.skipped) {
      res.status(402).json({ error: 'insufficient_credits', need: creditResult.need, have: creditResult.have });
      return;
    }
  }

  // ── 6. Validate attachments ──
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

  // ── 7. User context (memory) ──
  const userNotes = await getUserContext(uid);
  console.log('[chat] user notes length:', userNotes ? userNotes.length : 0);
  let systemPromptFull = SYSTEM_PROMPT;
  if (userNotes && userNotes.trim()) {
    systemPromptFull +=
      '\n\n=== INSTRUCCIONES PERSONALIZADAS DEL USUARIO ===\n' +
      'El usuario ha configurado las siguientes preferencias y contexto. ' +
      'Respetalas estrictamente mientras no violen las reglas anteriores ' +
      '(seguridad, ética, calidad médica):\n\n' +
      userNotes.trim() +
      '\n\n=== FIN INSTRUCCIONES PERSONALIZADAS ===';
  }

  // Capacidades extra para Pro 2.5
  if (model === 'gemini-2.5-pro') {
    systemPromptFull +=
      '\n\n=== CAPACIDADES PRO 2.5 ===\n' +
      'Cuando el usuario pida explícitamente generar un documento (PDF, Word, ' +
      'DOCX, ensayo, monografía, resumen exportable):\n' +
      '1. Producí contenido bien estructurado en markdown — usá headers (##, ###), ' +
      '   listas, tablas, citas si corresponden.\n' +
      '2. Si se mencionan referencias bibliográficas, formateá según APA 7ma edición.\n' +
      '3. Al FINAL del mensaje (no al inicio), agregá EXACTAMENTE este bloque para ' +
      '   que el frontend ofrezca botón de descarga:\n\n' +
      '   ===EXPORT_DOCUMENT===\n' +
      '   {"format":"pdf","filename":"sugerencia.pdf","title":"Título del documento"}\n' +
      '   ===END_EXPORT===\n\n' +
      '   format puede ser "pdf" o "docx" según lo pida el usuario (default pdf).\n' +
      '   filename: kebab-case sin tildes (ej: "betabloqueantes-resumen.pdf").\n' +
      '   title: título legible para portada del documento.\n' +
      'NO agregues el bloque si el usuario no está pidiendo un documento exportable. ' +
      'Para preguntas normales, respondé como siempre.\n' +
      '=== FIN CAPACIDADES PRO 2.5 ===';
  }

  // ── 8. Build Gemini contents ──
  const recent = messages.slice(-10);
  const contents = recent.map((m, idx) => {
    const parts = [{ text: String(m.content || '') }];
    if (idx === recent.length - 1 && validAttachments.length > 0) {
      validAttachments.forEach(a => parts.push({ inlineData: { mimeType: a.mimeType, data: a.data } }));
    }
    return { role: m.role === 'assistant' ? 'model' : 'user', parts };
  });

  // ── 9. Call Gemini (con retry para 429/503) ──
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  let geminiResp;
  try {
    geminiResp = await callGeminiWithRetry(geminiUrl, {
      systemInstruction: { parts: [{ text: systemPromptFull }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
    }, 2);
  } catch (err) {
    console.error('Gemini fetch error (after retries):', err.message);
    res.status(503).json({ error: 'gemini_error', upstreamStatus: 0, message: err.message }); return;
  }

  if (!geminiResp.ok) {
    const errText = await geminiResp.text().catch(() => '');
    console.error('Gemini API error:', geminiResp.status, errText.slice(0, 300));
    // Pasar status real de upstream al frontend para que muestre mensaje apropiado.
    const httpStatus = (geminiResp.status === 429 || geminiResp.status === 503) ? 503 : 500;
    res.status(httpStatus).json({
      error: 'gemini_error',
      upstreamStatus: geminiResp.status,
      message: `Gemini returned ${geminiResp.status}`
    }); return;
  }

  const geminiData = await geminiResp.json();
  let reply = '';
  const cparts = geminiData?.candidates?.[0]?.content?.parts;
  if (Array.isArray(cparts)) {
    cparts.forEach(p => { if (p?.text) reply += p.text; });
  }
  reply = reply.trim();

  // ── 10. Post-success side-effects ──
  if (paidWith === 'quota') {
    try { daily = await incrementDailyChat(uid); }
    catch (err) { console.error('incrementDailyChat error:', err.message); }
  }

  let updatedCredits = currentCredits;
  if (paidWith === 'credits' && creditResult?.ok) {
    updatedCredits = creditResult.balance;
  }

  const spent = paidWith === 'credits' ? cost : 0;

  // ── 11. Persist messages ──
  if (conversationId) {
    const userMsg = messages[messages.length - 1];
    const attachSummary = validAttachments.length > 0
      ? validAttachments.map(a => ({ name: a.name, mimeType: a.mimeType }))
      : null;
    try {
      await insertMessage(conversationId, uid, 'user', userMsg.content, attachSummary, null, null, 0);
      await insertMessage(conversationId, uid, 'assistant', reply, null, model, paidWith, spent);
    } catch (err) {
      console.error('insertMessage error:', err.message);
    }
  }

  // ── 12. Auto-title for new conversations (fire-and-forget) ──
  if (isNewConv && conversationId) {
    const userContent = messages[messages.length - 1]?.content || '';
    autoTitle(GEMINI_API_KEY, userContent)
      .then(title => { if (title) return patchConvTitle(conversationId, title); })
      .catch(err => console.error('autoTitle error:', err.message));
  }

  // ── 13. Response ──
  res.status(200).json({
    reply,
    conversationId: conversationId || null,
    quota: {
      paidWith,
      dailyUsed: daily,
      dailyLimit: tier.dailyChat,
      credits: updatedCredits,
      spent
    }
  });
};
