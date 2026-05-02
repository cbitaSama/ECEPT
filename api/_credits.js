const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function getProfile(userId) {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=credits,role`,
    { headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
  );
  const rows = await r.json();
  return rows[0] || null;
}

async function spendCredits(userId, amount, reason, meta) {
  const profile = await getProfile(userId);
  if (!profile) throw new Error('profile_not_found');
  if (profile.role === 'admin') return { skipped: true, balance: profile.credits || 0 };
  if ((profile.credits || 0) < amount) {
    return { ok: false, have: profile.credits || 0, need: amount };
  }
  const newBalance = profile.credits - amount;
  await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json', 'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ credits: newBalance })
  });
  await fetch(`${SUPABASE_URL}/rest/v1/credit_transactions`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json', 'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ user_id: userId, amount: -amount, reason, balance_after: newBalance, meta: meta || {} })
  });
  return { ok: true, balance: newBalance, spent: amount };
}

async function getDailyChatCount(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/chat_usage?user_id=eq.${userId}&date=eq.${today}&select=message_count`,
    { headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
  );
  const rows = await r.json();
  return rows[0]?.message_count || 0;
}

async function incrementDailyChat(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const current = await getDailyChatCount(userId);
  if (current === 0) {
    await fetch(`${SUPABASE_URL}/rest/v1/chat_usage`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json', 'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ user_id: userId, date: today, message_count: 1 })
    });
    return 1;
  }
  await fetch(`${SUPABASE_URL}/rest/v1/chat_usage?user_id=eq.${userId}&date=eq.${today}`, {
    method: 'PATCH',
    headers: {
      'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json', 'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ message_count: current + 1 })
  });
  return current + 1;
}

async function getMonthlyGenCount(userId) {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/flashcard_drafts?user_id=eq.${userId}&created_at=gte.${monthStart.toISOString()}&select=id`,
    { headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
  );
  const data = await r.json();
  return Array.isArray(data) ? data.length : 0;
}

module.exports = { getProfile, spendCredits, getDailyChatCount, incrementDailyChat, getMonthlyGenCount };
