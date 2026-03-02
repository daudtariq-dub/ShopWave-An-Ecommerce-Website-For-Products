export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 0}
        className="px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={[
              'w-9 h-9 text-sm font-medium rounded-xl transition-colors',
              p === page
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100',
            ].join(' ')}
          >
            {p + 1}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </nav>
  );
}

function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  if (current <= 3) return [0, 1, 2, 3, '...', total - 1];
  if (current >= total - 4) return [0, '...', total - 4, total - 3, total - 2, total - 1];
  return [0, '...', current - 1, current, current + 1, '...', total - 1];
}
