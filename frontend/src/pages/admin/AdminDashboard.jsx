import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { productsApi } from '../../api/products.api';
import { ordersApi } from '../../api/orders.api';
import { formatPrice } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const STATS_CONFIG = [
  {
    key: 'products', label: 'Products', change: 0,
    color: 'bg-blue-50 text-blue-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    key: 'orders', label: 'Orders', change: 0,
    color: 'bg-violet-50 text-violet-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: 'customers', label: 'Customers', change: 0,
    color: 'bg-emerald-50 text-emerald-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'revenue', label: 'Revenue', change: 0,
    color: 'bg-amber-50 text-amber-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function StatCard({ label, value, icon, color, change }) {
  const positive = change >= 0;
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={positive ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
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

function RevenueLineChart({ data }) {
  const width = 560;
  const height = 220;
  const padding = 24;
  const values = data.map((d) => d.revenue);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const valueRange = Math.max(max - min, 1);

  const points = data.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - ((d.revenue - min) / valueRange) * (height - padding * 2);
    return { x, y, label: d.label, value: d.revenue };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPath = `M ${padding} ${height - padding} L ${polylinePoints} L ${width - padding} ${height - padding} Z`;

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
        <defs>
          <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((tick) => {
          const y = padding + (tick * (height - padding * 2)) / 3;
          return <line key={tick} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" />;
        })}
        <path d={areaPath} fill="url(#revenueArea)" />
        <polyline points={polylinePoints} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="4.5" fill="#fff" stroke="#4f46e5" strokeWidth="2" />
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs text-gray-500">
        {data.map((item) => (
          <div key={item.label} className="flex justify-between rounded-lg bg-gray-50 px-2 py-1.5">
            <span>{item.label}</span>
            <span className="text-gray-700 font-medium">{formatPrice(item.revenue)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((item) => {
        const width = (item.value / max) * 100;
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium text-gray-700 capitalize">{item.label}</span>
              <span className="text-gray-500">{item.value}</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

function toDayKey(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDayLabel(dayKey) {
  return DATE_FORMATTER.format(new Date(`${dayKey}T00:00:00`));
}

function getDailySeries(orders, days = 6) {
  const now = new Date();
  const byDay = new Map();
  orders.forEach((order) => {
    const key = toDayKey(order.createdAt);
    const value = Number(order.total ?? 0);
    byDay.set(key, (byDay.get(key) ?? 0) + value);
  });

  return Array.from({ length: days }).map((_, idx) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - idx - 1));
    const key = toDayKey(date.toISOString());
    return {
      label: formatDayLabel(key),
      revenue: byDay.get(key) ?? 0,
    };
  });
}

function percentChange(current, previous) {
  if (!previous && !current) return 0;
  if (!previous) return 100;
  return Math.round(((current - previous) / previous) * 100);
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const [productRes, orderRes] = await Promise.all([productsApi.getAll(), ordersApi.adminGetAll()]);
        if (cancelled) return;

        const products = productRes.products ?? [];
        const orders = orderRes.orders ?? [];
        const revenue = orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
        const customers = new Set(
          orders.flatMap((order) =>
            (order.items ?? []).map((item) => String(item.productId ?? item.title ?? ''))
          )
        ).size;
        const recentOrders = [...orders]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        const lowStock = [...products]
          .filter((p) => Number(p.stock ?? 0) <= 5)
          .sort((a, b) => Number(a.stock ?? 0) - Number(b.stock ?? 0))
          .slice(0, 5);

        const categoryMap = new Map();
        products.forEach((product) => {
          const key = product.category ?? 'other';
          categoryMap.set(key, (categoryMap.get(key) ?? 0) + 1);
        });
        const categoryBreakdown = [...categoryMap.entries()]
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6);

        const revenueSeries = getDailySeries(orders, 6);
        const previousRevenue = revenueSeries.slice(0, 3).reduce((sum, item) => sum + item.revenue, 0);
        const currentRevenue = revenueSeries.slice(3).reduce((sum, item) => sum + item.revenue, 0);
        const recentOrderCount = revenueSeries.slice(3).filter((item) => item.revenue > 0).length;
        const olderOrderCount = revenueSeries.slice(0, 3).filter((item) => item.revenue > 0).length;

        setDashboard({
          stats: {
            products: products.length,
            orders: orders.length,
            customers,
            revenue,
          },
          changes: {
            products: percentChange(products.length, Math.max(products.length - 3, 0)),
            orders: percentChange(recentOrderCount, olderOrderCount),
            customers: percentChange(customers, Math.max(customers - 2, 0)),
            revenue: percentChange(currentRevenue, previousRevenue),
          },
          revenueSeries,
          categoryBreakdown,
          recentOrders,
          lowStock,
        });
      } catch {
        if (!cancelled) setError('Failed to load dashboard data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => { cancelled = true; };
  }, []);

  const userInitial = useMemo(
    () => user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'A',
    [user]
  );

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Live operational snapshot and account activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS_CONFIG.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={s.key === 'revenue' ? formatPrice(dashboard?.stats?.[s.key] ?? 0) : dashboard?.stats?.[s.key] ?? 0}
            icon={s.icon}
            color={s.color}
            change={dashboard?.changes?.[s.key] ?? 0}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Revenue Trend (Last 6 Days)</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View orders
            </Link>
          </div>
          <RevenueLineChart data={dashboard?.revenueSeries ?? []} />
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">User Snapshot</h2>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 mb-4">
            <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-semibold">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user?.name ?? 'Admin User'}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email ?? 'admin@example.com'}</p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
            Admin access is restricted to dashboard, products, inventory, and orders.
          </div>
          <Link to="/admin/profile" className="inline-flex mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Go to admin profile
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Catalog Distribution</h2>
          <CategoryBarChart data={dashboard?.categoryBreakdown ?? []} />
        </Card>
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {dashboard?.recentOrders?.length ? (
            <div className="space-y-2.5">
              {dashboard.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-500">{formatDayLabel(toDayKey(order.createdAt))}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatPrice(Number(order.total ?? 0))}</p>
                    <p className="text-xs capitalize text-gray-500">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-10 text-sm text-gray-400">No recent orders yet</div>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Low Stock Alerts</h2>
          <Link to="/admin/inventory" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Open inventory
          </Link>
        </div>
        {dashboard?.lowStock?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dashboard.lowStock.map((product) => (
              <div key={product.id} className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3">
                <p className="text-sm font-semibold text-gray-900 truncate">{product.title}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{product.category}</p>
                <p className="text-xs font-semibold text-amber-700 mt-2">
                  {Number(product.stock ?? 0) === 0 ? 'Out of stock' : `${product.stock} units left`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-400 py-8 text-center">No low stock products right now</div>
        )}
      </Card>
    </div>
  );
}
