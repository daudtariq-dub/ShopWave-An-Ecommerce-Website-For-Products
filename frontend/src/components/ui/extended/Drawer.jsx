import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Drawer({ open, onClose, title, children, side = 'right', width = 'w-96' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const slideClass = side === 'left'
    ? 'left-0 translate-x-0'
    : 'right-0 translate-x-0';

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-gray-900 bg-opacity-50"
        onClick={onClose}
      />
      <div
        className={[
          'absolute top-0 bottom-0 bg-white shadow-2xl flex flex-col',
          width, slideClass,
        ].join(' ')}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}
