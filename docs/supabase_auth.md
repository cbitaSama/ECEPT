# Update 17 — Supabase Auth

## Archivos creados
- src/components/SupabaseClient.js — inicializa window.ECEPT_SUPABASE
- src/components/Auth.js — modal login/signup (window.AuthModal)
- src/components/UserMenu.js — botón de sesión en sidebar (window.UserMenu)

## Archivos modificados
- src/index.html — CDN Supabase + window.__ECEPT_ENV
- src/app.js — estado ecuUser/ecuShowAuth + useEffect de sesión
- src/components/ChatBot.js — gate acepta sesión Supabase activa
- scripts/build.js — env substitution + expectedGlobals
- vercel.json — buildCommand + outputDirectory

## Schema Supabase
Tabla: public.profiles
Campos: id, username, display_name, role, credits, created_at, updated_at
RLS: activa. Trigger: auto-crea profile en signup.

## Variables de entorno (Vercel)
- SUPABASE_URL
- SUPABASE_ANON_KEY

## localStorage keys preservados
- CB_auth (ChatBot gate, se retira en Update 18)

## Pendiente (Updates futuras)
- Retirar password gate del ChatBot (Update 18)
- Perfil editable por el usuario
- Recuperación de contraseña
- Sistema de flashcards con persistencia
- Roles premium
