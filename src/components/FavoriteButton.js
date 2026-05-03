// ══════════════════════════════════════════════════════════════
// FavoriteButton — botón ⭐ universal para marcar/desmarcar favoritos.
// ══════════════════════════════════════════════════════════════
// Props:
//   itemType — string ('enfermedad', 'triada', 'lab', etc.)
//   itemId   — string identificador único.
//   user     — supabase user (puede ser null).
//   size     — número (default 20).
// Eventos: escucha ECEPT_FAVORITES_CHANGE para sync entre instancias.
// ══════════════════════════════════════════════════════════════

function FavoriteButton(props) {
  var user = props.user;
  var s = useState(false);
  var isFav = s[0];
  var setIsFav = s[1];
  s = useState(false);
  var loading = s[0];
  var setLoading = s[1];

  useEffect(function() {
    if (!user) { setIsFav(false); return; }
    window.ECEPT_FAVORITES.load(user.id).then(function() {
      setIsFav(window.ECEPT_FAVORITES.isFavorite(props.itemType, props.itemId));
    });
  }, [user, props.itemType, props.itemId]);

  useEffect(function() {
    function onChange(ev) {
      if (!ev || !ev.detail) return;
      if (ev.detail.itemType === props.itemType && ev.detail.itemId === props.itemId) {
        setIsFav(!!ev.detail.isFavorite);
      }
    }
    window.addEventListener('ECEPT_FAVORITES_CHANGE', onChange);
    return function() { window.removeEventListener('ECEPT_FAVORITES_CHANGE', onChange); };
  }, [props.itemType, props.itemId]);

  function handleToggle(ev) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    if (ev && ev.preventDefault) ev.preventDefault();
    if (loading || !user) {
      if (!user && window.ECEPT_toast) window.ECEPT_toast('Iniciá sesión para guardar favoritos', 'info');
      return;
    }
    setLoading(true);
    window.ECEPT_FAVORITES.toggle(user.id, props.itemType, props.itemId).then(function(newState) {
      setIsFav(newState);
      if (window.ECEPT_toast) {
        window.ECEPT_toast(newState ? 'Agregado a favoritos' : 'Quitado de favoritos', newState ? 'success' : 'info');
      }
      setLoading(false);
    });
  }

  var size = props.size || 20;

  return e('button', {
    onClick: handleToggle,
    'aria-label': isFav ? 'Quitar de favoritos' : 'Agregar a favoritos',
    title: isFav ? 'Quitar de favoritos' : 'Agregar a favoritos',
    style: {
      width: size + 16,
      height: size + 16,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: 'none',
      cursor: loading || !user ? 'default' : 'pointer',
      borderRadius: '50%',
      transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      color: isFav ? '#fbbf24' : '#64748b',
      fontSize: size,
      padding: 0,
      flexShrink: 0,
      opacity: loading ? 0.5 : 1
    },
    onMouseEnter: function(ev) {
      if (loading || !user) return;
      ev.currentTarget.style.background = 'rgba(251,191,36,0.10)';
      ev.currentTarget.style.transform = 'scale(1.10)';
    },
    onMouseLeave: function(ev) {
      ev.currentTarget.style.background = 'transparent';
      ev.currentTarget.style.transform = 'scale(1)';
    }
  }, isFav ? '⭐' : '☆');
}

window.FavoriteButton = FavoriteButton;

// ── useLongPress hook helper (largo-press para favoritar en listas) ──
function useLongPress(callback, delay) {
  delay = delay || 500;
  var timer = useRef(null);
  var triggered = useRef(false);

  function start() {
    triggered.current = false;
    timer.current = setTimeout(function() {
      triggered.current = true;
      try { callback(); } catch(e2) {}
    }, delay);
  }
  function clear() {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
  }

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onContextMenu: function(ev) { ev.preventDefault(); },
    wasTriggered: function() { return triggered.current; }
  };
}

window.useLongPress = useLongPress;
