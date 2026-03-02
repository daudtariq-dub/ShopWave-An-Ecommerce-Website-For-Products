const variants = {
  primary:   'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm hover:shadow focus:ring-indigo-500',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 shadow-sm focus:ring-gray-400',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm focus:ring-red-500',
  ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-400',
  outline:   'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus:ring-indigo-500',
  success:   'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm focus:ring-emerald-500',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
  sm: 'px-3.5 py-2 text-sm rounded-xl gap-2',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-semibold transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {loading && (
        <svg className="animate-spin -ml-0.5 h-4 w-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
