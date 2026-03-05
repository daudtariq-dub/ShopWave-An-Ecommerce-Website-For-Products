import { useEffect, useState } from 'react';
import { Package, ClipboardList, Users, CircleDollarSign } from 'lucide-react';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import axiosInstance from '../../api/axios';

const STAT_ICONS = {
  products: <Package className="w-6 h-6" />,
  orders:   <ClipboardList className="w-6 h-6" />,
  users:    <Users className="w-6 h-6" />,
  revenue:  <CircleDollarSign className="w-6 h-6" />,
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
              <ClipboardList className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No recent orders</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No product data yet</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
