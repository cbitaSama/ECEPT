// ══════════════════════════════════════════════════════════════
// ElionIntro — presentación oficial cuando el user abre el chat
// por primera vez (sin conversaciones previas, sin mensajes).
// ══════════════════════════════════════════════════════════════
// Props:
//   onPromptSelect(text) — callback que recibe el prompt clickeado.
//                          El parent inserta el texto en el textarea
//                          y opcionalmente focus.
// ══════════════════════════════════════════════════════════════

function ElionIntro(props) {
  var p = T;

  var capabilities = [
    { ic: '🩺', t: 'Casos clínicos y diagnóstico' },
    { ic: '💊', t: 'Mecanismos de fármacos' },
    { ic: '📚', t: 'Resúmenes y esquemas' },
    { ic: '🔬', t: 'Fisiopatología paso a paso' },
    { ic: '🎴', t: 'Generar flashcards de tus PDFs' }
  ];

  var prompts = [
    '💊 Explicame los betabloqueantes',
    '🩺 DDx de dolor torácico',
    '✨ Dame ideas de cómo estudiar mejor'
  ];

  return e('div', {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '32px 20px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 0,
      animation: 'ecept_fadeIn 320ms cubic-bezier(0.16,1,0.3,1)'
    }
  },
    // Logo grande con flow + glow
    e('div', { style: { marginBottom: 18, animation: 'ecept_fadeSlideUp 480ms cubic-bezier(0.16,1,0.3,1) 80ms both' } },
      e(window.Logo || 'div', { size: 80, animated: true, glow: true, idSuffix: 'elionintro' })
    ),
    // Título principal
    e('div', {
      style: {
        fontSize: '28px',
        fontWeight: 800,
        letterSpacing: '-0.025em',
        background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: 6,
        textAlign: 'center',
        lineHeight: 1.15,
        animation: 'ecept_fadeSlideUp 480ms cubic-bezier(0.16,1,0.3,1) 160ms both'
      }
    }, 'Hola, soy Elion ✨'),
    // Subtitle
    e('div', {
      style: {
        fontSize: 15,
        color: '#94a3b8',
        marginBottom: 22,
        textAlign: 'center',
        letterSpacing: '-0.005em',
        animation: 'ecept_fadeSlideUp 480ms cubic-bezier(0.16,1,0.3,1) 220ms both'
      }
    }, 'Tu segundo cerebro médico'),
    // Description
    e('div', {
      style: {
        fontSize: 14,
        color: '#cbd5e1',
        marginBottom: 22,
        maxWidth: 360,
        textAlign: 'center',
        lineHeight: 1.6,
        animation: 'ecept_fadeSlideUp 480ms cubic-bezier(0.16,1,0.3,1) 280ms both'
      }
    }, 'Estoy entrenado en medicina y diseñado para ayudarte a estudiar más inteligente.'),
    // Capabilities label
    e('div', {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: '#475569',
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        marginBottom: 10,
        alignSelf: 'flex-start',
        width: '100%',
        maxWidth: 360,
        animation: 'ecept_fadeSlideUp 480ms cubic-bezier(0.16,1,0.3,1) 320ms both'
      }
    }, 'Puedo ayudarte con'),
    // Capabilities list
    e('div', { style: { width: '100%', maxWidth: 360, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 6 } },
      capabilities.map(function(cap, i) {
        return e('div', {
          key: i,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: 'linear-gradient(180deg, rgba(13,18,36,0.60), rgba(10,14,31,0.40))',
            border: '1px solid rgba(26,32,64,0.60)',
            borderRadius: 12,
            fontSize: 13,
            color: '#cbd5e1',
            lineHeight: 1.4,
            animation: 'ecept_fadeSlideUp 320ms cubic-bezier(0.16,1,0.3,1) ' + (380 + i * 70) + 'ms both'
          }
        },
          e('span', { style: { fontSize: 18, flexShrink: 0 } }, cap.ic),
          e('span', { style: { letterSpacing: '-0.005em' } }, cap.t)
        );
      })
    ),
    // CTA label
    e('div', {
      style: {
        fontSize: 13,
        color: '#94a3b8',
        marginBottom: 10,
        animation: 'ecept_fadeSlideUp 480ms cubic-bezier(0.16,1,0.3,1) 760ms both'
      }
    }, '¿Por dónde empezamos?'),
    // Quick prompts
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 360 } },
      prompts.map(function(qp, i) {
        return e('button', {
          key: i,
          onClick: function() {
            if (typeof props.onPromptSelect === 'function') props.onPromptSelect(qp);
          },
          style: {
            padding: '14px 18px',
            background: 'linear-gradient(135deg, rgba(96,165,250,0.10), rgba(167,139,250,0.06))',
            border: '1px solid rgba(96,165,250,0.22)',
            borderRadius: 14,
            color: '#e2e8f0',
            fontSize: 13,
            textAlign: 'left',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '-0.005em',
            transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1), border-color 200ms ease-out, box-shadow 200ms ease-out',
            animation: 'ecept_fadeSlideUp 320ms cubic-bezier(0.16,1,0.3,1) ' + (820 + i * 80) + 'ms both',
            boxShadow: '0 1px 2px rgba(0,0,0,0.20)'
          },
          onMouseOver: function(ev) {
            ev.currentTarget.style.transform = 'translateY(-1px)';
            ev.currentTarget.style.borderColor = 'rgba(96,165,250,0.42)';
            ev.currentTarget.style.boxShadow = '0 4px 14px rgba(96,165,250,0.15)';
          },
          onMouseOut: function(ev) {
            ev.currentTarget.style.transform = 'translateY(0)';
            ev.currentTarget.style.borderColor = 'rgba(96,165,250,0.22)';
            ev.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.20)';
          }
        }, qp);
      })
    )
  );
}

window.ElionIntro = ElionIntro;
