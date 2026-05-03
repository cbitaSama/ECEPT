// ══════════════════════════════════════════════════════════════
// LoadingScreen — pantalla de transición cuando se monta la app
// ══════════════════════════════════════════════════════════════
// Notas:
//   - El "initial-loader" en index.html se oculta apenas dispara
//     window.dispatchEvent('ECEPT_READY'). Este componente es para
//     transiciones internas largas (carga de Supabase user, fetch inicial).
//   - Si props.done = true → fade out 200ms.
//   - Timeout 5s sin done → muestra estado "connecting" con retry.
//
// Props:
//   done      — boolean. Cuando true, completa progress y desmonta.
//   message   — string opcional. Texto bajo el título.
//   onRetry   — fn opcional. Click en botón Recargar.
// ══════════════════════════════════════════════════════════════

function LoadingScreen(props) {
  var p = T;
  var s0 = useState(0);
  var progress = s0[0];
  var setProgress = s0[1];
  var s1 = useState('loading');
  var phase = s1[0];
  var setPhase = s1[1];
  var s2 = useState(false);
  var fadingOut = s2[0];
  var setFadingOut = s2[1];

  useEffect(function() {
    var p1 = 0;
    var iv = setInterval(function() {
      p1 += Math.random() * 8 + 4;
      if (p1 > 92) p1 = 92;
      setProgress(p1);
    }, 140);
    var to = setTimeout(function() {
      setPhase('slow');
    }, 5000);
    return function() {
      clearInterval(iv);
      clearTimeout(to);
    };
  }, []);

  useEffect(function() {
    if (props.done) {
      setProgress(100);
      var to = setTimeout(function() { setFadingOut(true); }, 200);
      return function() { clearTimeout(to); };
    }
  }, [props.done]);

  return e('div', {
    style: {
      position: 'fixed',
      inset: 0,
      background: p.color.bg0,
      zIndex: p.z.max,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: fadingOut ? 0 : 1,
      transition: 'opacity 280ms ' + p.ease.out,
      pointerEvents: fadingOut ? 'none' : 'auto'
    }
  },
    e('div', {
      style: {
        textAlign: 'center',
        maxWidth: 360,
        padding: p.space.xl
      }
    },
      // Logo
      e('div', { style: { marginBottom: p.space.xl, display: 'flex', justifyContent: 'center' } },
        e(Logo, { size: 96, glow: true, float: true })
      ),
      // ECEPT title gradient
      e('div', {
        style: {
          fontSize: '40px',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          background: p.color.gradMixed,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: p.space.sm,
          lineHeight: 1.05
        }
      }, 'ECEPT'),
      // Tagline
      e('div', {
        style: {
          fontSize: p.font.bodySm.size,
          color: p.color.textDim,
          marginBottom: p.space.xxl,
          letterSpacing: '0.01em'
        }
      }, 'El Conocimiento Es Para Todos'),
      // Progress bar
      e('div', {
        style: {
          width: '100%',
          height: 3,
          background: p.color.bg2,
          borderRadius: p.radius.pill,
          overflow: 'hidden',
          marginBottom: p.space.lg
        }
      },
        e('div', {
          style: {
            height: '100%',
            width: progress + '%',
            background: p.color.gradMixed,
            borderRadius: p.radius.pill,
            transition: 'width 320ms ' + p.ease.out,
            boxShadow: '0 0 12px rgba(96,165,250,0.4)'
          }
        })
      ),
      // Status text
      e('div', {
        style: {
          fontSize: p.font.caption.size,
          color: phase === 'slow' ? p.color.warning : p.color.textGhost,
          minHeight: 20
        }
      }, phase === 'slow' ? 'Está tardando más de lo normal...' : (props.message || 'Cargando tu sesión...')),
      // Retry button (slow state)
      phase === 'slow' && e('button', {
        onClick: function() {
          if (props.onRetry) props.onRetry();
          else window.location.reload();
        },
        style: {
          marginTop: p.space.lg,
          padding: '10px 24px',
          background: p.color.gradMixed,
          color: '#fff',
          border: 'none',
          borderRadius: p.radius.lg,
          fontWeight: 600,
          fontSize: p.font.bodySm.size,
          cursor: 'pointer',
          boxShadow: p.shadow.md,
          animation: 'ecept_fadeSlideUp 280ms ' + p.ease.out
        }
      }, 'Reintentar')
    )
  );
}

window.LoadingScreen = LoadingScreen;
