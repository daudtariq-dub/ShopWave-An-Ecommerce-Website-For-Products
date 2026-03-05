import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Store, Users, Package, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { storesApi } from '../../api/stores.api';
import { toast } from 'react-toastify';

export default function SuperAdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    storesApi.getAll()
      .then((d) => setStores(d.stores ?? []))
      .catch(() => toast.error('Failed to load stores.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete store "${name}"? This cannot be undone.`)) return;
    try {
      await storesApi.delete(id);
      toast.success('Store deleted.');
      load();
    } catch {
      toast.error('Failed to delete store.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
          <p className="text-sm text-gray-500 mt-1">{stores.length} tenant store{stores.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          to="/super-admin/stores/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 active:bg-violet-800 transition-colors shadow-sm shadow-violet-600/20"
        >
          <Plus className="w-4 h-4" /> New Store
        </Link>
      </div>

      {loading && <Loader text="Loading stores..." />}

      {!loading && stores.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center">
            <Store className="w-8 h-8 text-violet-400" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700">No stores yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first tenant store to get started</p>
          </div>
          <Link to="/super-admin/stores/new" className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
            <Plus className="w-4 h-4" /> Create Store
          </Link>
        </div>
      )}

      {!loading && stores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200"
            >
              {/* Store header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{store.name}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${store.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {store.isActive
                        ? <><CheckCircle className="w-3 h-3" /> Active</>
                        : <><XCircle className="w-3 h-3" /> Inactive</>
                      }
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    to={`/super-admin/stores/${store.id}/edit`}
                    className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(store.id, store.name)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              {store.description && (
                <p className="text-sm text-gray-500 line-clamp-2">{store.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span><span className="font-semibold text-gray-700">{store._count?.users ?? 0}</span> users</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span><span className="font-semibold text-gray-700">{store._count?.products ?? 0}</span> products</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
