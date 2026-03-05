import { createContext, useState, useCallback, useRef, useEffect } from 'react';
import { getGuestCart, setGuestCart, clearGuestCart, getToken } from '../utils/helpers';
import { cartApi } from '../api/cart.api';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = getGuestCart();
    const UUID_RE =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const sanitized = (stored ?? []).filter((item) => {
      const idOk = UUID_RE.test(String(item?.id));
      const qty = Number(item?.quantity);
      const qtyOk = Number.isInteger(qty) && qty >= 1;
      return idOk && qtyOk;
    });

    // If we had stale/mock items, persist the cleaned cart
    if ((stored ?? []).length !== sanitized.length) {
      if (sanitized.length === 0) clearGuestCart();
      else setGuestCart(sanitized);
    }

    return sanitized;
  });
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const syncTimerRef = useRef(null);

  // On mount: if authenticated, load cart from backend
  useEffect(() => {
    if (!getToken()) return;
    cartApi.getCart()
      .then(({ items: serverItems }) => {
        if (serverItems.length > 0) {
          setItems(serverItems);
          setGuestCart(serverItems);
        }
      })
      .catch(() => {}); // fall back to localStorage silently
  }, []);

  const persistLocal = useCallback((nextItems) => {
    setGuestCart(nextItems);
  }, []);

  // Helper: find the cartItemId for a product
  const getCartItemId = (productId) => {
    return items.find((i) => i.id === productId)?.cartItemId ?? null;
  };

  const addToCart = useCallback(async (product, quantity = 1) => {
    // Optimistic local update
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const next = existing
        ? prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { ...product, quantity }];
      persistLocal(next);
      return next;
    });

    // Backend sync when authenticated
    if (getToken()) {
      try {
        const { items: serverItems } = await cartApi.addItem(product.id, quantity);
        setItems(serverItems);
        persistLocal(serverItems);
      } catch (err) {
        console.warn('[Cart] addItem backend sync failed:', err.message);
      }
    }
  }, [persistLocal]);

  const removeFromCart = useCallback(async (productId) => {
    const cartItemId = getCartItemId(productId);

    setItems((prev) => {
      const next = prev.filter((i) => i.id !== productId);
      persistLocal(next);
      return next;
    });

    if (getToken() && cartItemId) {
      try {
        const { items: serverItems } = await cartApi.removeItem(cartItemId);
        setItems(serverItems);
        persistLocal(serverItems);
      } catch (err) {
        console.warn('[Cart] removeItem backend sync failed:', err.message);
      }
    }
  }, [items, persistLocal]); // eslint-disable-line

  const updateQuantity = useCallback(async (productId, quantity) => {
    const cartItemId = getCartItemId(productId);

    setItems((prev) => {
      const next = quantity <= 0
        ? prev.filter((i) => i.id !== productId)
        : prev.map((i) => i.id === productId ? { ...i, quantity } : i);
      persistLocal(next);
      return next;
    });

    if (getToken() && cartItemId) {
      if (quantity <= 0) {
        try {
          const { items: serverItems } = await cartApi.removeItem(cartItemId);
          setItems(serverItems);
          persistLocal(serverItems);
        } catch (err) {
          console.warn('[Cart] removeItem backend sync failed:', err.message);
        }
      } else {
        try {
          const { items: serverItems } = await cartApi.updateItem(cartItemId, quantity);
          setItems(serverItems);
          persistLocal(serverItems);
        } catch (err) {
          console.warn('[Cart] updateItem backend sync failed:', err.message);
        }
      }
    }
  }, [items, persistLocal]); // eslint-disable-line

  const clearCart = useCallback(async () => {
    setItems([]);
    clearGuestCart();
    if (getToken()) {
      try { await cartApi.clearCart(); } catch (err) {
        console.warn('[Cart] clearCart backend sync failed:', err.message);
      }
    }
  }, []);

  // Called after login — merges true guest items (no cartItemId) with server cart.
  // Items that already have a cartItemId were synced from the server in a previous
  // session and must NOT be re-merged (that would duplicate quantities).
  const mergeGuestCart = useCallback(async (currentItems) => {
    const candidates = currentItems?.length > 0 ? currentItems : getGuestCart();
    // Only items without a cartItemId are genuine guest/offline items.
    const guestOnly = candidates.filter((item) => !item.cartItemId);

    if (!guestOnly.length) {
      // Nothing to merge — just (re)load the authoritative server cart.
      try {
        const { items: serverItems } = await cartApi.getCart();
        setItems(serverItems);
        setGuestCart(serverItems);
      } catch { /* fall back to current state */ }
      return;
    }

    setSyncing(true);
    try {
      const { items: merged } = await cartApi.mergeCart(guestOnly);
      setItems(merged);
      setGuestCart(merged);
    } catch (err) {
      setSyncError(err.message);
    } finally {
      setSyncing(false);
    }
  }, []);

  // Debounced server sync (legacy compat — individual ops now handle sync directly)
  const scheduleSync = useCallback((nextItems) => {
    clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(async () => {
      if (!getToken()) return;
      setSyncing(true);
      try {
        await cartApi.syncCart(nextItems);
        setSyncError(null);
      } catch (err) {
        setSyncError(err.message);
      } finally {
        setSyncing(false);
      }
    }, 800);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, addToCart, removeFromCart, updateQuantity, clearCart,
        mergeGuestCart, scheduleSync,
        syncing, syncError,
        totalItems, totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
