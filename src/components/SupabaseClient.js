'use strict';
(function () {
  var env = window.__ECEPT_ENV || {};
  var url = env.SUPABASE_URL || '';
  var key = env.SUPABASE_ANON_KEY || '';
  try {
    window.ECEPT_SUPABASE = supabase.createClient(url, key);
  } catch(err) {
    console.error('[ECEPT] Supabase init failed:', err);
    window.ECEPT_SUPABASE = null;
  }
}());
