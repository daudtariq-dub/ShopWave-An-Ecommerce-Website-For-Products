const colorMap = {
  green:  'bg-green-100 text-green-700 border-green-200',
  amber:  'bg-amber-100 text-amber-700 border-amber-200',
  red:    'bg-red-100 text-red-700 border-red-200',
  blue:   'bg-blue-100 text-blue-700 border-blue-200',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  gray:   'bg-gray-100 text-gray-600 border-gray-200',
};

const dotColorMap = {
  green: 'bg-green-500', amber: 'bg-amber-500', red: 'bg-red-500',
  blue: 'bg-blue-500', indigo: 'bg-indigo-500', gray: 'bg-gray-400',
};

export default function Badge({ label, color = 'gray', dot = false, size = 'sm' }) {
  const sizeClass = size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        colorMap[color] ?? colorMap.gray,
        sizeClass,
      ].join(' ')}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColorMap[color] ?? dotColorMap.gray}`}
        />
      )}
      {label}
    </span>
  );
}
