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
      "Eres un asistente inteligente integrado en ECEPT, una app de estudio médico. " +
      "Responde SIEMPRE en español latinoamericano. Sé conciso y directo (pero la suficiente informacion el punto esta en que sepan pero ahorrar tokens). " +
      "Tu especialidad es medicina y el contenido de ECEPT, pero puedes responder preguntas generales de ciencias, biología, farmacología, etimología médica, historia de la medicina, y cualquier tema académico o educativo. Responde con sentido común — ayuda con preguntas legítimas de estudio. No respondas preguntas sobre cómo hacer daño, armas, o contenido ilegal.\n\n" +
      "MÓDULOS Y VISTAS DISPONIBLES EN ECEPT (usa estos vista IDs exactos en los links):\n\n" +
      "NAVEGACIÓN DIRECTA (sec siempre null para estos):\n" +
      "- coagulacion → Cascada de coagulación y factores (incluyendo factores vitamina K)\n" +
      "- mediadores → Mediadores inflamatorios\n" +
      "- receptores → Receptores adrenérgicos\n" +
      "- fisio → Fisiología general\n" +
      "- labs → Valores de laboratorio (hemograma, coagulación, hepáticas, renal, ionograma, tiroides)\n" +
      "- epid → Epidemiología (tipos de estudio, sesgos, medidas)\n" +
      "- triadas → Tríadas y síndromes clásicos\n" +
      "- general → Generalidades (inmunología, pares craneales)\n" +
      "- emergen_menu → Emergenciología\n" +
      "- cir_quem → Quemaduras\n" +
      "- cir_abd → Abdomen agudo\n" +
      "- cir_menu → Cirugía general\n" +
      "- cir_ing → Hernias inguinales / anatomía\n" +
      "- trauma-u1 → Trauma ATLS\n" +
      "- vocabulario → Vocabulario médico\n" +
      "- salud_mental → Salud Mental (esquizofrenia, bipolar, delirante, depresión, ansiedad, TOC, obsesión, compulsión)\n\n" +
      "REUMATOLOGÍA (usa vista reuma_sec con sec específico):\n" +
      "- vista: reuma_sec, sec: ai → Artritis reumatoidea, LES, Sjögren, Esclerodermia, SAF, Miopatías\n" +
      "- vista: reuma_sec, sec: vas → Vasculitis\n" +
      "- vista: reuma_sec, sec: misc → Fibromialgia, Gota, otras\n\n" +
      "REGLAS PARA LINKS:\n" +
      "1. Incluye TODOS los links relevantes, no solo uno. Si el tema toca coagulación, labs Y general, pon los 3.\n" +
      "2. Usa el vista ID exacto de la lista — nunca inventes IDs.\n" +
      "3. Para todo excepto reuma_sec, usa sec: null.\n" +
      "4. El label debe ser descriptivo: 'Cascada de Coagulación', 'Lab de Coagulación', no solo 'General'.\n" +
      "5. Para preguntas sobre coagulación, SIEMPRE incluye estos 3 links juntos:\n" +
      "   {vista:'coagulacion', sec:null, label:'Cascada de Coagulación'}\n" +
      "   {vista:'labs', sec:null, label:'Lab de Coagulación'}\n" +
      "   {vista:'general', sec:null, label:'Tabla de Factores'}\n" +
      "6. Para preguntas sobre salud mental (TOC, obsesión, compulsión, esquizofrenia, bipolar, etc), SIEMPRE incluye:\n" +
      "   {vista:'salud_mental', sec:null, label:'Salud Mental'}\n\n" +
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

    // Fallback chain: on 429 (rate limit) or 503 (overload), retry on the
    // next model. Lite variants generally have a separate quota bucket.
    var GEMINI_MODELS = [
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite'
    ];
    var geminiResp, modelUsed, lastStatus;
    for (var mi = 0; mi < GEMINI_MODELS.length; mi++) {
      modelUsed = GEMINI_MODELS[mi];
      var geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelUsed + ':generateContent?key=' + encodeURIComponent(apiKey);
      geminiResp = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: geminiBody
      });
      lastStatus = geminiResp.status;
      if (lastStatus !== 503 && lastStatus !== 429) break;
    }

    // If every model in the chain returned 429, surface a friendly
    // message instead of a 500 so the UI doesn't flash "Error de conexión".
    if (lastStatus === 429) {
      res.status(200).json({
        answer: 'El servicio de IA está saturado en este momento. Por favor intenta de nuevo en un minuto.',
        links: []
      });
      return;
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

    // If there are two JSON objects concatenated, take only the first complete one
    var braceCount = 0;
    var firstObjEnd = -1;
    for (var ci = 0; ci < jsonCandidate.length; ci++) {
      if (jsonCandidate[ci] === '{') braceCount++;
      if (jsonCandidate[ci] === '}') braceCount--;
      if (braceCount === 0 && ci > 0) { firstObjEnd = ci; break; }
    }
    if (firstObjEnd !== -1) jsonCandidate = jsonCandidate.slice(0, firstObjEnd + 1);

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

    // If parsing failed, surface the raw Gemini text so the user at least
    // sees the real response instead of an opaque error message.
    if (!parsedOk) {
      console.log('JSON parse failed, raw:', rawText.slice(0, 200));
      res.status(200).json({ answer: rawText, links: [] });
      return;
    }

    res.status(200).json({ answer: answer, links: links });
  } catch (err) {
    res.status(500).json({ error: (err && err.message) ? err.message : 'Unknown error', stack: err ? String(err) : 'none' });
  }
};
