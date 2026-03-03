export default function Select({ label, name, value, onChange, options = [], placeholder, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="select-with-chevron w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-white text-gray-900
          focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
