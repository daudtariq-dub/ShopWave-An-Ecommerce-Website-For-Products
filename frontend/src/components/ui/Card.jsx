export default function Card({ children, className = '', padding = true, hover = false, as: Tag = 'div' }) {
  return (
    <Tag
      className={[
        'bg-white rounded-2xl border border-gray-200 card-shadow',
        padding ? 'p-6' : '',
        hover ? 'hover:card-shadow-hover transition-all duration-200 cursor-pointer' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </Tag>
  );
}
