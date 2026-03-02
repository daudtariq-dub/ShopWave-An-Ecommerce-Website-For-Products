import { useState, useCallback } from 'react';
import { inventoryApi } from '../api/inventory.api';

export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchInventory = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryApi.getAll(params);
      const list = data.inventory ?? data ?? [];
      setInventory(list);
      return list;
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to fetch inventory.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStock = useCallback(async (productId, stock) => {
    setSaving(true);
    try {
      await inventoryApi.update(productId, stock);
      setInventory((prev) =>
        prev.map((item) =>
          item.productId === productId || item.id === productId
            ? { ...item, stock }
            : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to update stock.');
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return { inventory, loading, error, saving, fetchInventory, updateStock };
}
