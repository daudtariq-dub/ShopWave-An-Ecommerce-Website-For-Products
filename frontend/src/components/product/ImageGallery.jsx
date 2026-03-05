import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const PLACEHOLDER = 'https://placehold.co/600x500/f3f4f6/9ca3af?text=Product';

export default function ImageGallery({ images = [], alt = 'Product' }) {
  const allImages = images.length ? images : [PLACEHOLDER];
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setSelected((s) => (s > 0 ? s - 1 : allImages.length - 1));
  const next = () => setSelected((s) => (s < allImages.length - 1 ? s + 1 : 0));

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group">
        <img
          src={allImages[selected]}
          alt={alt}
          className="w-full h-full object-contain p-4 cursor-zoom-in"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          onClick={() => setLightbox(true)}
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={[
                'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors',
                i === selected ? 'border-indigo-500' : 'border-transparent hover:border-gray-300',
              ].join(' ')}
            >
              <img
                src={img}
                alt={`${alt} ${i + 1}`}
                className="w-full h-full object-contain bg-gray-50 p-1"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <img
            src={allImages[selected]}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
            onClick={() => setLightbox(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
