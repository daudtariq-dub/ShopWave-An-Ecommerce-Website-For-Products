import { useEffect, useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import InventoryTable from '../../components/admin/InventoryTable';
import Loader from '../../components/ui/Loader';
import Input from '../../components/ui/Input';

export default function AdminInventory() {
  const { inventory, loading, error, fetchInventory } = useInventory();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const filtered = inventory.filter((item) =>
    !search || (item.title ?? item.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = inventory.filter((i) => (i.stock ?? 0) <= 5 && (i.stock ?? 0) > 0).length;
  const outOfStockCount = inventory.filter((i) => (i.stock ?? 0) === 0).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-sm text-gray-500 mt-1">Manage stock levels for all products</p>
      </div>

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="flex gap-4 flex-wrap">
          {outOfStockCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-sm font-medium text-red-700">{outOfStockCount} out of stock</span>
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-sm font-medium text-amber-700">{lowStockCount} low stock</span>
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-sm">
        <Input name="search" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading && <Loader text="Loading inventory..." />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && (
        <div className="bg-white rounded-2xl card-shadow border border-gray-200 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">No inventory data found.</p>
          ) : (
            <InventoryTable inventory={filtered} />
          )}
        </div>
      )}
    </div>
  );
}
