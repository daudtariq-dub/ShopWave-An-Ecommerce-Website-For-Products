import { useEffect, useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import Badge from '../../components/ui/extended/Badge';
import Loader from '../../components/ui/Loader';
import { formatPrice } from '../../utils/helpers';
import { ORDER_STATUS_LABELS } from '../../utils/constants';

export default function OrderHistory() {
  const { orders, loading, error, fetchOrders } = useOrders();
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {loading && <Loader text="Loading orders..." />}

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="py-16 text-center bg-white rounded-2xl card-shadow border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="font-medium text-gray-900">No orders yet</p>
          <p className="text-sm text-gray-500 mt-1">Your orders will appear here.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {orders.map((order) => {
          const statusMeta = ORDER_STATUS_LABELS[order.status] ?? ORDER_STATUS_LABELS.pending;
          return (
            <div key={order.id} className="bg-white rounded-2xl card-shadow border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">Order #{order.id}</span>
                    <Badge label={statusMeta.label} color={statusMeta.color} dot />
                  </div>
                  <span className="text-xs text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                  <button
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {expandedId === order.id ? 'Hide details' : 'View details'}
                  </button>
                </div>
              </div>

              {expandedId === order.id && order.items?.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title ?? item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
