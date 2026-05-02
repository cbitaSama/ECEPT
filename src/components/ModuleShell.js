// ══════════════════════════════════════════════════════════════
// ModuleShell — wrapper consistente para vistas de módulo
// ══════════════════════════════════════════════════════════════
// REFINADO ronda 2: hero más prominente con accent radial, padding
// vertical 48-64px, título h1 con gradient, subtitle visible, container
// que aprovecha hasta 1280px con padding fluido.
//
// Props:
//   title     — string (h1)
//   subtitle  — string opcional (body muted)
//   icon      — emoji string o ReactElement
//   accent    — color hex (default primaryHi)
//   actions   — ReactNode opcional (botones derecha del hero)
//   children  — contenido del módulo (renderizado debajo del hero)
//   premium   — boolean. Glow dorado ambient sutil.
//   onBack    — fn opcional. Si se pasa, muestra botón ← arriba a la izquierda.
// ══════════════════════════════════════════════════════════════

function ModuleShell(props) {
  var p = T;
  var w = (typeof ECEPT_useViewport === 'function') ? ECEPT_useViewport() : 1024;
  var isDesktop = w >= p.bp.desktop;
  var isMobile = w < p.bp.tablet;
  var accent = props.accent || p.color.primaryHi;
  var icon = props.icon;
  var hexA = accent.length >= 7 ? accent : (accent + '00');
  // Convertir hex a rgb para tints
  function hexToRgb(hex) {
    var h = hex.replace('#','');
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    var num = parseInt(h, 16);
    return [(num>>16)&255, (num>>8)&255, num&255];
  }
  var rgb = hexToRgb(accent);
  var rgbStr = rgb[0]+','+rgb[1]+','+rgb[2];

  return e('div', {
    style: {
      width: '100%',
      minHeight: '100vh',
      animation: 'ecept_fadeIn 280ms ' + p.ease.out,
      boxSizing: 'border-box'
    }
  },
    // ── HERO con accent radial ──
    e('div', {
      style: {
        width: '100%',
        position: 'relative',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba('+rgbStr+',0.10) 0%, rgba('+rgbStr+',0.04) 35%, transparent 70%)',
        borderBottom: '1px solid ' + p.color.bg4,
        padding: '0 max(' + (isDesktop ? 32 : 16) + 'px, calc((100vw - 1280px) / 2 + 32px))',
        boxSizing: 'border-box'
      }
    },
      // Optional back button (top-left)
      props.onBack && e('div', { style: { padding: (isDesktop ? '20px' : '16px') + ' 0 0' } },
        e('button', {
          onClick: props.onBack,
          'aria-label': 'Volver',
          style: {
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid ' + p.color.bg4,
            color: p.color.textMuted,
            fontSize: 18,
            cursor: 'pointer',
            width: 40,
            height: 40,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: p.radius.md,
            transition: 'all 200ms ease-out'
          },
          onMouseEnter: function(ev) { ev.currentTarget.style.background = 'rgba(255,255,255,0.08)'; ev.currentTarget.style.borderColor = accent + '50'; },
          onMouseLeave: function(ev) { ev.currentTarget.style.background = 'rgba(255,255,255,0.04)'; ev.currentTarget.style.borderColor = p.color.bg4; }
        }, '←')
      ),
      // Hero content
      e('div', {
        style: {
          maxWidth: 1280,
          margin: '0 auto',
          padding: (isDesktop ? '56px 0 40px' : '32px 0 24px'),
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? p.space.md : p.space.lg,
          flexDirection: isMobile ? 'column' : 'row',
          boxSizing: 'border-box'
        }
      },
        // Icon container
        icon && e('div', {
          style: {
            fontSize: isDesktop ? 40 : 32,
            width: isDesktop ? 80 : 64,
            height: isDesktop ? 80 : 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba('+rgbStr+',0.18), rgba('+rgbStr+',0.08))',
            border: '1px solid rgba('+rgbStr+',0.32)',
            borderRadius: p.radius.xl,
            flexShrink: 0,
            boxShadow: props.premium ? p.shadow.glow_premium : ('0 0 24px rgba('+rgbStr+',0.15)')
          }
        }, icon),
        // Title block
        e('div', { style: { flex: 1, minWidth: 0 } },
          e('h1', {
            style: {
              fontSize: isDesktop ? '40px' : '28px',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              background: 'linear-gradient(135deg, #e2e8f0 0%, ' + accent + ' 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
              margin: 0
            }
          }, props.title),
          props.subtitle && e('div', {
            style: {
              fontSize: isDesktop ? p.font.body.size : p.font.bodySm.size,
              color: p.color.textMuted,
              marginTop: 6,
              lineHeight: 1.5,
              fontWeight: 500
            }
          }, props.subtitle)
        ),
        // Actions slot
        props.actions && e('div', { style: { display: 'flex', gap: p.space.sm, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' } }, props.actions)
      )
    ),
    // ── Content area ──
    e('div', {
      style: {
        maxWidth: 1280,
        margin: '0 auto',
        padding: (isDesktop ? '40px 0 80px' : '24px 0 60px'),
        paddingLeft: 'max(' + (isDesktop ? 32 : 16) + 'px, calc((100vw - 1280px) / 2 + 32px))',
        paddingRight: 'max(' + (isDesktop ? 32 : 16) + 'px, calc((100vw - 1280px) / 2 + 32px))',
        boxSizing: 'border-box'
      }
    }, props.children)
  );
}

window.ModuleShell = ModuleShell;
