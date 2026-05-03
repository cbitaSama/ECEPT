const TIERS = {
  student: { label:'Estudiante', icon:'🎓', models:['gemini-2.5-flash-lite'], dailyChat:15, monthlyGen:0 },
  premium: { label:'Premium', icon:'⭐', models:['gemini-2.5-flash-lite','gemini-2.5-flash'], dailyChat:100, monthlyGen:20 },
  admin:   { label:'Admin', icon:'👑', models:['gemini-2.5-flash-lite','gemini-2.5-flash'], dailyChat:9999, monthlyGen:9999 }
};

const CREDIT_COSTS = {
  'gemini-2.5-flash-lite': 1,
  'gemini-2.5-flash': 3,
  'gemini-2.5-pro': 15,
  'gen_per_card': 1
};

module.exports = { TIERS, CREDIT_COSTS };
