import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import { superAdminApi } from '../../api/stores.api';

const ROLE_BADGE = {
  super_admin: 'bg-violet-100 text-violet-700 ring-1 ring-violet-200',
  admin:       'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200',
  user:        'bg-gray-100 text-gray-600',
};

const ROLE_LABEL = {
  super_admin: 'Super Admin',
  admin:       'Admin',
  user:        'User',
};

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    superAdminApi.getUsers()
      .then((d) => setUsers(d.users ?? []))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} platform users</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          />
        </div>
      </div>

      {loading && <Loader text="Loading users..." />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => {
                  const roleKey = (user.role ?? '').toLowerCase();
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs rounded-full font-semibold ${ROLE_BADGE[roleKey] ?? 'bg-gray-100 text-gray-600'}`}>
                          {ROLE_LABEL[roleKey] ?? roleKey}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{user.store?.name ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-700">{user._count?.orders ?? 0}</td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/super-admin/users/${user.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No users found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
