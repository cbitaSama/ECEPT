// ══════════════════════════════════════════════════════════════
// Layered — infraestructura de capas progresivas
// ══════════════════════════════════════════════════════════════
// Componentes para construir UIs con jerarquía de información:
//   - CollapsibleSection: sección expandible con animación.
//   - Detail: wrapper "ver más" inline.
//   - LayeredCard: card con 3 niveles (resumen / detalles / profundizar).
//   - InfoLayer: panel lateral derecho 480px para "profundizar".
//
// USO FUTURO (no se migra contenido todavía):
// 1. Identificá un módulo denso (ej: ReceptoresView con 30 ítems).
// 2. Reemplazá los items planos por LayeredCard:
//      e(LayeredCard, {
//        title: 'β1-adrenérgico', summary: 'Cardioacelerador',
//        details: e(...info media...),
//        deepDive: e(...info larga + tablas...),
//        icon: '💓', accent: '#ef4444'
//      })
// 3. Para secciones largas dentro de un detail view, usá CollapsibleSection
//    con level (1=h2, 2=h3, 3=h4) para jerarquía consistente.
// 4. Para abrir contenido extra sin perder contexto, InfoLayer slidea
//    desde la derecha (no modal centrado).
//
// Estos primitives respetan los design tokens (T) y las animaciones
// premium (ease.standard, ease.out). NO modifican datos.
// ══════════════════════════════════════════════════════════════

// ─── CollapsibleSection ────────────────────────────────────
function CollapsibleSection(props) {
  var p = T;
  var s = useState(!!props.defaultOpen);
  var open = s[0];
  var setOpen = s[1];
  var level = props.level || 1;
  var accent = props.accent || p.color.primaryHi;
  var titleSize = level === 1 ? p.font.h2.size : (level === 2 ? p.font.h3.size : p.font.body.size);
  var titleWeight = level === 1 ? 700 : (level === 2 ? 600 : 500);

  return e('div', {
    style: {
      borderRadius: p.radius.lg,
      border: '1px solid ' + (open ? accent + '30' : p.color.bg4),
      background: open ? 'linear-gradient(180deg,' + p.color.bg2 + ',' + p.color.bg1 + ')' : p.color.bg2,
      transition: 'border-color 240ms ' + p.ease.standard + ', background-color 240ms ease',
      overflow: 'hidden',
      marginBottom: p.space.md
    }
  },
    e('button', {
      onClick: function() { setOpen(!open); },
      style: {
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: p.space.lg + ' ' + p.space.xl,
        display: 'flex',
        alignItems: 'center',
        gap: p.space.md,
        color: p.color.text
      }
    },
      e('span', {
        style: {
          color: accent,
          fontSize: 14,
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 280ms ' + p.ease.standard,
          display: 'inline-block',
          flexShrink: 0
        }
      }, '▶'),
      e('span', { style: { fontSize: titleSize, fontWeight: titleWeight, letterSpacing: '-0.01em', flex: 1 } }, props.title),
      props.badge && e('span', { style: { fontSize: p.font.micro.size, padding: '2px 8px', borderRadius: p.radius.pill, background: accent + '18', color: accent, fontWeight: 700 } }, props.badge)
    ),
    open && e('div', {
      style: {
        padding: '0 ' + p.space.xl + ' ' + p.space.lg,
        animation: 'ecept_fadeSlideDown 280ms ' + p.ease.out
      }
    }, props.children)
  );
}
window.CollapsibleSection = CollapsibleSection;

// ─── Detail ────────────────────────────────────────────────
function Detail(props) {
  var p = T;
  var s = useState(false);
  var open = s[0];
  var setOpen = s[1];

  return e('span', { style: { display: 'inline' } },
    e('button', {
      onClick: function() { setOpen(!open); },
      style: {
        background: 'none',
        border: 'none',
        color: p.color.primaryHi,
        cursor: 'pointer',
        fontSize: 'inherit',
        padding: 0,
        textDecoration: 'underline',
        textDecorationStyle: 'dotted',
        textUnderlineOffset: 3
      }
    }, props.summary),
    open && e('span', {
      style: {
        display: 'block',
        marginTop: p.space.xs,
        padding: p.space.sm + ' ' + p.space.md,
        background: p.color.primarySoft,
        borderLeft: '2px solid ' + p.color.primaryHi,
        borderRadius: '0 ' + p.radius.sm + ' ' + p.radius.sm + ' 0',
        color: p.color.text,
        fontSize: p.font.bodySm.size,
        lineHeight: 1.55,
        animation: 'ecept_fadeSlideDown 240ms ' + p.ease.out
      }
    }, props.children)
  );
}
window.Detail = Detail;

// ─── LayeredCard ────────────────────────────────────────────
function LayeredCard(props) {
  var p = T;
  var sExp = useState(false);
  var expanded = sExp[0];
  var setExpanded = sExp[1];
  var sLayer = useState(false);
  var layerOpen = sLayer[0];
  var setLayerOpen = sLayer[1];
  var accent = props.accent || p.color.primaryHi;

  return e('div', {
    style: {
      background: p.color.gradSurface,
      border: '1px solid ' + (expanded ? accent + '40' : p.color.bg4),
      borderRadius: p.radius.xl,
      padding: p.space.lg + ' ' + p.space.xl,
      transition: 'all 240ms ' + p.ease.standard,
      boxShadow: expanded ? p.shadow.md : 'none'
    }
  },
    // Top: icon + title + summary
    e('div', { style: { display: 'flex', alignItems: 'flex-start', gap: p.space.md } },
      props.icon && e('span', {
        style: {
          fontSize: 22,
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: accent + '14',
          border: '1px solid ' + accent + '24',
          borderRadius: p.radius.md,
          flexShrink: 0
        }
      }, props.icon),
      e('div', { style: { flex: 1, minWidth: 0 } },
        e('div', { style: { fontSize: p.font.h3.size, fontWeight: 600, color: p.color.text, marginBottom: 2 } }, props.title),
        props.summary && e('div', { style: { fontSize: p.font.bodySm.size, color: p.color.textMuted, lineHeight: 1.5 } }, props.summary)
      ),
      // Toggle expand
      props.details && e('button', {
        onClick: function() { setExpanded(!expanded); },
        'aria-label': expanded ? 'Contraer' : 'Expandir',
        style: {
          background: 'none',
          border: '1px solid ' + p.color.bg4,
          borderRadius: p.radius.sm,
          color: p.color.textMuted,
          fontSize: 13,
          width: 32,
          height: 32,
          cursor: 'pointer',
          flexShrink: 0,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 280ms ' + p.ease.standard
        }
      }, '▾')
    ),
    // Mid: details
    expanded && props.details && e('div', {
      style: {
        marginTop: p.space.lg,
        paddingTop: p.space.lg,
        borderTop: '1px solid ' + p.color.bg4,
        animation: 'ecept_fadeSlideDown 280ms ' + p.ease.out
      }
    }, props.details),
    // Bottom: deepDive trigger
    expanded && props.deepDive && e('button', {
      onClick: function() { setLayerOpen(true); },
      style: {
        marginTop: p.space.md,
        background: 'none',
        border: 'none',
        color: accent,
        cursor: 'pointer',
        fontSize: p.font.bodySm.size,
        fontWeight: 600,
        padding: '4px 0',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, 'Profundizar', e('span', null, '→')),
    // Side panel
    layerOpen && props.deepDive && e(InfoLayer, {
      open: layerOpen,
      onClose: function() { setLayerOpen(false); },
      title: props.title,
      accent: accent
    }, props.deepDive)
  );
}
window.LayeredCard = LayeredCard;

// ─── InfoLayer ──────────────────────────────────────────────
function InfoLayer(props) {
  var p = T;
  if (!props.open) return null;
  var accent = props.accent || p.color.primaryHi;

  return e('div', {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: p.z.modal,
      animation: 'ecept_fadeIn 240ms ' + p.ease.out
    }
  },
    // Backdrop
    e('div', {
      onClick: props.onClose,
      style: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(6,10,20,0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }
    }),
    // Panel
    e('div', {
      style: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: 480,
        background: 'linear-gradient(180deg,' + p.color.bg2 + ' 0%,' + p.color.bg1 + ' 100%)',
        borderLeft: '1px solid ' + accent + '30',
        boxShadow: '-20px 0 48px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'ecept_fadeSlideUp 320ms ' + p.ease.out
      }
    },
      // Header
      e('div', {
        style: {
          padding: p.space.lg + ' ' + p.space.xl,
          borderBottom: '1px solid ' + p.color.bg4,
          display: 'flex',
          alignItems: 'center',
          gap: p.space.md
        }
      },
        e('div', {
          style: {
            width: 4,
            height: 28,
            background: accent,
            borderRadius: p.radius.pill
          }
        }),
        e('h2', { style: { flex: 1, fontSize: p.font.h3.size, fontWeight: 700, color: p.color.text, margin: 0, letterSpacing: '-0.015em' } }, props.title),
        e('button', {
          onClick: props.onClose,
          'aria-label': 'Cerrar',
          style: {
            background: 'none',
            border: 'none',
            color: p.color.textMuted,
            fontSize: 24,
            cursor: 'pointer',
            width: 36,
            height: 36,
            borderRadius: p.radius.md
          }
        }, '×')
      ),
      // Content
      e('div', {
        style: {
          flex: 1,
          overflowY: 'auto',
          padding: p.space.xl
        }
      }, props.children)
    )
  );
}
window.InfoLayer = InfoLayer;
