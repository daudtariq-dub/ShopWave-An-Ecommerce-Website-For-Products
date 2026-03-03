import { SORT_OPTIONS } from '../../utils/constants';

export default function ProductSort({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select-with-chevron text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-700
          focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
