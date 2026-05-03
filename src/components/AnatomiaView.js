// ══════════════════════════════════════════════════════════════
// AnatomiaView — esqueleto de Anatomía: 4 secciones × 4 sistemas.
// ══════════════════════════════════════════════════════════════
// Props:
//   user — supabase user (puede ser null).
//   view — 'menu' | 'anat_<seccion>' | 'anat_<seccion>_<sistema>'
//   go   — fn navegación (recibe vista nueva).
// ══════════════════════════════════════════════════════════════

function AnatomiaView(props) {
  var p = T;
  var user = props.user;
  var view = props.view || 'menu';
  var go = props.go;

  // Parse view: anat_<seccion> o anat_<seccion>_<sistema>
  var parts = view === 'menu' ? [] : view.replace(/^anat_/, '').split('_');
  // Hack para 'cab_cuello' que tiene underscore — buscar exactamente.
  var seccionId = null, sistemaId = null;
  if (view !== 'menu' && view !== 'anat_menu') {
    // Match contra ANAT_SECCIONES
    for (var si = 0; si < ANAT_SECCIONES.length; si++) {
      var sid = ANAT_SECCIONES[si].id;
      var rest = view.replace(/^anat_/, '');
      if (rest === sid) { seccionId = sid; break; }
      if (rest.indexOf(sid + '_') === 0) {
        seccionId = sid;
        sistemaId = rest.slice(sid.length + 1);
        break;
      }
    }
  }

  // ── Vista raíz: grid 2x2 secciones ──
  if (view === 'menu' || view === 'anat_menu') {
    return e(ModuleShell, {
      title: 'Anatomía',
      subtitle: '4 regiones corporales · huesos, músculos, vasos y nervios',
      icon: '🩻',
      accent: '#f59e0b'
    },
      // Mensaje superior con vínculo a contenido legacy ya disponible
      e('div', {
        style: {
          padding: '16px 20px', marginBottom: p.space.xl,
          background: 'linear-gradient(135deg, rgba(96,165,250,0.10), rgba(167,139,250,0.06))',
          border: '1px solid rgba(96,165,250,0.20)',
          borderRadius: p.radius.lg,
          fontSize: 13, color: '#cbd5e1', lineHeight: 1.5
        }
      },
        e('span', null, '🚧 '),
        e('span', { style:{ fontWeight:600 } }, 'Estamos armando este módulo. '),
        e('span', null, 'Mientras tanto podés acceder a '),
        e('button', { onClick: function(){ go('anatomia'); }, style:{ background:'none', border:'none', color:'#60a5fa', cursor:'pointer', fontWeight:600, padding:0, fontFamily:'inherit', fontSize:13, textDecoration:'underline' } }, 'Pares Craneales'),
        e('span', null, ' y '),
        e('button', { onClick: function(){ go('cir_ing'); }, style:{ background:'none', border:'none', color:'#60a5fa', cursor:'pointer', fontWeight:600, padding:0, fontFamily:'inherit', fontSize:13, textDecoration:'underline' } }, 'Conducto Inguinal'),
        e('span', null, '.')
      ),
      e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: p.space.lg } },
        ANAT_SECCIONES.map(function(sec, idx) {
          // Count total items en esta sección
          var totalItems = 0;
          if (ANAT_DATA[sec.id]) {
            ['huesos','musculos','vasos','nervios'].forEach(function(sis) {
              totalItems += (ANAT_DATA[sec.id][sis] || []).length;
            });
          }
          return e('div', {
            key: sec.id,
            onClick: function() { go('anat_' + sec.id); },
            style: {
              background: 'linear-gradient(180deg,#0d1224 0%,#0a0e1f 100%)',
              border: '1px solid ' + sec.c + '38',
              borderRadius: p.radius.xl,
              padding: '24px 26px',
              cursor: 'pointer',
              minHeight: 180,
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 240ms ' + p.ease.standard + ', border-color 240ms ' + p.ease.standard + ', box-shadow 240ms ease-out',
              animation: 'ecept_fadeSlideUp 480ms ' + p.ease.out + ' ' + (idx*60) + 'ms both',
              boxSizing: 'border-box'
            },
            onMouseEnter: function(ev) { ev.currentTarget.style.borderColor = sec.c + '80'; ev.currentTarget.style.transform = 'translateY(-2px)'; ev.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.20)'; },
            onMouseLeave: function(ev) { ev.currentTarget.style.borderColor = sec.c + '38'; ev.currentTarget.style.transform = 'translateY(0)'; ev.currentTarget.style.boxShadow = 'none'; }
          },
            e('div', { style:{ display:'flex', alignItems:'center', gap:p.space.md, marginBottom:p.space.md } },
              e('span', { style:{ fontSize:34, width:60, height:60, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:p.radius.lg, background:sec.c+'14', border:'1px solid '+sec.c+'24', flexShrink:0 } }, sec.i),
              e('div', { style:{ flex:1 } },
                e('h3', { style:{ fontSize:18, fontWeight:700, color:p.color.text, letterSpacing:'-0.015em' } }, sec.n),
                e('div', { style:{ fontSize:11, color:sec.c, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', marginTop:2 } }, totalItems > 0 ? (totalItems + ' items') : 'En desarrollo')
              )
            ),
            e('p', { style:{ fontSize:13, color:p.color.textMuted, lineHeight:1.55, flex:1 } }, sec.d),
            e('div', { style:{ display:'flex', gap:6, marginTop:p.space.md, flexWrap:'wrap' } },
              ANAT_SISTEMAS.map(function(sis) {
                return e('span', { key:sis.id, style:{ fontSize:11, padding:'4px 10px', borderRadius:p.radius.pill, background:'rgba(255,255,255,0.04)', color:p.color.textMuted, border:'1px solid '+p.color.bg4, display:'inline-flex', alignItems:'center', gap:4 } },
                  e('span', { style:{ fontSize:11 } }, sis.i), sis.n
                );
              })
            )
          );
        })
      )
    );
  }

  // ── Vista de sección: grid 2x2 sistemas ──
  if (seccionId && !sistemaId) {
    var sec = ANAT_SECCIONES.find(function(x){ return x.id === seccionId; });
    if (!sec) return null;
    return e(ModuleShell, {
      title: sec.n,
      subtitle: '4 sistemas: huesos, músculos, vasos y nervios',
      icon: sec.i,
      accent: sec.c,
      onBack: function(){ go('anat_menu'); }
    },
      e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: p.space.lg } },
        ANAT_SISTEMAS.map(function(sis, idx) {
          var items = (ANAT_DATA[seccionId] && ANAT_DATA[seccionId][sis.id]) || [];
          return e('div', {
            key: sis.id,
            onClick: function() { go('anat_' + seccionId + '_' + sis.id); },
            style: {
              background: 'linear-gradient(180deg,#0d1224 0%,#0a0e1f 100%)',
              border: '1px solid ' + sis.c + '38',
              borderRadius: p.radius.xl,
              padding: '20px 22px',
              cursor: 'pointer',
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 8,
              transition: 'transform 240ms ' + p.ease.standard + ', border-color 240ms ' + p.ease.standard + ', box-shadow 240ms ease-out',
              animation: 'ecept_fadeSlideUp 380ms ' + p.ease.out + ' ' + (idx*50) + 'ms both',
              boxSizing: 'border-box'
            },
            onMouseEnter: function(ev) { ev.currentTarget.style.borderColor = sis.c + '80'; ev.currentTarget.style.transform = 'translateY(-2px)'; ev.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.30)'; },
            onMouseLeave: function(ev) { ev.currentTarget.style.borderColor = sis.c + '38'; ev.currentTarget.style.transform = 'translateY(0)'; ev.currentTarget.style.boxShadow = 'none'; }
          },
            e('span', { style:{ fontSize:34, width:60, height:60, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:p.radius.lg, background:sis.c+'14', border:'1px solid '+sis.c+'24' } }, sis.i),
            e('h3', { style:{ fontSize:17, fontWeight:600, color:p.color.text, letterSpacing:'-0.01em' } }, sis.n),
            e('div', { style:{ fontSize:11, color:sis.c, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', marginTop:'auto' } }, items.length > 0 ? (items.length + ' items') : 'Próximamente')
          );
        })
      )
    );
  }

  // ── Vista de sistema: lista de items o empty state ──
  if (seccionId && sistemaId) {
    var sec2 = ANAT_SECCIONES.find(function(x){ return x.id === seccionId; });
    var sis2 = ANAT_SISTEMAS.find(function(x){ return x.id === sistemaId; });
    if (!sec2 || !sis2) return null;
    var items = (ANAT_DATA[seccionId] && ANAT_DATA[seccionId][sistemaId]) || [];
    return e(ModuleShell, {
      title: sec2.n + ' · ' + sis2.n,
      subtitle: items.length > 0 ? (items.length + ' items') : 'Contenido en desarrollo',
      icon: sis2.i,
      accent: sis2.c,
      onBack: function(){ go('anat_' + seccionId); }
    },
      items.length === 0
        ? e(window.EmptyState || 'div', {
            icon: '🚧',
            title: 'Contenido en desarrollo',
            description: 'Sebas está armando este contenido de anatomía. Volvé pronto — vamos a tener huesos, músculos, vasos y nervios de las 4 regiones corporales.',
            actions: [{ label: 'Volver a Anatomía', onClick: function(){ go('anat_menu'); }, variant:'primary' }]
          })
        : e('div', { style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:p.space.lg } },
            items.map(function(it, idx) {
              return e('div', {
                key: it.id || idx,
                style: {
                  background: 'linear-gradient(180deg,#0d1224 0%,#0a0e1f 100%)',
                  border: '1px solid ' + sis2.c + '30',
                  borderRadius: p.radius.lg,
                  padding: '16px 18px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }
              },
                window.VisitTracker && e(window.VisitTracker, { itemType:'anatomia_item', itemId: seccionId+':'+sistemaId+':'+(it.id||idx) }),
                e('h4', { style:{ fontSize:15, fontWeight:700, color:p.color.text } }, it.n),
                it.descripcion && e('p', { style:{ fontSize:13, color:p.color.textMuted, lineHeight:1.5 } }, it.descripcion),
                user && window.FavoriteButton && e('div', { style:{ position:'absolute', top:8, right:8 } },
                  e(window.FavoriteButton, { user:user, itemType:'anatomia_item', itemId: seccionId+':'+sistemaId+':'+(it.id||idx), size:18 })
                )
              );
            })
          )
    );
  }

  return null;
}

window.AnatomiaView = AnatomiaView;
