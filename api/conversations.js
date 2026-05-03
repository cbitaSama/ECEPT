// Vercel serverless — conversation CRUD for Elion chat history.
// GET ?id=<uuid>  → { conversation, messages }
// GET (no id)    → [{ id, title, model, updated_at, message_count }]
// POST           → body { title?, model? } → created conversation
// PATCH          → body { id, title?, archived? } → updated conversation
// DELETE         → body { id } → soft-delete (archived=true)

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const SVC_HEADERS = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json'
};

async function authUser(authHeader) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { 'Authorization': authHeader, 'apikey': ANON_KEY }
  });
  if (!r.ok) return null;
  const u = await r.json();
  return (u && u.id) ? u : null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const authHeader = req.headers.authorization;
  if (!authHeader) { res.status(401).json({ error: 'unauthorized' }); return; }

  let user;
  try { user = await authUser(authHeader); }
  catch (err) { res.status(401).json({ error: 'unauthorized' }); return; }
  if (!user) { res.status(401).json({ error: 'unauthorized' }); return; }

  const uid = user.id;

  // ── GET ──────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const convId = req.query && req.query.id;
    const searchQ = req.query && req.query.q;

    // Búsqueda en title + content de mensajes
    if (searchQ && String(searchQ).trim().length >= 2) {
      const q = encodeURIComponent('%' + String(searchQ).trim().slice(0, 100) + '%');
      const titleR = await fetch(
        `${SUPABASE_URL}/rest/v1/chat_conversations?user_id=eq.${uid}&archived=eq.false&title=ilike.${q}&select=id,title,updated_at,project_id&limit=20`,
        { headers: SVC_HEADERS }
      );
      const titleRows = await titleR.json();
      // Buscar en messages y joinar a conversation
      const msgR = await fetch(
        `${SUPABASE_URL}/rest/v1/chat_messages?content=ilike.${q}&select=conversation_id,content,role,chat_conversations!inner(id,title,user_id,archived,project_id)&chat_conversations.user_id=eq.${uid}&chat_conversations.archived=eq.false&limit=50`,
        { headers: SVC_HEADERS }
      );
      const msgRows = await msgR.json();
      const seen = {};
      const out = [];
      (Array.isArray(titleRows) ? titleRows : []).forEach(c => {
        if (seen[c.id]) return;
        seen[c.id] = 1;
        out.push({ id: c.id, title: c.title, project_id: c.project_id, snippet: null, matchType: 'title' });
      });
      (Array.isArray(msgRows) ? msgRows : []).forEach(m => {
        const cid = m.conversation_id;
        if (seen[cid]) return;
        seen[cid] = 1;
        const txt = String(m.content || '');
        const idx = txt.toLowerCase().indexOf(String(searchQ).toLowerCase());
        let snippet = txt.slice(0, 100);
        if (idx > 0) {
          const start = Math.max(0, idx - 30);
          const end = Math.min(txt.length, idx + searchQ.length + 30);
          snippet = (start > 0 ? '...' : '') + txt.slice(start, end) + (end < txt.length ? '...' : '');
        }
        out.push({ id: cid, title: (m.chat_conversations && m.chat_conversations.title) || 'Conversación', project_id: m.chat_conversations && m.chat_conversations.project_id, snippet: snippet, matchType: 'content' });
      });
      res.status(200).json({ results: out });
      return;
    }

    if (convId) {
      // Single conversation + its messages
      const convR = await fetch(
        `${SUPABASE_URL}/rest/v1/chat_conversations?id=eq.${convId}&user_id=eq.${uid}&select=*`,
        { headers: SVC_HEADERS }
      );
      const convRows = await convR.json();
      if (!convRows || convRows.length === 0) {
        res.status(404).json({ error: 'not_found' }); return;
      }
      const msgsR = await fetch(
        `${SUPABASE_URL}/rest/v1/chat_messages?conversation_id=eq.${convId}&order=created_at.asc&select=*`,
        { headers: SVC_HEADERS }
      );
      const messages = await msgsR.json();
      res.status(200).json({ conversation: convRows[0], messages: Array.isArray(messages) ? messages : [] });
      return;
    }

    // List (non-archived, latest first)
    const listR = await fetch(
      `${SUPABASE_URL}/rest/v1/chat_conversations?user_id=eq.${uid}&archived=eq.false&order=updated_at.desc&limit=200&select=id,title,model,updated_at,project_id`,
      { headers: SVC_HEADERS }
    );
    const convs = await listR.json();
    if (!Array.isArray(convs)) { res.status(200).json([]); return; }

    // Fetch message counts in one query
    const ids = convs.map(c => c.id);
    let countMap = {};
    if (ids.length > 0) {
      const inList = ids.map(id => `"${id}"`).join(',');
      const cntR = await fetch(
        `${SUPABASE_URL}/rest/v1/chat_messages?conversation_id=in.(${ids.join(',')})&select=conversation_id`,
        { headers: { ...SVC_HEADERS, 'Prefer': 'count=exact' } }
      );
      // Use groupBy via RPC isn't available without custom function;
      // count per conv from full result set (max 100 convs × avg messages)
      const allMsgs = await cntR.json();
      if (Array.isArray(allMsgs)) {
        allMsgs.forEach(m => {
          countMap[m.conversation_id] = (countMap[m.conversation_id] || 0) + 1;
        });
      }
    }

    const result = convs.map(c => ({ ...c, message_count: countMap[c.id] || 0 }));
    res.status(200).json(result);
    return;
  }

  // ── POST ─────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const body = req.body || {};
    const title = String(body.title || 'Nueva conversación').slice(0, 200);
    const model = String(body.model || 'gemini-2.5-flash-lite').slice(0, 80);

    const insR = await fetch(`${SUPABASE_URL}/rest/v1/chat_conversations`, {
      method: 'POST',
      headers: { ...SVC_HEADERS, 'Prefer': 'return=representation' },
      body: JSON.stringify({ user_id: uid, title, model, archived: false })
    });
    const rows = await insR.json();
    res.status(201).json(Array.isArray(rows) ? rows[0] : rows);
    return;
  }

  // ── PATCH ────────────────────────────────────────────────────
  if (req.method === 'PATCH') {
    const body = req.body || {};
    const convId = body.id;
    if (!convId) { res.status(400).json({ error: 'id required' }); return; }

    const patch = {};
    if (body.title !== undefined) patch.title = String(body.title).slice(0, 200);
    if (body.archived !== undefined) patch.archived = Boolean(body.archived);
    if (body.project_id !== undefined) patch.project_id = body.project_id || null; // null = quitar proyecto
    if (Object.keys(patch).length === 0) { res.status(400).json({ error: 'nothing to update' }); return; }

    const upR = await fetch(
      `${SUPABASE_URL}/rest/v1/chat_conversations?id=eq.${convId}&user_id=eq.${uid}`,
      {
        method: 'PATCH',
        headers: { ...SVC_HEADERS, 'Prefer': 'return=representation' },
        body: JSON.stringify(patch)
      }
    );
    const rows = await upR.json();
    const conv = Array.isArray(rows) ? rows[0] : rows;
    if (!conv) { res.status(404).json({ error: 'not_found' }); return; }
    res.status(200).json({ ok: true, conversation: conv });
    return;
  }

  // ── DELETE (soft) ─────────────────────────────────────────────
  if (req.method === 'DELETE') {
    const body = req.body || {};
    const convId = body.id;
    if (!convId) { res.status(400).json({ error: 'id required' }); return; }

    await fetch(
      `${SUPABASE_URL}/rest/v1/chat_conversations?id=eq.${convId}&user_id=eq.${uid}`,
      {
        method: 'PATCH',
        headers: { ...SVC_HEADERS, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ archived: true })
      }
    );
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
