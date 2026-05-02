// ══════════════════════════════════════════════════════════════
// Logo — hélice doble custom (SVG) con animación "flow infinito"
// ══════════════════════════════════════════════════════════════
// El efecto "flow" simula movimiento perpetuo de las strands hacia
// arriba/abajo (ilusión ∞). NO rotación 360°. Animado vía
// stroke-dashoffset + breathe scale. Container con id único para
// evitar colisiones de gradients cuando hay múltiples Logos.
//
// Props:
//   size      — número (default 48)
//   animated  — boolean. Activa flow + breathe.
//   glow      — boolean. drop-shadow violeta sutil.
//   float     — boolean. Float vertical adicional (legacy).
//   idSuffix  — string opcional. Estabiliza el id (testeable).
// ══════════════════════════════════════════════════════════════

var ECEPT_LOGO_UID = 0;

function Logo(props) {
  var size = props.size || 48;
  var animated = props.animated;
  var glow = props.glow;
  var float = props.float;

  // ID único por instancia para evitar colisiones de gradients.
  var idSuf = props.idSuffix || ('lg_' + (++ECEPT_LOGO_UID));
  var idA = 'ecept_lg_a_' + idSuf;
  var idB = 'ecept_lg_b_' + idSuf;

  var className = '';
  if (animated) className += 'ecept-logo-flow';
  if (float) className += ' ecept-logo-float';

  var containerStyle = {
    width: size,
    height: size,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    filter: glow ? 'drop-shadow(0 0 ' + Math.max(8, Math.round(size / 5)) + 'px rgba(167,139,250,0.5))' : 'none',
    overflow: 'visible'
  };

  return e('div', { style: containerStyle, className: className.trim() },
    e('svg', {
      width: '100%',
      height: '100%',
      viewBox: '0 0 100 100',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      style: { display: 'block', overflow: 'visible' }
    },
      e('defs', null,
        // Gradient verticales con stop intermedio → efecto "ola"
        e('linearGradient', { id: idA, x1: '0', y1: '0', x2: '0', y2: '100', gradientUnits: 'userSpaceOnUse' },
          e('stop', { offset: '0%',   stopColor: '#60a5fa' }),
          e('stop', { offset: '50%',  stopColor: '#a78bfa' }),
          e('stop', { offset: '100%', stopColor: '#60a5fa' })
        ),
        e('linearGradient', { id: idB, x1: '0', y1: '0', x2: '0', y2: '100', gradientUnits: 'userSpaceOnUse' },
          e('stop', { offset: '0%',   stopColor: '#a78bfa' }),
          e('stop', { offset: '50%',  stopColor: '#60a5fa' }),
          e('stop', { offset: '100%', stopColor: '#a78bfa' })
        )
      ),
      // Strand 1 — flujo hacia abajo
      e('path', {
        d: 'M 22 12 C 22 30, 78 30, 78 48 C 78 66, 22 66, 22 84',
        stroke: 'url(#' + idA + ')',
        strokeWidth: 4,
        strokeLinecap: 'round',
        fill: 'none',
        className: animated ? 'ecept-strand-flow' : '',
        strokeDasharray: animated ? '6 4' : 'none'
      }),
      // Strand 2 — flujo opuesto (espejo)
      e('path', {
        d: 'M 78 12 C 78 30, 22 30, 22 48 C 22 66, 78 66, 78 84',
        stroke: 'url(#' + idB + ')',
        strokeWidth: 4,
        strokeLinecap: 'round',
        fill: 'none',
        opacity: 0.55,
        className: animated ? 'ecept-strand-flow-reverse' : '',
        strokeDasharray: animated ? '6 4' : 'none'
      }),
      // Rungs
      e('line', { x1: 28, y1: 22, x2: 72, y2: 22, stroke: 'url(#' + idA + ')', strokeWidth: 2.5, strokeLinecap: 'round', opacity: 0.65 }),
      e('line', { x1: 32, y1: 36, x2: 68, y2: 36, stroke: 'url(#' + idA + ')', strokeWidth: 2.5, strokeLinecap: 'round', opacity: 0.5 }),
      e('line', { x1: 32, y1: 60, x2: 68, y2: 60, stroke: 'url(#' + idA + ')', strokeWidth: 2.5, strokeLinecap: 'round', opacity: 0.5 }),
      e('line', { x1: 28, y1: 74, x2: 72, y2: 74, stroke: 'url(#' + idA + ')', strokeWidth: 2.5, strokeLinecap: 'round', opacity: 0.65 }),
      // Endpoints
      e('circle', { cx: 22, cy: 12, r: 3, fill: '#60a5fa' }),
      e('circle', { cx: 78, cy: 12, r: 3, fill: '#a78bfa' }),
      e('circle', { cx: 22, cy: 84, r: 3, fill: '#a78bfa' }),
      e('circle', { cx: 78, cy: 84, r: 3, fill: '#60a5fa' })
    )
  );
}

window.Logo = Logo;
