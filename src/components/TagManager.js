// ══════════════════════════════════════════════════════════════
// TAG MANAGER — gestión de etiquetas de usuario como entidades
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Globales internos con prefijo TM_ para evitar colisiones.
// Props: user, supabase, onClose
// ══════════════════════════════════════════════════════════════

var TAG_PALETTE = ["#a78bfa","#60a5fa","#34d399","#fbbf24","#f472b6","#ef4444","#06b6d4","#fb923c","#8b5cf6","#10b981","#ec4899","#84cc16"];

function TagManager(props) {
  var user = props.user;
  var supabase = props.supabase || window.ECEPT_SUPABASE;
  var s;

  s=useState([]);        var TM_tags=s[0],       TM_setTags=s[1];
  s=useState(true);      var TM_loading=s[0],     TM_setLoading=s[1];
  s=useState(null);      var TM_editId=s[0],      TM_setEditId=s[1];
  s=useState("");        var TM_editName=s[0],    TM_setEditName=s[1];
  s=useState("#a78bfa"); var TM_editColor=s[0],   TM_setEditColor=s[1];
  s=useState(null);      var TM_deleteId=s[0],    TM_setDeleteId=s[1];
  s=useState("");        var TM_newName=s[0],     TM_setNewName=s[1];
  s=useState("#a78bfa"); var TM_newColor=s[0],    TM_setNewColor=s[1];
  s=useState(false);     var TM_saving=s[0],      TM_setSaving=s[1];
  s=useState("");        var TM_err=s[0],         TM_setErr=s[1];

  function TM_load() {
    if (!user || !supabase) { TM_setLoading(false); return; }
    TM_setLoading(true);
    supabase
      .from("user_tags")
      .select("id,name,color")
      .eq("user_id", user.id)
      .order("name")
      .then(function(res) {
        TM_setLoading(false);
        if (res && !res.error) TM_setTags(res.data || []);
      }).catch(function() { TM_setLoading(false); });
  }

  useEffect(function() { TM_load(); }, []);

  function TM_startEdit(tag) {
    TM_setEditId(tag.id);
    TM_setEditName(tag.name);
    TM_setEditColor(tag.color || "#a78bfa");
    TM_setDeleteId(null);
    TM_setErr("");
  }

  function TM_cancelEdit() {
    TM_setEditId(null);
    TM_setErr("");
  }

  function TM_saveEdit() {
    var name = TM_editName.trim().toLowerCase().replace(/[^a-z0-9\-_áéíóúñü]/g, "");
    if (!name) { TM_setErr("El nombre no puede estar vacío."); return; }
    if (!supabase) return;
    TM_setSaving(true); TM_setErr("");
    supabase.from("user_tags")
      .update({ name: name, color: TM_editColor })
      .eq("id", TM_editId)
      .then(function(res) {
        TM_setSaving(false);
        if (res && res.error) { TM_setErr("No se pudo guardar."); return; }
        TM_setEditId(null);
        TM_load();
      }).catch(function() { TM_setSaving(false); TM_setErr("Error de conexión."); });
  }

  function TM_confirmDelete(id) {
    TM_setDeleteId(id);
    TM_setEditId(null);
    TM_setErr("");
  }

  function TM_cancelDelete() { TM_setDeleteId(null); }

  function TM_doDelete(id) {
    if (!supabase) return;
    TM_setSaving(true);
    supabase.from("user_tags").delete().eq("id", id)
      .then(function() {
        TM_setSaving(false);
        TM_setDeleteId(null);
        TM_load();
      }).catch(function() { TM_setSaving(false); });
  }

  function TM_create() {
    var name = TM_newName.trim().toLowerCase().replace(/[^a-z0-9\-_áéíóúñü]/g, "");
    if (!name) { TM_setErr("El nombre no puede estar vacío."); return; }
    if (!user || !supabase) return;
    TM_setSaving(true); TM_setErr("");
    supabase.from("user_tags")
      .insert({ user_id: user.id, name: name, color: TM_newColor })
      .then(function(res) {
        TM_setSaving(false);
        if (res && res.error) {
          TM_setErr(res.error.code === "23505" ? "Esa etiqueta ya existe." : "No se pudo crear.");
          return;
        }
        TM_setNewName("");
        TM_setNewColor("#a78bfa");
        TM_load();
      }).catch(function() { TM_setSaving(false); TM_setErr("Error de conexión."); });
  }

  // ── Palette swatch row (shared by edit + create) ──
  function TM_swatches(selectedColor, onSelect) {
    return e("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }},
      TAG_PALETTE.map(function(co) {
        var sel = co === selectedColor;
        return e("button", {
          key: co,
          onClick: function() { onSelect(co); },
          "aria-label": co,
          style: {
            width: "44px", height: "44px",
            background: "none", border: "none", cursor: "pointer", padding: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }
        },
          e("div", { style: {
            width: "24px", height: "24px", borderRadius: "50%",
            background: co,
            boxShadow: sel ? "0 0 0 3px " + co + "50, 0 0 0 5px " + co : "none",
            transition: "box-shadow .15s"
          }})
        );
      })
    );
  }

  // ── Tag row renderer ──
  function TM_tagRow(tag) {
    var isEditing = TM_editId === tag.id;
    var isDeleting = TM_deleteId === tag.id;
    var col = tag.color || "#a78bfa";

    if (isDeleting) {
      return e("div", { key: tag.id, style: {
        display: "flex", alignItems: "center", gap: "8px",
        padding: "10px 12px", borderRadius: "10px",
        background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.28)",
        marginBottom: "6px"
      }},
        e("span", { style: { fontSize: "13px", color: "#fca5a5", flex: 1, lineHeight: 1.4 }},
          "¿Eliminar #" + tag.name + "?"
        ),
        e("button", {
          onClick: function() { TM_doDelete(tag.id); },
          disabled: TM_saving,
          style: {
            minHeight: "44px", padding: "8px 16px", borderRadius: "8px",
            background: "#ef4444", border: "none", color: "#fff",
            fontSize: "13px", fontWeight: 700, cursor: TM_saving ? "default" : "pointer"
          }
        }, "Sí"),
        e("button", {
          onClick: TM_cancelDelete,
          disabled: TM_saving,
          style: {
            minHeight: "44px", padding: "8px 16px", borderRadius: "8px",
            background: "none", border: "1px solid " + C.bd,
            color: C.mt, fontSize: "13px", cursor: TM_saving ? "default" : "pointer"
          }
        }, "No")
      );
    }

    if (isEditing) {
      return e("div", { key: tag.id, style: {
        padding: "12px", borderRadius: "10px",
        background: "rgba(255,255,255,.03)", border: "1px solid " + C.bd,
        marginBottom: "6px"
      }},
        e("input", {
          type: "text", value: TM_editName, disabled: TM_saving,
          onChange: function(ev) { TM_setEditName(ev.target.value); TM_setErr(""); },
          onKeyDown: function(ev) { if (ev.key === "Enter") TM_saveEdit(); },
          style: {
            width: "100%", padding: "8px 10px", borderRadius: "8px",
            border: "1px solid " + C.bd, background: C.bg,
            color: C.tx, fontSize: "13px", outline: "none",
            boxSizing: "border-box", marginBottom: "8px"
          }
        }),
        TM_swatches(TM_editColor, TM_setEditColor),
        e("div", { style: { display: "flex", gap: "6px" }},
          e("button", {
            onClick: TM_saveEdit, disabled: TM_saving,
            style: {
              minHeight: "44px", padding: "8px 18px", borderRadius: "8px",
              background: TM_saving ? C.bd : "linear-gradient(135deg,#a78bfa,#60a5fa)",
              border: "none", color: "#fff", fontSize: "13px",
              fontWeight: 700, cursor: TM_saving ? "default" : "pointer"
            }
          }, TM_saving ? "Guardando..." : "Guardar"),
          e("button", {
            onClick: TM_cancelEdit, disabled: TM_saving,
            style: {
              minHeight: "44px", padding: "8px 18px", borderRadius: "8px",
              background: "none", border: "1px solid " + C.bd,
              color: C.mt, fontSize: "13px", cursor: TM_saving ? "default" : "pointer"
            }
          }, "Cancelar")
        )
      );
    }

    // Normal row
    return e("div", { key: tag.id, style: {
      display: "flex", alignItems: "center", gap: "8px",
      padding: "6px 8px 6px 12px", borderRadius: "10px",
      background: "rgba(255,255,255,.02)", border: "1px solid " + C.bd,
      marginBottom: "6px"
    }},
      e("span", { style: {
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "4px 10px", borderRadius: "999px",
        background: col + "20", border: "1px solid " + col + "45",
        color: col, fontSize: "12px", fontWeight: 600, flex: 1, minWidth: 0
      }},
        e("span", { style: {
          width: "10px", height: "10px", borderRadius: "50%",
          background: col, flexShrink: 0
        }}),
        "#" + tag.name
      ),
      e("button", {
        onClick: function() { TM_startEdit(tag); },
        "aria-label": "Editar",
        style: {
          background: "none", border: "none", color: C.dm,
          fontSize: "16px", cursor: "pointer",
          minWidth: "44px", minHeight: "44px",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "8px"
        }
      }, "✎"),
      e("button", {
        onClick: function() { TM_confirmDelete(tag.id); },
        "aria-label": "Eliminar",
        style: {
          background: "none", border: "none", color: C.dm,
          fontSize: "16px", cursor: "pointer",
          minWidth: "44px", minHeight: "44px",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "8px"
        }
      }, "🗑")
    );
  }

  // ── Render ──
  return ReactDOM.createPortal(
    e("div", {
      onClick: function(ev) { if (ev.target === ev.currentTarget) props.onClose(); },
      style: {
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 250,
        background: "rgba(6,10,20,.85)",
        backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "20px", overflowY: "auto", WebkitOverflowScrolling: "touch",
        animation: "fadeIn .18s ease-out"
      }
    },
      e("div", {
        onClick: function(ev) { ev.stopPropagation(); },
        style: {
          width: "100%", maxWidth: "520px",
          background: C.cd, border: "1px solid " + C.bd,
          borderRadius: "18px",
          boxShadow: "0 16px 48px rgba(0,0,0,.7)",
          padding: "22px 20px 20px",
          boxSizing: "border-box",
          marginTop: "20px", marginBottom: "20px",
          animation: "slideUp .25s ease-out"
        }
      },

        // Header
        e("div", { style: {
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "20px"
        }},
          e("h2", { style: { fontSize: "17px", fontWeight: 800, color: C.tx, margin: 0 }},
            "🏷️ Mis etiquetas"
          ),
          e("button", {
            onClick: props.onClose, "aria-label": "Cerrar",
            style: {
              background: "none", border: "none", color: C.mt, fontSize: "24px",
              cursor: "pointer",
              minWidth: "44px", minHeight: "44px",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "8px"
            }
          }, "×")
        ),

        // Error banner
        TM_err && e("div", { style: {
          color: "#fca5a5", background: "rgba(239,68,68,.10)",
          border: "1px solid rgba(239,68,68,.28)", borderRadius: "10px",
          padding: "10px 12px", fontSize: "13px", marginBottom: "12px"
        }}, TM_err),

        // Loading
        TM_loading && e("div", { style: {
          textAlign: "center", padding: "32px 0", color: C.dm, fontSize: "13px"
        }}, "Cargando etiquetas..."),

        // Empty state
        !TM_loading && TM_tags.length === 0 && e("div", { style: {
          textAlign: "center", padding: "28px 0"
        }},
          e("div", { style: { fontSize: "36px", marginBottom: "8px" }}, "🏷️"),
          e("p", { style: { fontSize: "13px", fontWeight: 600, color: C.tx, marginBottom: "4px" }},
            "Aún no tenés etiquetas"
          ),
          e("p", { style: { fontSize: "12px", color: C.dm }},
            "Creá tu primera etiqueta abajo."
          )
        ),

        // Tag list
        !TM_loading && TM_tags.length > 0 && e("div", { style: { marginBottom: "16px" }},
          TM_tags.map(function(tag) { return TM_tagRow(tag); })
        ),

        // Divider before create footer
        !TM_loading && TM_tags.length > 0 && e("div", { style: {
          height: "1px", background: C.bd, marginBottom: "16px"
        }}),

        // Footer: create new tag
        !TM_loading && e("div", null,
          e("p", { style: {
            fontSize: "11px", fontWeight: 700, color: C.mt,
            textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px"
          }}, "Nueva etiqueta"),
          e("input", {
            type: "text", value: TM_newName, disabled: TM_saving,
            placeholder: "nombre-etiqueta",
            onChange: function(ev) { TM_setNewName(ev.target.value); TM_setErr(""); },
            onKeyDown: function(ev) { if (ev.key === "Enter") TM_create(); },
            style: {
              width: "100%", padding: "10px 12px", borderRadius: "10px",
              border: "1px solid " + C.bd, background: C.bg,
              color: C.tx, fontSize: "13px", outline: "none",
              boxSizing: "border-box", marginBottom: "8px"
            }
          }),
          TM_swatches(TM_newColor, TM_setNewColor),
          e("button", {
            onClick: TM_create, disabled: TM_saving || !TM_newName.trim(),
            style: {
              width: "100%", minHeight: "48px", padding: "12px",
              borderRadius: "12px",
              background: (TM_saving || !TM_newName.trim())
                ? C.bd
                : "linear-gradient(135deg,#a78bfa,#60a5fa)",
              color: "#fff", border: "none",
              fontSize: "14px", fontWeight: 700,
              cursor: (TM_saving || !TM_newName.trim()) ? "default" : "pointer",
              boxShadow: (!TM_saving && TM_newName.trim())
                ? "0 4px 14px rgba(167,139,250,.35)" : "none"
            }
          }, TM_saving ? "Creando..." : "+ Crear etiqueta")
        )
      )
    ),
    document.body
  );
}

window.TagManager = TagManager;
