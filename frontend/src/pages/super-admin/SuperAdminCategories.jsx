import { useEffect, useState } from 'react';
import { Plus, Trash2, Tag, Package } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import { superAdminApi } from '../../api/stores.api';
import { toast } from 'react-toastify';

const TAG_COLORS = [
  'from-blue-400 to-blue-600',
  'from-pink-400 to-rose-600',
  'from-amber-400 to-orange-500',
  'from-green-400 to-emerald-600',
  'from-violet-400 to-violet-600',
  'from-indigo-400 to-indigo-600',
  'from-cyan-400 to-cyan-600',
  'from-red-400 to-red-600',
];

export default function SuperAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const load = () => {
    superAdminApi.getCategories()
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => toast.error('Failed to load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await superAdminApi.createCategory(newName.trim());
      setNewName('');
      toast.success('Category created.');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error ?? 'Failed to create category.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await superAdminApi.deleteCategory(id);
      toast.success('Category deleted.');
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast.error('Failed to delete category.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">Manage product categories across all stores</p>
      </div>

      {/* Add category */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-violet-500" /> Add Category
        </h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            placeholder="Category name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {creating
              ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              : <Plus className="w-4 h-4" />
            }
            Add
          </button>
        </form>
      </div>

      {loading && <Loader text="Loading categories..." />}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group"
            >
              {/* Coloured top strip */}
              <div className={`h-1.5 bg-gradient-to-r ${TAG_COLORS[i % TAG_COLORS.length]}`} />
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TAG_COLORS[i % TAG_COLORS.length]} flex items-center justify-center flex-shrink-0`}>
                    <Tag className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 capitalize truncate">{cat.name}</p>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                      <Package className="w-3 h-3" />
                      <span>{cat._count?.products ?? 0} products</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Tag className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">No categories yet. Add one above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
