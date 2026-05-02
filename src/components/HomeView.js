// ══════════════════════════════════════════════════════════════
// HomeView — landing del usuario, layout responsive premium
// ══════════════════════════════════════════════════════════════
// Mantiene TODA la información del home original (stats, progreso
// reuma, favoritos, módulos), pero con jerarquía visual real,
// padding generoso, grid multi-columna y aprovechamiento del viewport
// en desktop/iPad horizontal.
//
// Props:
//   user        — supabase user (puede ser null)
//   vi          — array de IDs revisados
//   favs        — array de IDs favoritos
//   bestStreak  — número
//   go          — fn navegación (modId)
//   onFav       — fn click favorito (id)
// ══════════════════════════════════════════════════════════════

function ECEPT_useViewport() {
  var s = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  var w = s[0];
  var setW = s[1];
  useEffect(function() {
    function on() { setW(window.innerWidth); }
    window.addEventListener('resize', on);
    return function() { window.removeEventListener('resize', on); };
  }, []);
  return w;
}
window.ECEPT_useViewport = ECEPT_useViewport;

function HomeView(props) {
  var p = T;
  var w = ECEPT_useViewport();
  var isDesktop = w >= p.bp.desktop;
  var isWide = w >= p.bp.wide;
  var isTablet = w >= p.bp.tablet;

  var go = props.go;
  var vi = props.vi || [];
  var favs = props.favs || [];
  var bestStreak = props.bestStreak || 0;
  var totalReuma = (typeof RD !== 'undefined' && RD.length) || 0;
  var pct = totalReuma > 0 ? Math.round(vi.length / totalReuma * 100) : 0;

  var specialIds = ['triadas','labs','imagenes','general','flashcards'];
  var specials = (typeof MODS !== 'undefined' ? MODS : []).filter(function(m){ return specialIds.indexOf(m.id) > -1; });
  var subjects = (typeof MODS !== 'undefined' ? MODS : []).filter(function(m){ return specialIds.indexOf(m.id) === -1; });

  // ─── HERO ─────────────────────────────────────────────────
  var hero = e('div', {
    style: {
      textAlign: 'center',
      padding: isDesktop ? '64px 16px 48px' : '40px 8px 32px',
      marginBottom: 0,
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(96,165,250,0.10) 0%, rgba(167,139,250,0.04) 35%, transparent 70%)',
      animation: 'ecept_fadeSlideUp 480ms ' + p.ease.out
    }
  },
    e('div', { style: { display: 'flex', justifyContent: 'center', marginBottom: p.space.lg } },
      e(Logo, { size: isDesktop ? 88 : 64, glow: true, float: true })
    ),
    e('h1', {
      style: {
        fontSize: isDesktop ? '56px' : (isTablet ? '44px' : '36px'),
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
    e('p', {
      style: {
        fontSize: isDesktop ? p.font.h3.size : p.font.body.size,
        color: p.color.textMuted,
        fontWeight: 500,
        marginBottom: p.space.xl,
        letterSpacing: '0.01em'
      }
    }, 'El Conocimiento Es Para Todos'),
    // Stats inline
    e('div', { style: { display: 'flex', justifyContent: 'center', gap: p.space.md, flexWrap: 'wrap', maxWidth: 720, margin: '0 auto' } },
      [
        { v: vi.length + '/' + totalReuma, l: 'Revisadas', c: p.color.primaryHi, bg: 'rgba(96,165,250,0.08)', bd: 'rgba(96,165,250,0.18)' },
        { v: favs.length, l: 'Favoritos', c: p.color.gold, bg: 'rgba(251,191,36,0.08)', bd: 'rgba(251,191,36,0.18)' },
        { v: bestStreak, l: 'Mejor racha', c: p.color.success, bg: 'rgba(52,211,153,0.08)', bd: 'rgba(52,211,153,0.18)' }
      ].map(function(st, i){
        return e('div', {
          key: i,
          style: {
            textAlign: 'center',
            padding: '12px 22px',
            background: st.bg,
            borderRadius: p.radius.lg,
            border: '1px solid ' + st.bd,
            minWidth: 110
          }
        },
          e('div', { style: { fontSize: '24px', fontWeight: 800, color: st.c, fontFamily: 'Inter, monospace', letterSpacing: '-0.02em' } }, String(st.v)),
          e('div', { style: { fontSize: p.font.micro.size, color: p.color.textDim, marginTop: 2, letterSpacing: '0.05em', textTransform: 'uppercase' } }, st.l)
        );
      })
    ),
    // Progress reuma
    totalReuma > 0 && e('div', { style: { maxWidth: 360, margin: p.space.lg + ' auto 0' } },
      e('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 } },
        e('span', { style: { fontSize: p.font.micro.size, color: p.color.textDim, letterSpacing: '0.04em', textTransform: 'uppercase' } }, 'Progreso Reumatología'),
        e('span', { style: { fontSize: p.font.micro.size, color: p.color.primaryHi, fontWeight: 700 } }, pct + '%')
      ),
      e('div', { style: { height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: p.radius.pill, overflow: 'hidden' } },
        e('div', {
          style: {
            width: pct + '%',
            height: '100%',
            background: p.color.gradMixed,
            borderRadius: p.radius.pill,
            transition: 'width 600ms ' + p.ease.out,
            boxShadow: '0 0 8px rgba(96,165,250,0.4)'
          }
        })
      )
    )
  );

  // ─── FAVORITES STRIP ────────────────────────────────────────
  var favStrip = favs.length > 0 && e('div', {
    style: {
      marginBottom: p.space.xxl,
      padding: p.space.lg + ' ' + p.space.xl,
      background: 'linear-gradient(135deg, ' + p.color.bg2 + ', rgba(251,191,36,0.04))',
      border: '1px solid rgba(251,191,36,0.18)',
      borderRadius: p.radius.xl,
      animation: 'ecept_fadeSlideUp 520ms ' + p.ease.out + ' 80ms both'
    }
  },
    e('div', { style: { display: 'flex', alignItems: 'center', gap: p.space.sm, marginBottom: p.space.md } },
      e('span', { style: { fontSize: 18 } }, '⭐'),
      e('h3', { style: { fontSize: p.font.bodySm.size, fontWeight: 700, color: p.color.gold, letterSpacing: '0.04em', textTransform: 'uppercase' } }, 'Tus Favoritos')
    ),
    e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: p.space.sm } },
      favs.map(function(fid){
        var enf = (typeof RD !== 'undefined' ? RD : []).find(function(d){ return d.id === fid; });
        if (!enf) return null;
        return e('button', {
          key: fid,
          onClick: function(){ go('reuma_dis', enf.s, enf.id); },
          style: {
            padding: '8px 14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid ' + p.color.bg4,
            borderRadius: p.radius.md,
            cursor: 'pointer',
            fontSize: p.font.bodySm.size,
            fontWeight: 600,
            color: p.color.text,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 200ms ' + p.ease.standard
          },
          onMouseEnter: function(ev){
            ev.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)';
            ev.currentTarget.style.transform = 'translateY(-1px)';
          },
          onMouseLeave: function(ev){
            ev.currentTarget.style.borderColor = p.color.bg4;
            ev.currentTarget.style.transform = 'translateY(0)';
          }
        },
          e('span', { style: { fontSize: 14 } }, '⭐'),
          enf.n
        );
      })
    )
  );

  // ─── MODULE CARD (compartido) ───────────────────────────────
  function moduleCard(m, i, opts) {
    opts = opts || {};
    var lleno = m.st === 'lleno';
    var col = m.col || p.color.primaryHi;
    var target = m.id;
    if (m.id === 'cirugia') target = 'cir_menu';
    else if (m.id === 'anatomia') target = 'anat_menu';
    else if (m.id === 'emergen') target = 'emergen_menu';

    return e('div', {
      key: m.id,
      onClick: function(){ if (lleno) go(target); },
      style: {
        background: p.color.gradSurface,
        border: '1px solid ' + (lleno ? col + '33' : p.color.bg4),
        borderRadius: p.radius.lg,
        padding: '20px 22px',
        minHeight: 150,
        cursor: lleno ? 'pointer' : 'default',
        opacity: lleno ? 1 : 0.45,
        transition: 'transform 240ms ' + p.ease.standard + ', border-color 240ms ' + p.ease.standard + ', box-shadow 240ms ease-out',
        animation: 'ecept_fadeSlideUp 480ms ' + p.ease.out + ' ' + (i * 40 + 120) + 'ms both',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      },
      onMouseEnter: function(ev){
        if (!lleno) return;
        ev.currentTarget.style.borderColor = col + '66';
        ev.currentTarget.style.transform = 'translateY(-2px)';
        ev.currentTarget.style.boxShadow = p.shadow.lg;
      },
      onMouseLeave: function(ev){
        if (!lleno) return;
        ev.currentTarget.style.borderColor = col + '30';
        ev.currentTarget.style.transform = 'translateY(0)';
        ev.currentTarget.style.boxShadow = 'none';
      }
    },
      // top row: icon + state badge
      e('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: p.space.md } },
        e('span', {
          style: {
            fontSize: 26,
            width: 52,
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: p.radius.lg,
            background: col + '14',
            border: '1px solid ' + col + '20'
          }
        }, m.ic),
        lleno
          ? e('span', { style: { fontSize: p.font.micro.size, padding: '3px 10px', borderRadius: p.radius.pill, background: col + '18', color: col, fontWeight: 700, letterSpacing: '0.04em' } }, 'ACTIVO')
          : e('span', { style: { fontSize: p.font.micro.size, padding: '3px 10px', borderRadius: p.radius.pill, background: 'rgba(255,255,255,0.05)', color: p.color.textDim, fontWeight: 600, letterSpacing: '0.04em' } }, 'PRONTO')
      ),
      e('h3', { style: { fontSize: p.font.h3.size, fontWeight: 600, color: p.color.text, marginBottom: 4, letterSpacing: '-0.01em' } }, m.n),
      e('p', { style: { fontSize: p.font.bodySm.size, color: p.color.textMuted, lineHeight: 1.55 } }, m.d)
    );
  }

  // ─── SECCIÓN HEADER ─────────────────────────────────────────
  function sectionHeader(label, accent) {
    return e('h2', {
      style: {
        fontSize: p.font.caption.size,
        fontWeight: 700,
        color: p.color.textMuted,
        margin: (isDesktop ? '48px' : '32px') + ' 0 20px',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        display: 'flex',
        alignItems: 'center',
        gap: p.space.md
      }
    },
      e('span', { style: { width: 4, height: 16, borderRadius: p.radius.pill, background: accent } }),
      label
    );
  }

  // ─── GRID auto-fit (responsive real, sin breakpoints rígidos) ──
  // mobile:    1 col (minmax 280px > viewport)
  // tablet:    2-3 cols
  // desktop:   3-4 cols
  // wide:      4-5 cols
  var moduleGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: p.space.lg,
    width: '100%'
  };

  // Container: padding fluido. Hasta 1400px usa padding 24px (32 desktop).
  // Más allá de 1400px usa padding lateral creciente para centrar pero
  // mantiene el ancho útil hasta 1400px.
  var containerStyle = {
    width: '100%',
    minHeight: '100vh',
    padding: '0 max(' + (isDesktop ? 32 : 16) + 'px, calc((100vw - 1400px) / 2))',
    paddingTop: 0,
    paddingBottom: p.space.huge,
    animation: 'ecept_fadeIn 420ms ' + p.ease.out,
    boxSizing: 'border-box'
  };

  return e('div', { style: containerStyle },
    hero,
    favStrip,
    e('div', { style: { marginBottom: p.space.xxxl } },
      sectionHeader('⚡ Secciones Especiales', p.color.purple),
      e('div', { style: moduleGridStyle },
        specials.map(function(m, i){ return moduleCard(m, i, { compact: false }); })
      )
    ),
    e('div', null,
      sectionHeader('📋 Materias', p.color.primaryHi),
      e('div', { style: moduleGridStyle },
        subjects.map(function(m, i){ return moduleCard(m, i + specials.length); })
      )
    )
  );
}

window.HomeView = HomeView;
