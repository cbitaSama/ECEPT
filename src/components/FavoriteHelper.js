// ══════════════════════════════════════════════════════════════
// ECEPT_FAVORITES — helper global para gestión de favoritos.
// ══════════════════════════════════════════════════════════════
// API:
//   window.ECEPT_FAVORITES.load(userId)            → Promise<Set<key>>
//   window.ECEPT_FAVORITES.isFavorite(type, id)    → boolean
//   window.ECEPT_FAVORITES.toggle(userId, type, id) → Promise<bool nuevo>
//   window.ECEPT_FAVORITES.list(userId)            → Promise<array>
//   window.ECEPT_FAVORITES.clearCache()
//
// Eventos:
//   window.dispatchEvent('ECEPT_FAVORITES_CHANGE', detail:{itemType,itemId,isFavorite})
// ══════════════════════════════════════════════════════════════

window.ECEPT_FAVORITES = {
  _cache: null,
  _cacheUserId: null,
  _loadPromise: null,

  load: function(userId) {
    if (!userId || !window.ECEPT_SUPABASE) {
      this._cache = null;
      this._cacheUserId = null;
      return Promise.resolve(new Set());
    }
    if (this._cache && this._cacheUserId === userId) return Promise.resolve(this._cache);
    if (this._loadPromise && this._cacheUserId === userId) return this._loadPromise;

    var self = this;
    self._cacheUserId = userId;
    self._loadPromise = window.ECEPT_SUPABASE
      .from('user_favorites')
      .select('item_type, item_id')
      .eq('user_id', userId)
      .then(function(res) {
        var set = new Set();
        if (res && res.data) {
          res.data.forEach(function(r) { set.add(r.item_type + ':' + r.item_id); });
        }
        self._cache = set;
        self._loadPromise = null;
        return set;
      }, function() {
        self._loadPromise = null;
        return new Set();
      });
    return self._loadPromise;
  },

  isFavorite: function(itemType, itemId) {
    if (!this._cache) return false;
    return this._cache.has(itemType + ':' + itemId);
  },

  toggle: function(userId, itemType, itemId) {
    if (!userId || !window.ECEPT_SUPABASE) return Promise.resolve(false);
    var self = this;
    var key = itemType + ':' + itemId;
    var isFav = self._cache && self._cache.has(key);

    var op = isFav
      ? window.ECEPT_SUPABASE.from('user_favorites').delete()
          .eq('user_id', userId).eq('item_type', itemType).eq('item_id', itemId)
      : window.ECEPT_SUPABASE.from('user_favorites').insert({
          user_id: userId, item_type: itemType, item_id: itemId
        });

    return op.then(function(res) {
      if (res && res.error) {
        if (window.ECEPT_toast) window.ECEPT_toast('Error guardando favorito', 'error');
        return isFav;
      }
      if (self._cache) {
        if (isFav) self._cache.delete(key);
        else self._cache.add(key);
      }
      try {
        window.dispatchEvent(new CustomEvent('ECEPT_FAVORITES_CHANGE', {
          detail: { itemType: itemType, itemId: itemId, isFavorite: !isFav }
        }));
      } catch(e2) {}
      return !isFav;
    }, function() {
      if (window.ECEPT_toast) window.ECEPT_toast('Error guardando favorito', 'error');
      return isFav;
    });
  },

  list: function(userId) {
    if (!userId || !window.ECEPT_SUPABASE) return Promise.resolve([]);
    return window.ECEPT_SUPABASE
      .from('user_favorites')
      .select('item_type, item_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(function(res) { return (res && res.data) || []; },
            function() { return []; });
  },

  clearCache: function() {
    this._cache = null;
    this._cacheUserId = null;
    this._loadPromise = null;
  }
};

// Limpiar cache cuando cambia el user (auth event)
window.addEventListener('ECEPT_AUTH_CHANGE', function() {
  window.ECEPT_FAVORITES.clearCache();
});
