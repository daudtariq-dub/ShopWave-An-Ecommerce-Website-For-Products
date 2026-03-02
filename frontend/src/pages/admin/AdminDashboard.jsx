import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import axiosInstance from '../../api/axios';
import { formatPrice } from '../../utils/helpers';

const STATS_CONFIG = [
  {
    key: 'products', label: 'Total Products', change: 12,
    color: 'bg-blue-50 text-blue-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    key: 'orders', label: 'Total Orders', change: 8,
    color: 'bg-violet-50 text-violet-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: 'users', label: 'Total Users', change: 5,
    color: 'bg-emerald-50 text-emerald-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'revenue', label: 'Revenue', change: 24,
    color: 'bg-amber-50 text-amber-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function StatCard({ label, value, icon, color, change }) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={change >= 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
          </svg>
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.allSettled([
          axiosInstance.get('/admin/stats').catch(() => null),
          axiosInstance.get('/products'),
        ]);

        if (cancelled) return;

        const productsCount = productsRes.status === 'fulfilled'
          ? (productsRes.value?.data?.total ?? (productsRes.value?.data?.products ?? productsRes.value?.data)?.length ?? 0)
          : 0;

        setStats({
          products: productsCount,
          orders: 0,
          users: 0,
          revenue: formatPrice(0),
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS_CONFIG.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={stats?.[s.key] ?? 0}
            icon={s.icon}
            color={s.color}
            change={s.change}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="flex items-center justify-center py-8 text-sm text-gray-400">No recent orders</div>
        </Card>
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
          <div className="flex items-center justify-center py-8 text-sm text-gray-400">All products stocked</div>
        </Card>
      </div>
    </div>
  );
}
