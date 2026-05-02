// ══════════════════════════════════════════════════════════════
// Logo — hélice doble custom (SVG)
// ══════════════════════════════════════════════════════════════
// Reemplazo del emoji 🧬. Geometría minimal: dos curvas sinusoidales
// entrelazadas con conectores horizontales (rungs). Gradiente azul→violeta.
//
// Props:
//   size      — número (default 48). Tamaño cuadrado en px.
//   animated  — boolean. Rotación continua lenta (10s).
//   glow      — boolean. drop-shadow violeta sutil.
//   float     — boolean. Animación de flotado vertical (subtle).
// ══════════════════════════════════════════════════════════════

function Logo(props) {
  var size = props.size || 48;
  var animated = props.animated;
  var glow = props.glow;
  var float = props.float;
  var gradId = 'logoGrad_' + (props.idSuffix || size);

  var anim = 'none';
  if (animated && float) anim = 'ecept_logoSpin 10s linear infinite, ecept_logoFloat 3.6s ease-in-out infinite';
  else if (animated) anim = 'ecept_logoSpin 10s linear infinite';
  else if (float) anim = 'ecept_logoFloat 3.6s ease-in-out infinite';

  return e('div', {
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: anim,
      filter: glow ? 'drop-shadow(0 0 ' + Math.round(size / 4) + 'px rgba(167,139,250,0.45))' : 'none',
      flexShrink: 0
    }
  },
    e('svg', {
      width: size,
      height: size,
      viewBox: '0 0 64 64',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    },
      e('defs', null,
        e('linearGradient', { id: gradId, x1: 0, y1: 0, x2: 64, y2: 64, gradientUnits: 'userSpaceOnUse' },
          e('stop', { offset: '0%', stopColor: '#60a5fa' }),
          e('stop', { offset: '100%', stopColor: '#a78bfa' })
        )
      ),
      // Strand 1 — curva superior, descendente
      e('path', {
        d: 'M18 6 C30 18 34 18 46 6 M18 22 C30 34 34 34 46 22 M18 42 C30 54 34 54 46 42 M18 58 C30 70 34 70 46 58',
        stroke: 'url(#' + gradId + ')',
        strokeWidth: 2.6,
        strokeLinecap: 'round',
        fill: 'none'
      }),
      // Strand 2 — espejo
      e('path', {
        d: 'M46 6 C34 18 30 18 18 6 M46 22 C34 34 30 34 18 22 M46 42 C34 54 30 54 18 42 M46 58 C34 70 30 70 18 58',
        stroke: 'url(#' + gradId + ')',
        strokeWidth: 2.6,
        strokeLinecap: 'round',
        fill: 'none',
        opacity: 0.55
      }),
      // Conectores (rungs) — donde las hebras se cruzan
      e('line', { x1: 22, y1: 14, x2: 42, y2: 14, stroke: 'url(#' + gradId + ')', strokeWidth: 1.8, strokeLinecap: 'round', opacity: 0.6 }),
      e('line', { x1: 22, y1: 30, x2: 42, y2: 30, stroke: 'url(#' + gradId + ')', strokeWidth: 1.8, strokeLinecap: 'round', opacity: 0.6 }),
      e('line', { x1: 22, y1: 50, x2: 42, y2: 50, stroke: 'url(#' + gradId + ')', strokeWidth: 1.8, strokeLinecap: 'round', opacity: 0.6 })
    )
  );
}

window.Logo = Logo;
