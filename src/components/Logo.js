// ══════════════════════════════════════════════════════════════
// Logo — hélice doble custom (SVG)
// ══════════════════════════════════════════════════════════════
// Refinado: viewBox 100x100 con padding interno 12px (strands en y 12-84,
// x 22-78). Garantiza que NUNCA se corte. Endpoint circles agregan
// detalle premium. Strand sinusoidal con curvas Bézier suaves entrelazadas.
//
// Props:
//   size      — número (default 48). Tamaño cuadrado en px.
//   animated  — boolean. Rotación continua lenta (12s).
//   glow      — boolean. drop-shadow violeta sutil.
//   float     — boolean. Animación de flotado vertical.
//   idSuffix  — string. Sufijo único para el id del gradient (cuando hay
//               múltiples Logos en la misma página).
// ══════════════════════════════════════════════════════════════

function Logo(props) {
  var size = props.size || 48;
  var animated = props.animated;
  var glow = props.glow;
  var float = props.float;
  var idSuf = props.idSuffix || ('s' + size);
  var idA = 'ecept_logo_grad_a_' + idSuf;
  var idB = 'ecept_logo_grad_b_' + idSuf;

  var anim = 'none';
  if (animated && float) anim = 'ecept_logoSpin 12s linear infinite, ecept_logoFloat 3.6s ease-in-out infinite';
  else if (animated) anim = 'ecept_logoSpin 12s linear infinite';
  else if (float) anim = 'ecept_logoFloat 3.6s ease-in-out infinite';

  var containerStyle = {
    width: size,
    height: size,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    animation: anim,
    filter: glow ? 'drop-shadow(0 0 ' + Math.max(8, Math.round(size / 5)) + 'px rgba(167,139,250,0.5))' : 'none',
    overflow: 'visible'
  };

  return e('div', { style: containerStyle },
    e('svg', {
      width: '100%',
      height: '100%',
      viewBox: '0 0 100 100',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      style: { display: 'block', overflow: 'visible' }
    },
      e('defs', null,
        e('linearGradient', { id: idA, x1: '0', y1: '0', x2: '100', y2: '100', gradientUnits: 'userSpaceOnUse' },
          e('stop', { offset: '0%', stopColor: '#60a5fa' }),
          e('stop', { offset: '100%', stopColor: '#a78bfa' })
        ),
        e('linearGradient', { id: idB, x1: '100', y1: '0', x2: '0', y2: '100', gradientUnits: 'userSpaceOnUse' },
          e('stop', { offset: '0%', stopColor: '#a78bfa' }),
          e('stop', { offset: '100%', stopColor: '#60a5fa' })
        )
      ),
      // Strand 1 — curva sinusoidal de izquierda a derecha y vuelta
      e('path', {
        d: 'M 22 12 C 22 30, 78 30, 78 48 C 78 66, 22 66, 22 84',
        stroke: 'url(#' + idA + ')',
        strokeWidth: 4,
        strokeLinecap: 'round',
        fill: 'none'
      }),
      // Strand 2 — curva sinusoidal opuesta (espejo)
      e('path', {
        d: 'M 78 12 C 78 30, 22 30, 22 48 C 22 66, 78 66, 78 84',
        stroke: 'url(#' + idB + ')',
        strokeWidth: 4,
        strokeLinecap: 'round',
        fill: 'none',
        opacity: 0.5
      }),
      // Rungs (4 conectores horizontales que dan el efecto DNA)
      e('line', { x1: 28, y1: 22, x2: 72, y2: 22, stroke: 'url(#' + idA + ')', strokeWidth: 2.5, strokeLinecap: 'round', opacity: 0.7 }),
      e('line', { x1: 32, y1: 36, x2: 68, y2: 36, stroke: 'url(#' + idA + ')', strokeWidth: 2.5, strokeLinecap: 'round', opacity: 0.55 }),
      e('line', { x1: 32, y1: 60, x2: 68, y2: 60, stroke: 'url(#' + idA + ')', strokeWidth: 2.5, strokeLinecap: 'round', opacity: 0.55 }),
      e('line', { x1: 28, y1: 74, x2: 72, y2: 74, stroke: 'url(#' + idA + ')', strokeWidth: 2.5, strokeLinecap: 'round', opacity: 0.7 }),
      // Endpoint circles — detalle premium
      e('circle', { cx: 22, cy: 12, r: 3, fill: '#60a5fa' }),
      e('circle', { cx: 78, cy: 12, r: 3, fill: '#a78bfa' }),
      e('circle', { cx: 22, cy: 84, r: 3, fill: '#a78bfa' }),
      e('circle', { cx: 78, cy: 84, r: 3, fill: '#60a5fa' })
    )
  );
}

window.Logo = Logo;
