// ══════════════════════════════════════════════════════════════
// Button — sistema unificado de botones premium ECEPT
// ══════════════════════════════════════════════════════════════
// Props:
//   variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'premium'
//   size:    'sm' (32px) | 'md' (40px) | 'lg' (48px)
//   icon:    string opcional (emoji o ReactElement)
//   iconRight: boolean (icon a la derecha)
//   loading: boolean
//   disabled: boolean
//   onClick: fn
//   children: label
// ══════════════════════════════════════════════════════════════

function Button(props) {
  var p = T;
  var variant = props.variant || 'primary';
  var size = props.size || 'md';
  var disabled = props.disabled || props.loading;

  var heights = { sm: 32, md: 40, lg: 48 };
  var paddings = { sm: '0 12px', md: '0 18px', lg: '0 24px' };
  var fontSizes = { sm: p.font.bodySm.size, md: p.font.body.size, lg: p.font.body.size };

  var styles = {
    primary: {
      background: 'linear-gradient(135deg,#60a5fa,#a78bfa)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 4px 12px rgba(167,139,250,0.25)'
    },
    secondary: {
      background: p.color.bg2,
      color: p.color.text,
      border: '1px solid ' + p.color.bg4,
      boxShadow: 'none'
    },
    ghost: {
      background: 'transparent',
      color: p.color.textMuted,
      border: '1px solid transparent',
      boxShadow: 'none'
    },
    danger: {
      background: 'rgba(239,68,68,0.12)',
      color: p.color.danger,
      border: '1px solid rgba(239,68,68,0.30)',
      boxShadow: 'none'
    },
    premium: {
      background: p.color.gradPremium,
      color: '#0a0e1f',
      border: 'none',
      boxShadow: p.shadow.glow_premium
    }
  };
  var st = styles[variant] || styles.primary;

  return e('button', {
    onClick: disabled ? undefined : props.onClick,
    disabled: disabled,
    'aria-label': props['aria-label'],
    style: Object.assign({
      height: heights[size],
      minWidth: heights[size],
      padding: paddings[size],
      borderRadius: p.radius.lg,
      fontSize: fontSizes[size],
      fontWeight: 600,
      letterSpacing: '-0.01em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      transition: 'transform 200ms ' + p.ease.standard + ', box-shadow 200ms ease-out, opacity 180ms ease',
      flexShrink: 0
    }, st),
    onMouseEnter: function(ev) {
      if (disabled) return;
      if (variant === 'primary' || variant === 'premium') {
        ev.currentTarget.style.transform = 'translateY(-1px)';
      } else if (variant === 'ghost') {
        ev.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      } else if (variant === 'secondary') {
        ev.currentTarget.style.borderColor = p.color.primaryHi;
      } else if (variant === 'danger') {
        ev.currentTarget.style.background = 'rgba(239,68,68,0.20)';
      }
    },
    onMouseLeave: function(ev) {
      if (disabled) return;
      ev.currentTarget.style.transform = 'translateY(0)';
      if (variant === 'ghost') ev.currentTarget.style.background = 'transparent';
      if (variant === 'secondary') ev.currentTarget.style.borderColor = p.color.bg4;
      if (variant === 'danger') ev.currentTarget.style.background = 'rgba(239,68,68,0.12)';
    }
  },
    props.loading
      ? e('span', { style: { animation: 'ecept_logoSpin 800ms linear infinite', display: 'inline-block' } }, '⟳')
      : (props.icon && !props.iconRight ? e('span', null, props.icon) : null),
    props.children && e('span', null, props.children),
    !props.loading && props.icon && props.iconRight ? e('span', null, props.icon) : null
  );
}

window.Button = Button;
