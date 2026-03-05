import { useState, useCallback } from 'react';
import { ordersApi } from '../api/orders.api';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getAll(params);
      const list = data.orders ?? data ?? [];
      setOrders(list);
      return list;
    } catch (err) {
      setError(err.response?.data?.error ?? err.response?.data?.message ?? 'Failed to fetch orders.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getById(id);
      setOrder(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error ?? err.response?.data?.message ?? 'Failed to fetch order.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const placeOrder = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.place(payload);
      return data;
    } catch (err) {
      setError(err.response?.data?.error ?? err.response?.data?.message ?? 'Failed to place order.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { orders, order, loading, error, fetchOrders, fetchOrderById, placeOrder };
}
