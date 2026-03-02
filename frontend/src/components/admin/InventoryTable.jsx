import { useState } from 'react';
import StockBadge from '../product/StockBadge';
import { useInventory } from '../../hooks/useInventory';
import { toast } from 'react-toastify';

export default function InventoryTable({ inventory }) {
  const { updateStock, saving } = useInventory();
  const [editing, setEditing] = useState({});

  const handleChange = (id, val) => {
    const num = Number(val);
    if (!isNaN(num) && num >= 0) {
      setEditing((prev) => ({ ...prev, [id]: num }));
    }
  };

  const handleSave = async (id) => {
    if (editing[id] === undefined) return;
    try {
      await updateStock(id, editing[id]);
      setEditing((prev) => { const n = { ...prev }; delete n[id]; return n; });
      toast.success('Stock updated');
    } catch {
      toast.error('Failed to update stock');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">SKU</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">In Stock</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Adjust</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => {
            const id = item.productId ?? item.id;
            const currentQty = editing[id] ?? item.stock ?? 0;
            const isDirty = editing[id] !== undefined;

            return (
              <tr key={id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt="" className="w-10 h-10 object-contain bg-gray-50 rounded-lg" />
                    )}
                    <span className="font-medium text-gray-900">{item.title ?? item.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500 font-mono text-xs">{item.sku ?? '—'}</td>
                <td className="py-3 px-4">
                  <StockBadge stock={item.stock} />
                </td>
                <td className="py-3 px-4 font-semibold text-gray-900">{item.stock ?? 0}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleChange(id, currentQty - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                      >−</button>
                      <input
                        type="number"
                        min="0"
                        value={currentQty}
                        onChange={(e) => handleChange(id, e.target.value)}
                        className="w-14 text-center text-sm font-medium text-gray-900 border-0 focus:outline-none py-1.5"
                      />
                      <button
                        onClick={() => handleChange(id, currentQty + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                      >+</button>
                    </div>
                    {isDirty && (
                      <button
                        onClick={() => handleSave(id)}
                        disabled={saving}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
