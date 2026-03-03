import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import { usersApi } from '../../api/users.api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadUsers() {
      try {
        setLoading(true);
        setError(null);
        const data = await usersApi.adminGetAll();
        if (!cancelled) setUsers(data.users ?? []);
      } catch {
        if (!cancelled) setError('Failed to load users.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadUsers();
    return () => { cancelled = true; };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      user.name?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query)
    );
  }, [users, search]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">View customer and account details</p>
      </div>

      <div className="max-w-sm">
        <Input
          name="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <Loader text="Loading users..." />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <Card padding={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">User</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Orders</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-3.5 capitalize text-gray-700">{user.role}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{user.totalOrders ?? 0}</td>
                    <td className="px-5 py-3.5">
                      <Link to={`/admin/users/${user.id}`} className="text-indigo-600 hover:text-indigo-700 font-medium">
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-400">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

