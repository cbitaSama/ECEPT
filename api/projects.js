// Vercel serverless — chat_projects CRUD.
// GET             → [{id, name, description, context, color, icon, conv_count, ...}]
// POST            → body { name, description?, context?, color?, icon? }
// PATCH           → body { id, ...fields }
// DELETE          → body { id } → soft-delete (archived=true)

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const SVC_HEADERS = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json'
};

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

async function authUser(authHeader) {
  if (!authHeader) return null;
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { 'Authorization': authHeader, 'apikey': ANON_KEY }
  });
  if (!r.ok) return null;
  const u = await r.json();
  return (u && u.id) ? u : null;
}

function sanitize(body) {
  const out = {};
  if (body.name !== undefined) {
    const n = String(body.name || '').trim();
    if (!n || n.length > 100) return { error: 'name must be 1-100 chars' };
    out.name = n;
  }
  if (body.description !== undefined) {
    out.description = body.description ? String(body.description).slice(0, 500) : null;
  }
  if (body.context !== undefined) {
    out.context = body.context ? String(body.context).slice(0, 5000) : null;
  }
  if (body.color !== undefined) {
    const c = String(body.color || '');
    out.color = HEX_RE.test(c) ? c : '#a78bfa';
  }
  if (body.icon !== undefined) {
    out.icon = String(body.icon || '').slice(0, 8) || '📁';
  }
  return { ok: out };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const authHeader = req.headers.authorization;
  const user = await authUser(authHeader);
  if (!user) { res.status(401).json({ error: 'unauthorized' }); return; }
  const uid = user.id;

  // ── GET ──────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/chat_projects?user_id=eq.${uid}&archived=eq.false&order=updated_at.desc&select=*`,
      { headers: SVC_HEADERS }
    );
    const rows = await r.json();
    if (!Array.isArray(rows)) { res.status(200).json({ projects: [] }); return; }

    // Conv counts per project (optional optimization)
    let countMap = {};
    const ids = rows.map(p => p.id);
    if (ids.length > 0) {
      const cr = await fetch(
        `${SUPABASE_URL}/rest/v1/chat_conversations?user_id=eq.${uid}&archived=eq.false&project_id=in.(${ids.join(',')})&select=project_id`,
        { headers: SVC_HEADERS }
      );
      const cs = await cr.json();
      if (Array.isArray(cs)) {
        cs.forEach(c => { countMap[c.project_id] = (countMap[c.project_id] || 0) + 1; });
      }
    }
    const projects = rows.map(p => ({ ...p, conv_count: countMap[p.id] || 0 }));
    res.status(200).json({ projects });
    return;
  }

  // ── POST ─────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const body = req.body || {};
    if (!body.name) { res.status(400).json({ error: 'name required' }); return; }
    const s = sanitize(body);
    if (s.error) { res.status(400).json({ error: s.error }); return; }
    const payload = Object.assign({ user_id: uid, color: '#a78bfa', icon: '📁', archived: false }, s.ok);

    const r = await fetch(`${SUPABASE_URL}/rest/v1/chat_projects`, {
      method: 'POST',
      headers: { ...SVC_HEADERS, 'Prefer': 'return=representation' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const err = await r.text().catch(() => '');
      res.status(500).json({ error: 'insert failed', detail: err.slice(0, 200) });
      return;
    }
    const rows = await r.json();
    const proj = Array.isArray(rows) ? rows[0] : rows;
    res.status(201).json({ project: proj });
    return;
  }

  // ── PATCH ────────────────────────────────────────────────────
  if (req.method === 'PATCH') {
    const body = req.body || {};
    if (!body.id) { res.status(400).json({ error: 'id required' }); return; }
    const s = sanitize(body);
    if (s.error) { res.status(400).json({ error: s.error }); return; }
    if (Object.keys(s.ok).length === 0) { res.status(400).json({ error: 'nothing to update' }); return; }

    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/chat_projects?id=eq.${body.id}&user_id=eq.${uid}`,
      {
        method: 'PATCH',
        headers: { ...SVC_HEADERS, 'Prefer': 'return=representation' },
        body: JSON.stringify(s.ok)
      }
    );
    const rows = await r.json();
    const proj = Array.isArray(rows) ? rows[0] : rows;
    if (!proj) { res.status(404).json({ error: 'not_found' }); return; }
    res.status(200).json({ project: proj });
    return;
  }

  // ── DELETE (soft) ─────────────────────────────────────────────
  if (req.method === 'DELETE') {
    const body = req.body || {};
    if (!body.id) { res.status(400).json({ error: 'id required' }); return; }
    await fetch(
      `${SUPABASE_URL}/rest/v1/chat_projects?id=eq.${body.id}&user_id=eq.${uid}`,
      {
        method: 'PATCH',
        headers: { ...SVC_HEADERS, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ archived: true })
      }
    );
    // Quitar el project_id de las conversaciones afectadas (no eliminarlas)
    await fetch(
      `${SUPABASE_URL}/rest/v1/chat_conversations?user_id=eq.${uid}&project_id=eq.${body.id}`,
      {
        method: 'PATCH',
        headers: { ...SVC_HEADERS, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ project_id: null })
      }
    );
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
};
