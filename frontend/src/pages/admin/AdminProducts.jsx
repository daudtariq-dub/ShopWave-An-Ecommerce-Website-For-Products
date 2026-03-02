import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { productsApi } from '../../api/products.api';
import StockBadge from '../../components/product/StockBadge';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/extended/Modal';
import Pagination from '../../components/ui/extended/Pagination';
import { formatPrice } from '../../utils/helpers';
import { toast } from 'react-toastify';

export default function AdminProducts() {
  const { products, loading, error, total, fetchProducts } = useProducts();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const pageSize = 20;

  useEffect(() => {
    fetchProducts({ page, limit: pageSize, search });
  }, [page, search]); // eslint-disable-line

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productsApi.delete(deleteTarget.id);
      toast.success(`"${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
      fetchProducts({ page, limit: pageSize });
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total products</p>
        </div>
        <Link to="/admin/products/new">
          <Button variant="primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-sm">
        <Input
          name="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
      </div>

      {loading && <Loader text="Loading products..." />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && (
        <div className="bg-white rounded-2xl card-shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden">
                          {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-contain p-1" />}
                        </div>
                        <span className="font-medium text-gray-900 line-clamp-2 max-w-xs">{p.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize text-gray-600">{p.category}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{formatPrice(p.price)}</td>
                    <td className="py-3 px-4"><StockBadge stock={p.stock ?? p.stockQuantity} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                          className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination page={page} totalPages={Math.ceil(total / pageSize)} onPageChange={setPage} />

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Product">
        <div className="flex flex-col gap-5">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
