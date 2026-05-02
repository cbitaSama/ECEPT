// ══════════════════════════════════════════════════════════════
// Skeleton — placeholders pulsantes para loading states
// ══════════════════════════════════════════════════════════════
// Componentes:
//   - SkeletonBase: base con shimmer animation
//   - SkeletonText: línea(s) de texto
//   - SkeletonAvatar: círculo
//   - SkeletonCard: card placeholder
//   - SkeletonList: lista de N items (cards)
//
// Animación: ecept_skel_shimmer (en index.html). Background gradient
// que se mueve para simular carga.
// ══════════════════════════════════════════════════════════════

function SkeletonBase(props) {
  var p = T;
  var w = props.width || '100%';
  var h = props.height || 16;
  var r = props.radius || p.radius.sm;
  return e('div', {
    style: {
      width: w,
      height: h,
      borderRadius: r,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(96,165,250,0.10) 50%, rgba(255,255,255,0.03) 75%)',
      backgroundSize: '480px 100%',
      animation: 'ecept_skel_shimmer 1.6s ease-in-out infinite',
      flexShrink: 0
    }
  });
}

function SkeletonText(props) {
  var lines = props.lines || 1;
  var p = T;
  var arr = [];
  for (var i = 0; i < lines; i++) {
    var w = (lines === 1) ? (props.width || '100%') : (i === lines - 1 ? '60%' : '100%');
    arr.push(e(SkeletonBase, { key: i, width: w, height: props.height || 14 }));
  }
  return e('div', { style: { display: 'flex', flexDirection: 'column', gap: p.space.sm } }, arr);
}

function SkeletonAvatar(props) {
  var size = props.size || 40;
  return e(SkeletonBase, { width: size, height: size, radius: '50%' });
}

function SkeletonCard(props) {
  var p = T;
  var minH = props.minHeight || 140;
  return e('div', {
    style: {
      background: p.color.gradSurface,
      border: '1px solid ' + p.color.bg4,
      borderRadius: p.radius.lg,
      padding: p.space.lg + ' ' + p.space.xl,
      minHeight: minH,
      display: 'flex',
      flexDirection: 'column',
      gap: p.space.md,
      boxSizing: 'border-box'
    }
  },
    e('div', { style: { display: 'flex', alignItems: 'center', gap: p.space.md } },
      e(SkeletonAvatar, { size: 44 }),
      e('div', { style: { flex: 1 } },
        e(SkeletonBase, { height: 16, width: '70%' })
      )
    ),
    e('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: p.space.sm, marginTop: p.space.xs } },
      e(SkeletonBase, { height: 12, width: '100%' }),
      e(SkeletonBase, { height: 12, width: '85%' })
    )
  );
}

function SkeletonList(props) {
  var n = props.count || 4;
  var p = T;
  var minH = props.minHeight || 140;
  var grid = props.grid;
  var arr = [];
  for (var i = 0; i < n; i++) {
    arr.push(e('div', { key: i, style: { animationDelay: (i * 60) + 'ms' } }, e(SkeletonCard, { minHeight: minH })));
  }
  if (grid) {
    return e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(' + (props.minWidth || 280) + 'px, 1fr))', gap: p.space.lg, width: '100%' } }, arr);
  }
  return e('div', { style: { display: 'flex', flexDirection: 'column', gap: p.space.md } }, arr);
}

function SkeletonRow(props) {
  // Fila tipo conversación de chat sidebar: avatar + 2 líneas de texto
  var p = T;
  return e('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: p.space.md,
      padding: p.space.md + ' ' + p.space.sm,
      borderRadius: p.radius.md
    }
  },
    e(SkeletonAvatar, { size: 28 }),
    e('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 6 } },
      e(SkeletonBase, { height: 12, width: '80%' }),
      e(SkeletonBase, { height: 10, width: '40%' })
    )
  );
}

window.SkeletonBase = SkeletonBase;
window.SkeletonText = SkeletonText;
window.SkeletonAvatar = SkeletonAvatar;
window.SkeletonCard = SkeletonCard;
window.SkeletonList = SkeletonList;
window.SkeletonRow = SkeletonRow;
