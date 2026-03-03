import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { usersApi } from '../../api/users.api';
import { formatPrice } from '../../utils/helpers';

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

function formatDate(value) {
  if (!value) return 'N/A';
  return DATE_FORMATTER.format(new Date(value));
}

export default function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadUser() {
      try {
        setLoading(true);
        setError(null);
        const data = await usersApi.adminGetById(id);
        if (!cancelled) setUser(data);
      } catch {
        if (!cancelled) setError('User not found.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadUser();
    return () => { cancelled = true; };
  }, [id]);

  const userInitial = useMemo(
    () => user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U',
    [user]
  );

  if (loading) return <Loader text="Loading user details..." />;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
        </div>
        <Link to="/admin/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Back to users
        </Link>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-xl">
            {userInitial}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
          <span className={`ml-auto px-2.5 py-1 text-xs rounded-full font-medium ${user?.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {user?.status}
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="py-4">
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{user?.totalOrders ?? 0}</p>
        </Card>
        <Card className="py-4">
          <p className="text-xs text-gray-500">Total Spent</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{formatPrice(user?.totalSpent ?? 0)}</p>
        </Card>
        <Card className="py-4">
          <p className="text-xs text-gray-500">Joined</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(user?.joinedAt)}</p>
        </Card>
        <Card className="py-4">
          <p className="text-xs text-gray-500">Last Active</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(user?.lastActiveAt)}</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-900 mb-4">Contact Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-900 mt-1">{user?.email}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-gray-500">Phone</p>
            <p className="font-medium text-gray-900 mt-1">{user?.phone ?? 'N/A'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

