import { useRef, useState } from 'react';
import { useImageUpload } from '../../../hooks/useImageUpload';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

export default function ImageUpload({ images = [], onChange }) {
  const { uploading, progress, error, uploadMultiple } = useImageUpload();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    const urls = await uploadMultiple(Array.from(files));
    onChange([...images, ...urls]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={[
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          dragOver
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50',
        ].join(' ')}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-indigo-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">Uploading… {progress}%</p>
          </div>
        ) : (
          <>
            <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-600 font-medium">Drop images here or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP supported</p>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Preview strip */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
