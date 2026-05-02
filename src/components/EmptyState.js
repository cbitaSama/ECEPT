// ══════════════════════════════════════════════════════════════
// EmptyState — placeholder unificado para listas/secciones vacías
// ══════════════════════════════════════════════════════════════
// Props:
//   icon        — emoji string o ReactElement (default 📭)
//   title       — string h3
//   description — string body muted
//   actions     — array [{label, onClick, variant: 'primary'|'secondary'}]
// ══════════════════════════════════════════════════════════════

function EmptyState(props) {
  var p = T;
  var actions = props.actions || [];

  return e('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
      minHeight: 360,
      gap: 16,
      animation: 'ecept_fadeSlideUp 420ms ' + p.ease.out
    }
  },
    // Icon container con glow ambient
    e('div', {
      style: {
        width: 88,
        height: 88,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(96,165,250,0.12), rgba(167,139,250,0.08))',
        border: '1px solid rgba(96,165,250,0.20)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 40,
        boxShadow: '0 0 40px rgba(96,165,250,0.15)',
        marginBottom: 8
      }
    }, props.icon || '📭'),
    // Title
    e('div', {
      style: {
        fontSize: 20,
        fontWeight: 700,
        color: p.color.text,
        letterSpacing: '-0.01em'
      }
    }, props.title),
    // Description
    props.description && e('div', {
      style: {
        fontSize: p.font.bodySm.size,
        color: p.color.textMuted,
        maxWidth: 380,
        lineHeight: 1.55
      }
    }, props.description),
    // Actions
    actions.length > 0 && e('div', {
      style: {
        display: 'flex',
        gap: 12,
        marginTop: 12,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }
    }, actions.map(function(a, i) {
      var isPrimary = a.variant !== 'secondary';
      var isPremium = a.variant === 'premium';
      return e('button', {
        key: i,
        onClick: a.onClick,
        style: {
          padding: '12px 24px',
          background: isPremium
            ? p.color.gradPremium
            : (isPrimary ? p.color.gradMixed : 'rgba(96,165,250,0.10)'),
          color: isPremium ? '#0a0e1f' : '#fff',
          border: isPrimary || isPremium ? 'none' : '1px solid rgba(96,165,250,0.30)',
          borderRadius: p.radius.lg,
          fontSize: p.font.body.size,
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: 44,
          letterSpacing: '-0.01em',
          boxShadow: isPremium ? p.shadow.glow_premium : (isPrimary ? '0 4px 12px rgba(167,139,250,0.25)' : 'none'),
          transition: 'transform 200ms ' + p.ease.standard + ', box-shadow 200ms ease-out'
        },
        onMouseEnter: function(ev) {
          if (isPrimary || isPremium) ev.currentTarget.style.transform = 'translateY(-1px)';
        },
        onMouseLeave: function(ev) {
          ev.currentTarget.style.transform = 'translateY(0)';
        }
      }, a.label);
    }))
  );
}

window.EmptyState = EmptyState;
