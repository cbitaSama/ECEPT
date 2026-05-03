// ══════════════════════════════════════════════════════════════
// Logo — hélice doble custom (SVG)
// ══════════════════════════════════════════════════════════════
// COMPACT MODE: a tamaños <40px las strands son sólidas (sin dasharray).
// El dasharray a tamaños chicos genera segmentos sub-pixel que se ven
// invisibles o pulsan entre visible/invisible. En compact, solo respira
// el container (ecept_logoBreathe) si animated=true.
//
// FULL MODE (>=40px): strands con dasharray + flow animation visible.
//
// Props:
//   size      — número (default 48)
//   animated  — boolean. Activa breathe + (en full mode) strand flow.
//   glow      — boolean. drop-shadow violeta.
//   float     — boolean. Float vertical adicional (legacy).
//   idSuffix  — string opcional. Estabiliza el id del gradient.
// ══════════════════════════════════════════════════════════════

var ECEPT_LOGO_UID = 0;

function Logo(props) {
  var size = props.size || 48;
  var animated = props.animated;
  var glow = props.glow;
  var float = props.float;
  var compact = size < 40;

  var idSuf = props.idSuffix || ('lg_' + (++ECEPT_LOGO_UID));
  var idA = 'ecept_lg_a_' + idSuf;
  var idB = 'ecept_lg_b_' + idSuf;

  // En compact: solo breathe (no flow strand). En full: breathe + flow.
  var classes = [];
  if (animated) classes.push('ecept-logo-flow');
  if (float) classes.push('ecept-logo-float');
  var className = classes.join(' ');

  // En compact: strands sólidas y gruesas.
  // En full: strands con dasharray + flow animado.
  var strokeW   = compact ? 5 : 4;
  var dashArr   = compact ? 'none' : '6 4';
  var dashClass = (animated && !compact) ? 'ecept-strand-flow' : '';
  var dashClassRev = (animated && !compact) ? 'ecept-strand-flow-reverse' : '';
  var rungSw    = compact ? 3 : 2.5;
  var dotR      = compact ? 4 : 3;

  var containerStyle = {
    width: size,
    height: size,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'visible',
    filter: glow ? 'drop-shadow(0 0 ' + Math.max(8, Math.round(size / 5)) + 'px rgba(167,139,250,0.5))' : 'none'
  };

  return e('div', { style: containerStyle, className: className },
    e('svg', {
      width: '100%',
      height: '100%',
      viewBox: '0 0 100 100',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      style: { display: 'block', overflow: 'visible' }
    },
      e('defs', null,
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
      // Strand 1
      e('path', {
        d: 'M 22 12 C 22 30, 78 30, 78 48 C 78 66, 22 66, 22 84',
        stroke: 'url(#' + idA + ')',
        strokeWidth: strokeW,
        strokeLinecap: 'round',
        fill: 'none',
        className: dashClass,
        strokeDasharray: dashArr
      }),
      // Strand 2 (mirror)
      e('path', {
        d: 'M 78 12 C 78 30, 22 30, 22 48 C 22 66, 78 66, 78 84',
        stroke: 'url(#' + idB + ')',
        strokeWidth: strokeW,
        strokeLinecap: 'round',
        fill: 'none',
        opacity: 0.55,
        className: dashClassRev,
        strokeDasharray: dashArr
      }),
      // Rungs
      e('line', { x1: 28, y1: 22, x2: 72, y2: 22, stroke: 'url(#' + idA + ')', strokeWidth: rungSw, strokeLinecap: 'round', opacity: 0.7  }),
      e('line', { x1: 32, y1: 36, x2: 68, y2: 36, stroke: 'url(#' + idA + ')', strokeWidth: rungSw, strokeLinecap: 'round', opacity: 0.55 }),
      e('line', { x1: 32, y1: 60, x2: 68, y2: 60, stroke: 'url(#' + idA + ')', strokeWidth: rungSw, strokeLinecap: 'round', opacity: 0.55 }),
      e('line', { x1: 28, y1: 74, x2: 72, y2: 74, stroke: 'url(#' + idA + ')', strokeWidth: rungSw, strokeLinecap: 'round', opacity: 0.7  }),
      // Endpoints
      e('circle', { cx: 22, cy: 12, r: dotR, fill: '#60a5fa' }),
      e('circle', { cx: 78, cy: 12, r: dotR, fill: '#a78bfa' }),
      e('circle', { cx: 22, cy: 84, r: dotR, fill: '#a78bfa' }),
      e('circle', { cx: 78, cy: 84, r: dotR, fill: '#60a5fa' })
    )
  );
}

window.Logo = Logo;
