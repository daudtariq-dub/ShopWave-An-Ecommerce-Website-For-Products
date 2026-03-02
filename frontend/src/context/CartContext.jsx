import { createContext, useState, useCallback, useRef } from 'react';
import { getGuestCart, setGuestCart, clearGuestCart } from '../utils/helpers';
import { cartApi } from '../api/cart.api';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => getGuestCart());
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const syncTimerRef = useRef(null);


  const persistLocal = useCallback((nextItems) => {
    setGuestCart(nextItems);
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const next = existing
        ? prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [...prev, { ...product, quantity }];
      persistLocal(next);
      return next;
    });
  }, [persistLocal]);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== productId);
      persistLocal(next);
      return next;
    });
  }, [persistLocal]);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) => {
      const next = quantity <= 0
        ? prev.filter((i) => i.id !== productId)
        : prev.map((i) => i.id === productId ? { ...i, quantity } : i);
      persistLocal(next);
      return next;
    });
  }, [persistLocal]);

  const clearCart = useCallback(() => {
    setItems([]);
    clearGuestCart();
  }, []);

  // Called after login — merges guest cart with server cart
  const mergeGuestCart = useCallback(async (currentItems) => {
    const guestItems = currentItems.length > 0 ? currentItems : getGuestCart();
    if (!guestItems.length) {
      // Just fetch server cart
      try {
        const data = await cartApi.getCart();
        const serverItems = data.items ?? data ?? [];
        setItems(serverItems);
        clearGuestCart();
      } catch { /* server may not have cart yet */ }
      return;
    }
    setSyncing(true);
    try {
      const data = await cartApi.mergeCart(guestItems);
      const merged = data.items ?? data ?? [];
      setItems(merged);
      clearGuestCart();
    } catch (err) {
      setSyncError(err.message);
    } finally {
      setSyncing(false);
    }
  }, []);

  // Debounced server sync (called when authenticated and items change)
  const scheduleSync = useCallback((nextItems) => {
    clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(async () => {
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
