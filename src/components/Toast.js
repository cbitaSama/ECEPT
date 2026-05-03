// ══════════════════════════════════════════════════════════════
// Toast — sistema de notificaciones premium ECEPT
// ══════════════════════════════════════════════════════════════
// API:
//   showToast({ message, variant, duration })
//   variant: 'success' | 'error' | 'info' | 'warning' | 'premium'
//
// Uso:
//   window.ECEPT_toast('Guardado ✓', 'success')
//   window.ECEPT_toast('Error de red', 'error')
//
// El componente <ToastHost /> debe montarse una sola vez en App.
// ══════════════════════════════════════════════════════════════

var ECEPT_TOASTS = [];
var ECEPT_TOAST_LISTENERS = [];
var ECEPT_TOAST_NEXT_ID = 1;

function ECEPT_toast_emit() {
  for (var i = 0; i < ECEPT_TOAST_LISTENERS.length; i++) {
    try { ECEPT_TOAST_LISTENERS[i](); } catch (e2) {}
  }
}

// API flexible: acepta variant como string o como objeto {variant, duration}.
//   ECEPT_toast('Guardado', 'success')
//   ECEPT_toast('Error de red', { variant: 'error' })
//   ECEPT_toast('Generado', { variant: 'premium', duration: 6000 })
window.ECEPT_toast = function(message, variant, duration) {
  var v, d;
  if (variant && typeof variant === 'object') {
    v = variant.variant || 'info';
    d = variant.duration || (v === 'error' ? 8000 : 4000);
  } else {
    v = variant || 'info';
    d = duration || (v === 'error' ? 8000 : 4000);
  }
  var id = ECEPT_TOAST_NEXT_ID++;
  ECEPT_TOASTS.push({ id: id, message: message, variant: v, t: Date.now() });
  ECEPT_toast_emit();
  setTimeout(function() {
    ECEPT_TOASTS = ECEPT_TOASTS.filter(function(t){ return t.id !== id; });
    ECEPT_toast_emit();
  }, d);
  return id;
};

function ToastHost() {
  var p = T;
  var s = useState(0);
  var setTick = s[1];
  useEffect(function() {
    function onChange() { setTick(function(x){ return x + 1; }); }
    ECEPT_TOAST_LISTENERS.push(onChange);
    return function() {
      ECEPT_TOAST_LISTENERS = ECEPT_TOAST_LISTENERS.filter(function(f){ return f !== onChange; });
    };
  }, []);

  var variants = {
    success: { color: p.color.success, icon: '✓', bg: 'rgba(52,211,153,0.10)' },
    error:   { color: p.color.danger,  icon: '✕', bg: 'rgba(239,68,68,0.10)' },
    info:    { color: p.color.primaryHi, icon: 'ℹ', bg: 'rgba(96,165,250,0.10)' },
    warning: { color: p.color.warning, icon: '!', bg: 'rgba(251,191,36,0.10)' },
    premium: { color: p.color.gold,    icon: '★', bg: 'rgba(251,191,36,0.10)' }
  };

  return e('div', {
    style: {
      position: 'fixed',
      bottom: 24,
      right: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      zIndex: p.z.toast,
      pointerEvents: 'none',
      maxWidth: 'calc(100vw - 48px)'
    }
  },
    ECEPT_TOASTS.map(function(t) {
      var v = variants[t.variant] || variants.info;
      var isPremium = t.variant === 'premium';
      return e('div', {
        key: t.id,
        style: {
          background: 'rgba(17,23,58,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid ' + p.color.bg4,
          borderLeft: '3px solid ' + v.color,
          borderRadius: p.radius.lg,
          padding: '14px 18px',
          maxWidth: 360,
          minWidth: 240,
          boxShadow: isPremium ? p.shadow.glow_premium : p.shadow.lg,
          color: p.color.text,
          fontSize: p.font.bodySm.size,
          lineHeight: 1.5,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          pointerEvents: 'auto',
          animation: 'ecept_fadeSlideUp 320ms ' + p.ease.out
        }
      },
        e('span', {
          style: {
            color: v.color,
            fontWeight: 700,
            fontSize: 14,
            width: 20,
            height: 20,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1
          }
        }, v.icon),
        e('span', { style: { flex: 1, wordBreak: 'break-word' } }, t.message)
      );
    })
  );
}

window.ToastHost = ToastHost;
