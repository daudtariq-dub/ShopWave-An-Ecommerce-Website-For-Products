import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Users, ShoppingCart, DollarSign, ArrowRight, TrendingUp } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import { superAdminApi } from '../../api/stores.api';
import { formatPrice } from '../../utils/helpers';

const STAT_CARDS = [
  {
    key: 'totalStores',
    label: 'Total Stores',
    icon: Store,
    gradient: 'from-violet-500 to-violet-700',
    shadow: 'shadow-violet-500/25',
    link: '/super-admin/stores',
  },
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: Users,
    gradient: 'from-blue-500 to-blue-700',
    shadow: 'shadow-blue-500/25',
    link: '/super-admin/users',
  },
  {
    key: 'totalOrders',
    label: 'Total Orders',
    icon: ShoppingCart,
    gradient: 'from-amber-500 to-orange-600',
    shadow: 'shadow-amber-500/25',
    link: null,
  },
  {
    key: 'totalRevenue',
    label: 'Platform Revenue',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-green-600',
    shadow: 'shadow-emerald-500/25',
    link: null,
    format: true,
  },
];

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    superAdminApi.getDashboard()
      .then((d) => setStats(d.stats))
      .catch(() => setError('Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-500" />
          <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        </div>
        <p className="text-sm text-gray-500">Real-time snapshot across all tenants</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const raw = stats?.[card.key] ?? 0;
          const value = card.format ? formatPrice(raw) : raw.toLocaleString();
          return (
            <div
              key={card.key}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-lg ${card.shadow}`}
            >
              {/* Background circle decoration */}
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -right-1 -bottom-6 w-16 h-16 rounded-full bg-white/10" />

              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                <p className="text-sm text-white/70 mt-1 font-medium">{card.label}</p>
                {card.link && (
                  <Link to={card.link} className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-white/80 hover:text-white transition-colors">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: '/super-admin/stores', label: 'Manage Stores', sub: 'Create, edit and control tenant stores', icon: Store, color: 'text-violet-600 bg-violet-50 border-violet-100' },
          { to: '/super-admin/users', label: 'Manage Users', sub: 'View all users, assign roles and stores', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { to: '/super-admin/categories', label: 'Categories', sub: 'Control global product categories', icon: ShoppingCart, color: 'text-amber-600 bg-amber-50 border-amber-100' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 group-hover:text-gray-800">{item.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{item.sub}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-0.5 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
