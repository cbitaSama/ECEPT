# Overnight run — Update 25b conversaciones + memoria + model picker

## Commits de esta sesión

| Hash | Descripción |
|------|-------------|
| f8d6a83 | feat(25b): premium slider + visual chat formatting + extended callouts |
| f6e2042 | feat(25b-D): conversations + sidebar + model picker premium + cross-chat memory |

## ⚠️ Acciones manuales pendientes (Sebas al despertar)

1. **Correr SQL de `docs/sql_pending_25b.md` en Supabase** — crea la tabla `user_context` para la memoria de Elion.  
   Sin esto, GET `/api/user-context` devuelve `{ notes: '' }` y PATCH devuelve `503 context_not_ready` — la app no crashea pero la memoria no se guarda.

2. **Esperar deploy de Vercel preview** y verificar que los 3 nuevos endpoints estén activos:
   - `/api/conversations`
   - `/api/user-context`
   - `/api/chat` (modificado)

## Smoke tests sugeridos (en orden)

1. Abrir chat → sidebar vacío con mensaje "Aún no tenés conversaciones".
2. Mandar mensaje → se crea conv automáticamente; después de ~2s el título se actualiza.
3. Refrescar página → la conv anterior aparece en la lista.
4. Click en `[+]` → nueva conv vacía, mensajes anteriores no aparecen.
5. Long-press (500ms) en una conv → aparecen botones "✎ Renombrar" / "🗑 Archivar".
6. Renombrar → Enter guarda; título actualizado en lista.
7. Archivar → conv desaparece de la lista.
8. Click en subtítulo del header (Flash Lite · — hoy · 🪙X) → model picker abre.
9. Cards del picker muestran disponibilidad correcta según tier y créditos.
10. Cambiar modelo → se persiste en localStorage; se refleja en el subtítulo.
11. `⚙️` → modal Memoria de Elion → escribir texto → Guardar.
    - Si SQL aún no corrido: mensaje "La memoria estará disponible próximamente."
    - Si SQL corrido: guarda y cierra; próximo mensaje al chat usa el contexto.
12. En desktop, botón `⛶` → fullscreen → sidebar permanente visible a la izquierda.
13. En mobile → sidebar abre como modal full-screen con botón ✕.

## TODOs documentados

| Tag | Descripción | Archivo |
|-----|-------------|---------|
| TODO | Dev-Mode (segundo cerebro) — mencionado para próxima sesión | — |
| TODO | Fase 4: credit feedback banner + historial de créditos en ProfileView | — |
| TODO | File attachments (📎 deshabilitado) | ChatBot.js |
| TODO | Numeración de mensajes en sidebar (message_count se calcula pero no se muestra) | ChatBot.js |
| TODO | `chat_conversations.updated_at` — requiere trigger en Supabase que actualice al insertar un mensaje; sin el trigger el orden del sidebar puede ser incorrecto | conversations.js |

## Archivos creados/modificados

| Archivo | Cambio | Líneas |
|---------|--------|--------|
| `api/chat.js` | Modificado — conv persistence, user_context, auto-title | +130 |
| `api/conversations.js` | Nuevo — CRUD completo | +145 |
| `api/user-context.js` | Nuevo — GET/PATCH notas | +75 |
| `src/components/ChatBot.js` | Modificado — sidebar, model picker, settings, new state/effects | +700 / -181 |
| `docs/sql_pending_25b.md` | Nuevo — SQL para user_context | +20 |
| `index.html` + `build/ECSC.html` | Rebuilt | — |

## ES5 violations

`grep -cE '\b(const|let)\b|=>' src/components/ChatBot.js src/app.js`  
→ **0 / 0** ✓

## Bundle size

`build/ECSC.html`: **1504.9 KB** (21 818 líneas)  
Integrity checks: **121 / 121 passed** ✓
