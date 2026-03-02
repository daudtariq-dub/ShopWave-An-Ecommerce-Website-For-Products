import { useEffect, useState, useCallback } from 'react';
import { ordersApi } from '../../api/orders.api';
import OrdersTable from '../../components/admin/OrdersTable';
import Loader from '../../components/ui/Loader';
import Select from '../../components/ui/extended/Select';
import { ORDER_STATUS } from '../../utils/constants';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.adminGetAll(statusFilter ? { status: statusFilter } : {});
      setOrders(data.orders ?? data ?? []);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleOrderUpdate = useCallback((orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
    );
  }, []);

  const statusOptions = [
    { value: '', label: 'All statuses' },
    ...Object.values(ORDER_STATUS).map((s) => ({
      value: s,
      label: s.charAt(0).toUpperCase() + s.slice(1),
    })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} orders</p>
      </div>

      <div className="w-52">
        <Select
          name="status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
        />
      </div>

      {loading && <Loader text="Loading orders..." />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && (
        <div className="bg-white rounded-2xl card-shadow border border-gray-200 overflow-hidden">
          {orders.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">No orders found.</p>
          ) : (
            <OrdersTable orders={orders} onOrderUpdate={handleOrderUpdate} />
          )}
        </div>
      )}
    </div>
  );
}
