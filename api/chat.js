// Vercel serverless function — ECEPT AI assistant proxy.
// Receives {messages, searchIndex} and calls Anthropic Messages API.
// Returns {answer, go} (go = {vista, sec} or null).

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    var hasKey = !!process.env.ANTHROPIC_API_KEY;
    res.status(200).json({ hasKey: hasKey, keyPrefix: hasKey ? process.env.ANTHROPIC_API_KEY.slice(0,10) : 'missing' });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    var apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
      return;
    }

    var body = req.body || {};
    // Vercel auto-parses JSON bodies when content-type is application/json,
    // but fall back to manual parsing if we got a string.
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    var messages = Array.isArray(body.messages) ? body.messages : [];
    var searchIndex = Array.isArray(body.searchIndex) ? body.searchIndex : [];

    var system = "Eres el asistente de ECEPT, una app de estudio médico para estudiantes de medicina latinoamericanos. Responde SIEMPRE en español latinoamericano, de forma concisa (máximo 3 oraciones). Solo responde sobre medicina y sobre el contenido de ECEPT. Si el usuario pregunta por un tema específico que existe en ECEPT, incluye el campo go con vista y sec para navegar. El índice de búsqueda de ECEPT es: " + JSON.stringify(searchIndex.slice(0, 150)) + " Responde SIEMPRE con JSON puro, sin markdown, en este formato exacto: {\"answer\": \"tu respuesta aquí\", \"go\": null} o {\"answer\": \"tu respuesta\", \"go\": {\"vista\": \"reuma\", \"sec\": \"vasculitis\"}}";

    var lastThree = messages.slice(-3).map(function (m) {
      return {
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content == null ? '' : m.content)
      };
    });

    var anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: system,
        messages: lastThree
      })
    });

    if (!anthropicResp.ok) {
      var errText = await anthropicResp.text();
      res.status(500).json({ error: 'Anthropic API error: ' + anthropicResp.status + ' ' + errText });
      return;
    }

    var data = await anthropicResp.json();
    var rawText = '';
    if (data && Array.isArray(data.content)) {
      data.content.forEach(function (block) {
        if (block && block.type === 'text' && typeof block.text === 'string') {
          rawText += block.text;
        }
      });
    }
    rawText = rawText.trim();

    var answer = rawText;
    var go = null;

    // Try to parse as JSON {answer, go}. Also tolerate answers wrapped in
    // markdown code fences (```json ... ```).
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
