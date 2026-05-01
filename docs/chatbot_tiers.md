# Update 18 — ChatBot con cuenta obligatoria + tiers de acceso

## Cambios principales

### Password gate retirado
El acceso por código compartido (`CB_CODE = "210419"`, localStorage `CB_auth`) fue
eliminado completamente. Ya no existe `CB_submitCode` ni lectura/escritura de
`localStorage` en el ChatBot.

### Cuenta obligatoria (sesión Supabase)
Al abrir el panel, el ChatBot llama a `ECEPT_SUPABASE.auth.getSession()`.
- Si hay sesión activa → accede al chat.
- Si no hay sesión → muestra pantalla con botón "Crear cuenta / Iniciar sesión"
  que llama a `props.onLoginRequest()` → abre `AuthModal` desde `app.js`.

### Tiers de acceso por `role`

El campo `role` se lee de `public.profiles` al montar el componente.

| role | Modelo | Límite diario |
|---|---|---|
| `student` (default) | `gemini-2.0-flash` | 40 mensajes/día |
| `premium` | `gemini-2.5-pro-exp-03-25` | Sin límite |
| `admin` | `gemini-2.5-pro-exp-03-25` | Sin límite |

El modelo se pasa al endpoint `/api/chat` como campo `model` en el cuerpo JSON.

### Conteo server-side (`public.chat_usage`)

Tabla: `public.chat_usage`
- `user_id` (uuid), `date` (date), `message_count` (int)
- `UNIQUE(user_id, date)` — un registro por usuario por día
- RLS activa: usuarios solo pueden leer/insertar/actualizar sus propias filas

Flujo:
1. Al montar: `SELECT message_count WHERE user_id=uid AND date=today`
   → `CB_usageCount` (0 si no existe la fila, código PGRST116).
2. Al enviar (solo `student`): si `CB_usageCount < 40`, procede.
   Tras respuesta exitosa del API: `UPSERT {user_id, date, message_count: CB_usageCount+1}`
   con `onConflict="user_id,date"` → incrementa `CB_usageCount` localmente.

### UI del contador (header del panel)

- `student`: `"X / 40"` con color dinámico:
  - 0–30 → verde `#34d399`
  - 31–38 → ámbar `#fbbf24`
  - 39–40 → rojo `#ef4444`
- `premium`: `"∞"` dorado + pill `"Premium ⭐"`
- `admin`: `"∞"` azul + pill `"Admin 🔧"`

Cuando se alcanza el límite: mensaje inline ámbar en el área de chat,
input y botón de envío deshabilitados.

### Fullscreen toggle

Botón `⛶`/`↙` en el header alterna `CB_fullscreen` (boolean).
- Normal: panel `320px` fijo en esquina inferior derecha.
- Fullscreen: `position fixed, top/left/right/bottom: 0, 100vw × 100vh`,
  `background: C.bg`, `zIndex: 300` — apariencia de chat nativo.
- El botón `×` siempre cierra el panel y resetea `CB_fullscreen`.

## Archivos modificados

- `src/components/ChatBot.js` — todo lo anterior
- `src/app.js` — `e(ChatBot, {onLoginRequest: function(){setEcuShowAuth(true);}})` 
- `src/components/UserMenu.js` — texto CTA: "Iniciar sesión / Registrarse"

## Supabase: tablas relevantes

| Tabla | Uso |
|---|---|
| `public.profiles` | Lectura de `role` al montar |
| `public.chat_usage` | Lectura y upsert del contador diario (solo `student`) |

## Pendiente (updates futuras)

- Transición animada al entrar/salir de fullscreen
- Nombre personalizado del asistente (desde `profiles.display_name`)
- Sistema de pagos para upgrade a premium
- Historial de conversaciones persistido en Supabase
- Límite configurable por rol sin redespliegue
