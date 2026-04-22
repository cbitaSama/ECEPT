// Vercel serverless function — ECEPT AI assistant proxy (Gemini 2.5 Flash).
// Recibe {messages, searchIndex} y devuelve {answer, links} con links = array de {vista, sec, label}.

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    var hasKey = !!process.env.GEMINI_API_KEY;
    res.status(200).json({ hasKey: hasKey, keyPrefix: hasKey ? process.env.GEMINI_API_KEY.slice(0, 10) : 'missing' });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    var apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
      return;
    }

    var body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    var messages = Array.isArray(body.messages) ? body.messages : [];
    var searchIndex = Array.isArray(body.searchIndex) ? body.searchIndex : [];

    var systemText =
      "Eres el asistente de ECEPT, una app de estudio médico para estudiantes de medicina latinoamericanos. " +
      "Responde SIEMPRE en español latinoamericano. Sé conciso y directo (pero la suficiente informacion el punto esta en que sepan pero ahorrar tokens). " +
      "Solo responde sobre medicina y sobre el contenido de ECEPT.\n\n" +
      "MÓDULOS DISPONIBLES EN ECEPT (solo estos existen, no inventes otros):\n" +
      "- reuma → Reumatología (AR, LES, Sjögren, Esclerodermia, SAF, Vasculitis, Fibromialgia)\n" +
      "- general → Generalidades (Inmunología, Pares Craneales, Cascada de Coagulación, Mediadores, Receptores)\n" +
      "- epid → Epidemiología (Tipos de estudio, Sesgos, Medidas, Lectura crítica)\n" +
      "- triadas → Tríadas y Síndromes clásicos\n" +
      "- labs → Valores de Laboratorio (Hemograma, Coagulación, Hepáticas, Renal, Ionograma, Tiroides)\n" +
      "- fisio → Fisiología (Receptores adrenérgicos, SNA, Proteínas G)\n" +
      "- emergen → Emergenciología (Quemaduras, ATLS, RCP, Shock)\n" +
      "- trauma → Trauma (ATLS completo)\n" +
      "- salud_mental → Salud Mental (Esquizofrenia, Trastorno Bipolar, Trastorno Delirante, Depresión, Ansiedad, TOC)\n" +
      "- cirugia → Cirugía (Abdomen agudo, Hernias)\n" +
      "- anatomia → Anatomía (Conducto inguinal)\n" +
      "- vocab → Vocabulario médico\n\n" +
      "Cuando el usuario pregunte algo relacionado con uno o más módulos, incluye links de navegación en el campo 'links' (array). Cada link tiene {vista, sec, label}.\n\n" +
      "Responde SIEMPRE con JSON puro, sin markdown, en este formato exacto:\n" +
      "{\"answer\": \"tu respuesta aquí\", \"links\": []}\n" +
      "o con links:\n" +
      "{\"answer\": \"tu respuesta\", \"links\": [{\"vista\": \"general\", \"sec\": \"coag\", \"label\": \"Cascada de Coagulación\"}, {\"vista\": \"labs\", \"sec\": null, \"label\": \"Laboratorio de Coagulación\"}]}\n\n" +
      "CRÍTICO: responde ÚNICAMENTE con el objeto JSON. Sin texto antes, sin texto después, sin explicaciones, sin markdown.";

    // Gemini: "assistant" → "model", últimos 3 turnos.
    var contents = messages.slice(-3).map(function (m) {
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(m.content == null ? '' : m.content) }]
      };
    });

    var geminiBody = JSON.stringify({
      systemInstruction: { parts: [{ text: systemText }] },
      contents: contents,
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    });

    // Fallback: try 2.5-flash first; on 503 (overloaded) retry once with 1.5-flash.
    var GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash'];
    var geminiResp, modelUsed;
    for (var mi = 0; mi < GEMINI_MODELS.length; mi++) {
      modelUsed = GEMINI_MODELS[mi];
      var geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelUsed + ':generateContent?key=' + encodeURIComponent(apiKey);
      geminiResp = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: geminiBody
      });
      if (geminiResp.status !== 503) break;
    }

    if (!geminiResp.ok) {
      var errText = await geminiResp.text();
      res.status(500).json({ error: 'Gemini API error: ' + geminiResp.status + ' ' + errText });
      return;
    }

    var data = await geminiResp.json();
    var rawText = '';
    if (data && Array.isArray(data.candidates) && data.candidates[0] && data.candidates[0].content && Array.isArray(data.candidates[0].content.parts)) {
      data.candidates[0].content.parts.forEach(function (p) {
        if (p && typeof p.text === 'string') rawText += p.text;
      });
    }
    rawText = rawText.trim();

    var answer = rawText;
    var links = [];

    // Extract the JSON object — strip markdown fences and any prefix/suffix
    // text around the outermost { … } so Gemini preambles like
    // "Here is the JSON requested" don't leak into answer.
    var jsonCandidate = rawText;
    var fence = jsonCandidate.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence && fence[1]) jsonCandidate = fence[1].trim();
    var firstBrace = jsonCandidate.indexOf('{');
    var lastBrace = jsonCandidate.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      jsonCandidate = jsonCandidate.slice(firstBrace, lastBrace + 1);
    }

    var parsedOk = false;
    try {
      var parsed = JSON.parse(jsonCandidate);
      if (parsed && typeof parsed === 'object') {
        parsedOk = true;
        if (typeof parsed.answer === 'string') answer = parsed.answer;
        if (Array.isArray(parsed.links)) {
          links = parsed.links
            .filter(function (l) { return l && typeof l === 'object' && typeof l.vista === 'string'; })
            .map(function (l) {
              return {
                vista: l.vista,
                sec: l.sec == null ? null : l.sec,
                label: typeof l.label === 'string' ? l.label : l.vista
              };
            });
        }
      }
    } catch (e) {
      // JSON parse failed — handled below.
    }

    // If parsing failed, scrub common English/Spanish preambles so the user
    // doesn't see "Here is the JSON requested" as the assistant's reply.
    if (!parsedOk) {
      answer = rawText
        .replace(/^\s*(here('?s| is)|aqu[ií]( (est[aá]|tienes))?|claro[:,]?)[^\n]*\n+/i, '')
        .replace(/^\s*\{[\s\S]*$/, '')
        .trim();
      if (!answer) answer = 'No pude generar una respuesta válida. Intenta reformular tu pregunta.';
    }

    res.status(200).json({ answer: answer, links: links });
  } catch (err) {
    res.status(500).json({ error: (err && err.message) ? err.message : 'Unknown error', stack: err ? String(err) : 'none' });
  }
};
