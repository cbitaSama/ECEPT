// ══════════════════════════════════════════════════════════════
// ProjectsManager — modal completo para gestionar Proyectos del chat.
// ══════════════════════════════════════════════════════════════
// Props:
//   open       — boolean. Cuando true, modal visible.
//   onClose    — fn(). Cierra el modal.
//   user       — supabase user.
//   onChange   — fn(projects). Callback cuando la lista cambia
//                (parent puede refrescar su CB_projects).
// ══════════════════════════════════════════════════════════════

var PM_ICONS = ['📁','📚','🩺','💊','🧠','🦴','🫀','✨','📝','🎯','⚡','📊'];
var PM_COLORS = ['#a78bfa','#60a5fa','#34d399','#fbbf24','#ef4444','#94a3b8'];

function ProjectsManager(props) {
  var p = T;
  var user = props.user;

  var s;
  s = useState([]);    var PM_projects = s[0],   PM_setProjects = s[1];
  s = useState(true);  var PM_loading = s[0],    PM_setLoading = s[1];
  s = useState(null);  var PM_editing = s[0],    PM_setEditing = s[1]; // null | 'new' | uuid
  s = useState({ name:'', description:'', context:'', color:'#a78bfa', icon:'📁' });
  var PM_form = s[0];  var PM_setForm = s[1];
  s = useState('');    var PM_err = s[0],        PM_setErr = s[1];
  s = useState(false); var PM_saving = s[0],     PM_setSaving = s[1];

  function PM_loadProjects() {
    if (!user || !window.ECEPT_SUPABASE) { PM_setLoading(false); return; }
    PM_setLoading(true);
    window.ECEPT_SUPABASE.auth.getSession().then(function(sess) {
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) { PM_setLoading(false); return; }
      fetch('/api/projects', { headers: { Authorization: 'Bearer ' + token } })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          var list = (data && data.projects) || [];
          PM_setProjects(list);
          PM_setLoading(false);
          if (typeof props.onChange === 'function') props.onChange(list);
        }, function() { PM_setLoading(false); });
    });
  }

  useEffect(function() {
    if (props.open && user) PM_loadProjects();
  }, [props.open, user]);

  // Si props.editingProject viene con datos, abrir form directamente.
  useEffect(function() {
    if (props.open && props.editingProject) {
      PM_setForm({
        name: props.editingProject.name || '',
        description: props.editingProject.description || '',
        context: props.editingProject.context || '',
        color: props.editingProject.color || '#a78bfa',
        icon: props.editingProject.icon || '📁'
      });
      PM_setErr('');
      PM_setEditing(props.editingProject.id);
    }
  }, [props.open, props.editingProject]);

  function PM_openCreate() {
    PM_setForm({ name:'', description:'', context:'', color:'#a78bfa', icon:'📁' });
    PM_setErr('');
    PM_setEditing('new');
  }
  function PM_openEdit(proj) {
    PM_setForm({
      name: proj.name || '',
      description: proj.description || '',
      context: proj.context || '',
      color: proj.color || '#a78bfa',
      icon: proj.icon || '📁'
    });
    PM_setErr('');
    PM_setEditing(proj.id);
  }
  function PM_cancelEdit() {
    PM_setEditing(null);
    PM_setErr('');
  }

  function PM_save() {
    var name = (PM_form.name || '').trim();
    if (!name) { PM_setErr('El nombre es obligatorio.'); return; }
    if (name.length > 100) { PM_setErr('Máximo 100 caracteres en el nombre.'); return; }
    PM_setSaving(true);
    PM_setErr('');
    window.ECEPT_SUPABASE.auth.getSession().then(function(sess) {
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) { PM_setErr('Sesión expirada.'); PM_setSaving(false); return; }
      var isNew = PM_editing === 'new';
      var body = isNew
        ? PM_form
        : Object.assign({ id: PM_editing }, PM_form);
      fetch('/api/projects', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(body)
      }).then(function(r) {
        if (!r.ok) {
          return r.json().then(function(d) { throw new Error(d.error || 'Error'); }, function() { throw new Error('Error de red'); });
        }
        return r.json();
      }).then(function() {
        PM_setSaving(false);
        PM_setEditing(null);
        PM_loadProjects();
        if (window.ECEPT_toast) window.ECEPT_toast(isNew ? 'Proyecto creado' : 'Proyecto actualizado', 'success');
      }, function(err) {
        PM_setSaving(false);
        PM_setErr(err.message || 'Error');
      });
    });
  }

  function PM_archive(projId) {
    if (!window.confirm('¿Archivar este proyecto? Las conversaciones se mantendrán pero quedarán sin proyecto.')) return;
    window.ECEPT_SUPABASE.auth.getSession().then(function(sess) {
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ id: projId })
      }).then(function() {
        PM_loadProjects();
        if (window.ECEPT_toast) window.ECEPT_toast('Proyecto archivado', 'info');
      });
    });
  }

  if (!props.open) return null;

  // ── Render del modal ──
  return ReactDOM.createPortal(
    e('div', {
      style:{ position:'fixed', inset:0, zIndex:10005, background:'rgba(6,10,20,0.85)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', animation:'ecept_fadeIn 240ms cubic-bezier(0.16,1,0.3,1)' },
      onClick: function(ev) { if (ev.target === ev.currentTarget && !PM_editing) props.onClose(); }
    },
      e('div', {
        style:{
          width:'100%', maxWidth: PM_editing ? 560 : 640,
          maxHeight:'90vh',
          background:'linear-gradient(180deg,rgba(13,18,36,0.96) 0%,rgba(10,14,31,0.96) 100%)',
          border:'1px solid rgba(167,139,250,0.22)',
          borderRadius:24,
          boxShadow:'0 24px 60px rgba(0,0,0,0.50), 0 0 40px rgba(167,139,250,0.08)',
          overflow:'hidden',
          display:'flex',
          flexDirection:'column',
          animation:'ecept_modalIn 320ms cubic-bezier(0.16,1,0.3,1)'
        }
      },
        // ── Header ──
        e('div', { style:{ padding:'20px 24px 16px', borderBottom:'1px solid rgba(167,139,250,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 } },
          e('div', null,
            e('h2', { style:{ margin:0, fontSize:18, fontWeight:700, color:p.color.text, letterSpacing:'-0.015em', display:'flex', alignItems:'center', gap:8 } },
              e('span', null, PM_editing === 'new' ? '✨' : (PM_editing ? '✎' : '📁')),
              e('span', null, PM_editing === 'new' ? 'Nuevo proyecto' : (PM_editing ? 'Editar proyecto' : 'Mis Proyectos'))
            ),
            !PM_editing && e('div', { style:{ marginTop:4, fontSize:12, color:p.color.textMuted, lineHeight:1.5 } },
              'Organizá tus chats en proyectos. Cada uno puede tener contexto compartido que Elion recuerda.')
          ),
          e('button', {
            onClick: function() { PM_editing ? PM_cancelEdit() : props.onClose(); },
            'aria-label':'Cerrar',
            style:{ background:'transparent', border:'1px solid '+p.color.bg4, color:p.color.textMuted, width:32, height:32, borderRadius:10, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }
          }, '×')
        ),

        // ── Content ──
        PM_editing
          ? PM_renderForm()
          : PM_renderList()
      )
    ),
    document.body
  );

  // ── List view ──
  function PM_renderList() {
    return e('div', { style:{ flex:1, overflowY:'auto', padding:'16px 20px 20px' } },
      PM_loading
        ? e('div', { style:{ padding:'40px 20px', textAlign:'center', color:p.color.textDim, fontSize:13 } }, 'Cargando proyectos...')
        : PM_projects.length === 0
          ? e('div', { style:{ padding:'40px 20px', textAlign:'center' } },
              e('div', { style:{ fontSize:48, marginBottom:12 } }, '📂'),
              e('div', { style:{ fontSize:15, fontWeight:600, color:p.color.text, marginBottom:6 } }, 'Aún no tenés proyectos'),
              e('div', { style:{ fontSize:12, color:p.color.textMuted, lineHeight:1.5, maxWidth:320, margin:'0 auto 18px' } },
                'Creá un proyecto para agrupar chats relacionados (ej: "Cardio Examen", "Casos clínicos").')
            )
          : e('div', { style:{ display:'flex', flexDirection:'column', gap:10 } },
              PM_projects.map(function(proj, idx) {
                return e('div', { key: proj.id, style:{
                  background:'linear-gradient(135deg, ' + (proj.color || '#a78bfa') + '14, rgba(255,255,255,0.02))',
                  border:'1px solid ' + (proj.color || '#a78bfa') + '30',
                  borderRadius:14,
                  padding:'14px 18px',
                  display:'flex',
                  alignItems:'center',
                  gap:14,
                  animation:'ecept_fadeSlideUp 280ms ease-out ' + (idx*40) + 'ms both'
                } },
                  e('span', { style:{ fontSize:24, width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', background:(proj.color||'#a78bfa')+'18', border:'1px solid '+(proj.color||'#a78bfa')+'30', borderRadius:12, flexShrink:0 } }, proj.icon || '📁'),
                  e('div', { style:{ flex:1, minWidth:0 } },
                    e('div', { style:{ fontSize:14, fontWeight:600, color:p.color.text, marginBottom:2, letterSpacing:'-0.01em' } }, proj.name),
                    e('div', { style:{ fontSize:11, color:p.color.textDim } },
                      (proj.conv_count || 0) + ' chat' + (proj.conv_count === 1 ? '' : 's') +
                      (proj.description ? ' · ' + proj.description : '')
                    )
                  ),
                  e('button', {
                    onClick: function() { PM_openEdit(proj); },
                    title:'Editar',
                    style:{ background:'rgba(255,255,255,0.04)', border:'1px solid '+p.color.bg4, color:p.color.textMuted, padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', flexShrink:0 }
                  }, 'Editar'),
                  e('button', {
                    onClick: function() { PM_archive(proj.id); },
                    title:'Archivar',
                    style:{ background:'transparent', border:'none', color:p.color.textDim, padding:'6px 8px', borderRadius:8, fontSize:14, cursor:'pointer', fontFamily:'inherit', flexShrink:0 }
                  }, '⋯')
                );
              })
            ),
      e('button', {
        onClick: PM_openCreate,
        style:{
          marginTop: PM_projects.length > 0 ? 12 : 0,
          width:'100%', padding:'14px 18px',
          background:'linear-gradient(135deg, rgba(167,139,250,0.14), rgba(96,165,250,0.10))',
          border:'1px dashed rgba(167,139,250,0.40)',
          borderRadius:14,
          color:'#a78bfa',
          fontSize:14, fontWeight:600,
          cursor:'pointer', fontFamily:'inherit',
          letterSpacing:'-0.01em',
          transition:'all 200ms ease-out'
        },
        onMouseEnter: function(ev) { ev.currentTarget.style.borderColor='rgba(167,139,250,0.70)'; ev.currentTarget.style.background='linear-gradient(135deg, rgba(167,139,250,0.22), rgba(96,165,250,0.16))'; },
        onMouseLeave: function(ev) { ev.currentTarget.style.borderColor='rgba(167,139,250,0.40)'; ev.currentTarget.style.background='linear-gradient(135deg, rgba(167,139,250,0.14), rgba(96,165,250,0.10))'; }
      }, '+ Crear nuevo proyecto')
    );
  }

  // ── Form view ──
  function PM_renderForm() {
    var inputStyle = { width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid '+p.color.bg4, background:'rgba(13,18,36,0.6)', color:p.color.text, fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 200ms ease-out' };
    var labelStyle = { display:'block', fontSize:12, fontWeight:600, color:p.color.textMuted, marginBottom:6, letterSpacing:'0.02em' };

    return e('div', { style:{ flex:1, overflowY:'auto', padding:'20px 24px 24px' } },
      // Nombre
      e('div', { style:{ marginBottom:16 } },
        e('label', { style: labelStyle }, 'Nombre *'),
        e('input', {
          type:'text', value: PM_form.name,
          maxLength: 100,
          onChange: function(ev) { PM_setForm(Object.assign({}, PM_form, { name: ev.target.value })); },
          placeholder:'Ej: Cardio Examen Final',
          style: inputStyle,
          autoFocus: true,
          onFocus: function(ev) { ev.currentTarget.style.borderColor='rgba(167,139,250,0.50)'; },
          onBlur: function(ev) { ev.currentTarget.style.borderColor=p.color.bg4; }
        })
      ),
      // Ícono
      e('div', { style:{ marginBottom:16 } },
        e('label', { style: labelStyle }, 'Ícono'),
        e('div', { style:{ display:'flex', flexWrap:'wrap', gap:8 } },
          PM_ICONS.map(function(ic) {
            var sel = PM_form.icon === ic;
            return e('button', { key: ic,
              onClick: function() { PM_setForm(Object.assign({}, PM_form, { icon: ic })); },
              style:{
                width:38, height:38, fontSize:18,
                background: sel ? 'rgba(167,139,250,0.20)' : 'rgba(13,18,36,0.6)',
                border: '1px solid ' + (sel ? 'rgba(167,139,250,0.50)' : p.color.bg4),
                borderRadius:10,
                cursor:'pointer', fontFamily:'inherit',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 180ms ease-out'
              }
            }, ic);
          })
        )
      ),
      // Color
      e('div', { style:{ marginBottom:16 } },
        e('label', { style: labelStyle }, 'Color'),
        e('div', { style:{ display:'flex', gap:8 } },
          PM_COLORS.map(function(col) {
            var sel = PM_form.color === col;
            return e('button', { key: col,
              onClick: function() { PM_setForm(Object.assign({}, PM_form, { color: col })); },
              style:{
                width:32, height:32, borderRadius:'50%',
                background: col,
                border: sel ? '2px solid #fff' : '2px solid transparent',
                cursor:'pointer', boxShadow: sel ? '0 0 0 3px ' + col + '40' : 'none',
                transition: 'box-shadow 180ms ease-out'
              }
            });
          })
        )
      ),
      // Descripción
      e('div', { style:{ marginBottom:16 } },
        e('label', { style: labelStyle }, 'Descripción (opcional)'),
        e('textarea', {
          value: PM_form.description,
          maxLength: 500,
          onChange: function(ev) { PM_setForm(Object.assign({}, PM_form, { description: ev.target.value })); },
          placeholder:'Resumen breve para identificar el proyecto',
          rows: 2,
          style: Object.assign({}, inputStyle, { resize:'vertical', minHeight:60, fontFamily:'inherit', lineHeight:1.5 })
        })
      ),
      // Contexto Elion
      e('div', { style:{ marginBottom:14 } },
        e('label', { style: labelStyle }, 'Contexto para Elion (opcional)'),
        e('textarea', {
          value: PM_form.context,
          maxLength: 5000,
          onChange: function(ev) { PM_setForm(Object.assign({}, PM_form, { context: ev.target.value })); },
          placeholder:'Información que Elion va a tener presente en TODOS los chats de este proyecto. Ej: "Estoy preparando el examen final de cardio. Foco en arritmias y manejo agudo. Respondé con énfasis en aplicación clínica."',
          rows: 5,
          style: Object.assign({}, inputStyle, { resize:'vertical', minHeight:120, fontFamily:'inherit', lineHeight:1.55 })
        }),
        e('div', { style:{ marginTop:6, fontSize:11, color:p.color.textDim, lineHeight:1.5 } },
          'Elion va a tener este contexto en todos los chats de este proyecto.'
        )
      ),
      // Error
      PM_err && e('div', {
        role:'alert',
        style:{ padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.30)', color:'#fca5a5', fontSize:12, marginBottom:12 }
      }, PM_err),
      // Buttons
      e('div', { style:{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:12 } },
        e('button', {
          onClick: PM_cancelEdit,
          disabled: PM_saving,
          style:{ padding:'10px 18px', borderRadius:10, border:'1px solid '+p.color.bg4, background:'transparent', color:p.color.textMuted, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }
        }, 'Cancelar'),
        e('button', {
          onClick: PM_save,
          disabled: PM_saving,
          style:{ padding:'10px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#60a5fa,#a78bfa)', color:'#fff', fontSize:13, fontWeight:700, cursor: PM_saving ? 'default' : 'pointer', fontFamily:'inherit', boxShadow:'0 4px 12px rgba(167,139,250,0.30)', opacity: PM_saving ? 0.6 : 1 }
        }, PM_saving ? 'Guardando...' : (PM_editing === 'new' ? 'Crear proyecto' : 'Guardar cambios'))
      )
    );
  }
}

window.ProjectsManager = ProjectsManager;
