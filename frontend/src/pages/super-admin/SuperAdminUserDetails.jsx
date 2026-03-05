import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { superAdminApi, storesApi } from '../../api/stores.api';
import { formatPrice } from '../../utils/helpers';
import { toast } from 'react-toastify';

const STATUS_COLORS = {
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default function SuperAdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState('');
  const [storeId, setStoreId] = useState('');

  useEffect(() => {
    Promise.all([
      superAdminApi.getUserById(id),
      storesApi.getAll(),
    ]).then(([userData, storeData]) => {
      setUser(userData.user);
      setRole((userData.user.role ?? '').toLowerCase());
      setStoreId(userData.user.storeId ?? '');
      setStores(storeData.stores ?? []);
    }).catch(() => toast.error('Failed to load user.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await superAdminApi.updateUserRole(id, role.toUpperCase(), storeId || null);
      toast.success('User role updated.');
      navigate('/super-admin/users');
    } catch {
      toast.error('Failed to update role.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading user..." />;
  if (!user) return <p className="text-red-500">User not found.</p>;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => navigate('/super-admin/users')}>← Back</Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Role management */}
      <Card>
        <h2 className="font-semibold text-gray-900 mb-4">Role & Store Assignment</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {role === 'admin' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Assign to Store</label>
              <select
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">— No store —</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-1">
            <Button variant="primary" loading={saving} onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </Card>

      {/* Order history */}
      <Card>
        <h2 className="font-semibold text-gray-900 mb-4">Recent Orders</h2>
        {user.orders?.length === 0 ? (
          <p className="text-sm text-gray-400">No orders yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {user.orders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${STATUS_COLORS[order.status?.toLowerCase()] ?? 'bg-gray-100 text-gray-600'}`}>
                    {order.status?.toLowerCase()}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
