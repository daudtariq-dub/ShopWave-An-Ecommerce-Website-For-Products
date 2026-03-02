import { useState } from 'react';
import Badge from '../ui/extended/Badge';
import { formatPrice } from '../../utils/helpers';
import { ORDER_STATUS_LABELS, ORDER_STATUS } from '../../utils/constants';
import { ordersApi } from '../../api/orders.api';
import { toast } from 'react-toastify';

export default function OrdersTable({ orders, onOrderUpdate }) {
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await ordersApi.adminUpdateStatus(orderId, newStatus);
      onOrderUpdate?.(orderId, newStatus);
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const statusMeta = ORDER_STATUS_LABELS[order.status] ?? ORDER_STATUS_LABELS.pending;
            return (
              <>
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">#{order.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer?.name ?? '—'}</p>
                      <p className="text-xs text-gray-400">{order.customer?.email ?? ''}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{order.items?.length ?? 0}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{formatPrice(order.total)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
                    >
                      {Object.values(ORDER_STATUS).map((s) => (
                        <option key={s} value={s}>{ORDER_STATUS_LABELS[s]?.label ?? s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {expandedId === order.id ? 'Hide' : 'Details'}
                    </button>
                  </td>
                </tr>
                {expandedId === order.id && order.items?.length > 0 && (
                  <tr key={`${order.id}-expanded`} className="bg-gray-50">
                    <td colSpan={7} className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="font-medium text-gray-900">{item.title ?? item.name}</span>
                            <span>×{item.quantity}</span>
                            <span className="ml-auto font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
