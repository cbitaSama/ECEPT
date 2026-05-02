// ══════════════════════════════════════════════════════════════
// ModuleShell — wrapper consistente para vistas de módulo
// ══════════════════════════════════════════════════════════════
// Proporciona header sticky con título/subtítulo/icono/acciones,
// content area con max-width 1280 + padding generoso, y opcional
// glow premium ambient en el header (cuando premium=true).
//
// Props:
//   title     — string (h1)
//   subtitle  — string opcional (body muted)
//   icon      — string emoji o ReactElement
//   accent    — color hex para barra accent vertical (default primaryHi)
//   actions   — ReactNode opcional (botones derecha del header)
//   children  — contenido del módulo
//   premium   — boolean. Glow dorado ambient sutil.
//   onBack    — fn opcional. Si se pasa, muestra botón ← a la izquierda.
// ══════════════════════════════════════════════════════════════

function ModuleShell(props) {
  var p = T;
  var w = (typeof ECEPT_useViewport === 'function') ? ECEPT_useViewport() : 1024;
  var isDesktop = w >= p.bp.desktop;
  var accent = props.accent || p.color.primaryHi;
  var icon = props.icon;

  return e('div', {
    style: {
      minHeight: '100vh',
      animation: 'ecept_fadeIn 280ms ' + p.ease.out
    }
  },
    // ── Header sticky ──
    e('div', {
      style: {
        position: 'sticky',
        top: 0,
        zIndex: p.z.sticky,
        background: 'rgba(10,14,31,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid ' + p.color.bg4,
        boxShadow: props.premium ? p.shadow.glow_premium : 'none',
        transition: 'box-shadow 320ms ' + p.ease.out
      }
    },
      e('div', {
        style: {
          maxWidth: 1280,
          margin: '0 auto',
          padding: isDesktop ? (p.space.xl + ' ' + p.space.xxl) : (p.space.lg + ' ' + p.space.lg),
          display: 'flex',
          alignItems: 'center',
          gap: p.space.lg
        }
      },
        // Optional back button
        props.onBack && e('button', {
          onClick: props.onBack,
          'aria-label': 'Volver',
          style: {
            background: 'none',
            border: 'none',
            color: p.color.textMuted,
            fontSize: 22,
            cursor: 'pointer',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: p.radius.md,
            transition: 'background-color 200ms ease-out',
            flexShrink: 0
          },
          onMouseEnter: function(ev) { ev.currentTarget.style.background = 'rgba(255,255,255,0.05)'; },
          onMouseLeave: function(ev) { ev.currentTarget.style.background = 'none'; }
        }, '←'),
        // Accent bar
        e('div', {
          style: {
            width: 4,
            height: 36,
            background: props.premium ? p.color.gradPremium : accent,
            borderRadius: p.radius.pill,
            flexShrink: 0
          }
        }),
        // Icon
        icon && e('div', {
          style: {
            fontSize: 28,
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: accent + '14',
            border: '1px solid ' + accent + '24',
            borderRadius: p.radius.lg,
            flexShrink: 0
          }
        }, icon),
        // Title block
        e('div', { style: { flex: 1, minWidth: 0 } },
          e('h1', {
            style: {
              fontSize: isDesktop ? p.font.h1.size : p.font.h2.size,
              fontWeight: 700,
              color: p.color.text,
              letterSpacing: p.font.h1.spacing,
              lineHeight: 1.15,
              margin: 0
            }
          }, props.title),
          props.subtitle && e('div', {
            style: {
              fontSize: p.font.bodySm.size,
              color: p.color.textMuted,
              marginTop: 2,
              lineHeight: 1.4
            }
          }, props.subtitle)
        ),
        // Actions
        props.actions && e('div', { style: { display: 'flex', gap: p.space.sm, alignItems: 'center', flexShrink: 0 } }, props.actions)
      )
    ),
    // ── Content area ──
    e('div', {
      style: {
        maxWidth: 1280,
        margin: '0 auto',
        padding: isDesktop ? (p.space.xxl + ' ' + p.space.xxl) : (p.space.lg + ' ' + p.space.lg)
      }
    }, props.children)
  );
}

window.ModuleShell = ModuleShell;
