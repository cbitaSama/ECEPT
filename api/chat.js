// Vercel serverless function — ECEPT AI assistant proxy (Gemini 2.5 Flash).
// Recibe {messages, searchIndex} y devuelve {answer, go} con go = {vista, sec} o null.

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

    var systemText = "Eres el asistente de ECEPT, una app de estudio médico para estudiantes de medicina latinoamericanos. Responde SIEMPRE en español latinoamericano, de forma concisa (máximo 3 oraciones). Solo responde sobre medicina y sobre el contenido de ECEPT. Si el usuario pregunta por un tema específico que existe en ECEPT, incluye el campo go con vista y sec para navegar. El índice de búsqueda de ECEPT es: " + JSON.stringify(searchIndex.slice(0, 150)) + " Responde SIEMPRE con JSON puro, sin markdown, en este formato exacto: {\"answer\": \"tu respuesta aquí\", \"go\": null} o {\"answer\": \"tu respuesta\", \"go\": {\"vista\": \"reuma\", \"sec\": \"vasculitis\"}}";

    // Gemini: "assistant" → "model", últimos 3 turnos.
    var contents = messages.slice(-3).map(function (m) {
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(m.content == null ? '' : m.content) }]
      };
    });

    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey);

    var geminiResp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents: contents,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      })
    });

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
    var go = null;

    // Tolerate markdown code fences just in case.
    var jsonCandidate = rawText;
    var fence = jsonCandidate.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence && fence[1]) jsonCandidate = fence[1].trim();

    try {
      var parsed = JSON.parse(jsonCandidate);
      if (parsed && typeof parsed === 'object') {
        if (typeof parsed.answer === 'string') answer = parsed.answer;
        if (parsed.go && typeof parsed.go === 'object' && typeof parsed.go.vista === 'string') {
          go = { vista: parsed.go.vista, sec: parsed.go.sec == null ? null : parsed.go.sec };
        }
      }
    } catch (e) {
      // Not JSON — treat whole text as answer, go stays null.
    }

    res.status(200).json({ answer: answer, go: go });
  } catch (err) {
    res.status(500).json({ error: (err && err.message) ? err.message : 'Unknown error', stack: err ? String(err) : 'none' });
  }
};
