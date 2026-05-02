// Vercel serverless — user memory notes for Elion.
// GET  → { notes: string }   (empty string if table/row not found)
// PATCH body { notes: string } → upsert (max 1500 chars)

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'GET' && req.method !== 'PATCH') {
    res.status(405).json({ error: 'Method not allowed' }); return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) { res.status(401).json({ error: 'unauthorized' }); return; }

  let user;
  try { user = await authUser(authHeader); }
  catch (err) { res.status(401).json({ error: 'unauthorized' }); return; }
  if (!user) { res.status(401).json({ error: 'unauthorized' }); return; }

  const uid = user.id;

  // ── GET ──────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/user_context?user_id=eq.${uid}&select=notes`,
        { headers: SVC_HEADERS }
      );
      if (!r.ok) {
        const body = await r.text();
        // 42P01 = table does not exist
        if (body.includes('42P01') || body.includes('relation') || r.status === 404) {
          res.status(200).json({ notes: '' }); return;
        }
        res.status(200).json({ notes: '' }); return;
      }
      const rows = await r.json();
      res.status(200).json({ notes: (Array.isArray(rows) && rows[0]) ? (rows[0].notes || '') : '' });
    } catch (err) {
      res.status(200).json({ notes: '' });
    }
    return;
  }

  // ── PATCH ────────────────────────────────────────────────────
  const body = req.body || {};
  const notes = String(body.notes || '').slice(0, 1500);

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/user_context`, {
      method: 'POST',
      headers: {
        ...SVC_HEADERS,
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify({ user_id: uid, notes, updated_at: new Date().toISOString() })
    });
    if (!r.ok) {
      const errBody = await r.text();
      if (errBody.includes('42P01') || errBody.includes('relation')) {
        res.status(503).json({ error: 'context_not_ready' }); return;
      }
      res.status(500).json({ error: 'save_failed' }); return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(503).json({ error: 'context_not_ready' });
  }
};
