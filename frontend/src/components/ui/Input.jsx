export default function Input({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled = false,
  hint,
  className = '',
  inputClassName = '',
}) {
  const hasError = touched && error;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={[
          'w-full px-4 py-2.5 text-sm rounded-xl border-2 bg-white transition-all duration-150',
          'focus:outline-none placeholder:text-gray-400',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
          hasError
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-red-900'
            : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-gray-900',
          inputClassName,
        ].filter(Boolean).join(' ')}
      />
      {hint && !hasError && <p className="text-xs text-gray-400">{hint}</p>}
      {hasError && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
