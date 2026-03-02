import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import axiosInstance from '../../api/axios';

const STAT_ICONS = {
  products: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  orders: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  revenue: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const STAT_COLORS = {
  products: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  orders: { bg: 'bg-green-50', text: 'text-green-600' },
  users: { bg: 'bg-blue-50', text: 'text-blue-600' },
  revenue: { bg: 'bg-amber-50', text: 'text-amber-600' },
};

function StatCard({ label, value, type, change }) {
  const colors = STAT_COLORS[type] ?? STAT_COLORS.products;
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {STAT_ICONS[type]}
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1">
          <span className={`text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      )}
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const [productsRes] = await Promise.allSettled([
          axiosInstance.get('/products'),
        ]);

        if (cancelled) return;

        const productsCount =
          productsRes.status === 'fulfilled'
            ? (productsRes.value.data?.products ?? productsRes.value.data)?.length ?? 0
            : 0;

        setStats({
          products: productsCount,
          orders: 0,
          users: 0,
          revenue: '$0.00',
        });
      } catch {
        if (!cancelled) setError('Failed to load dashboard stats.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Products" value={stats?.products ?? 0} type="products" change={12} />
        <StatCard label="Total Orders" value={stats?.orders ?? 0} type="orders" change={8} />
        <StatCard label="Total Users" value={stats?.users ?? 0} type="users" change={-3} />
        <StatCard label="Revenue" value={stats?.revenue ?? '$0'} type="revenue" change={24} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No recent orders</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No product data yet</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
