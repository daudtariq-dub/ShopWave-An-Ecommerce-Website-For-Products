import { useState, useCallback } from 'react';
import { productsApi } from '../api/products.api';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Uploads a File object directly to S3 via a backend-provided presigned URL.
   * Returns the final public S3 URL of the uploaded file.
   */
  const uploadImage = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // 1. Get presigned URL from backend
      const { uploadUrl, publicUrl } = await productsApi.getUploadUrl(
        file.name,
        file.type
      );

      // 2. PUT directly to S3 using fetch (avoids axios interceptors adding Authorization)
      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!res.ok) throw new Error(`S3 upload failed: ${res.status}`);
      setProgress(100);

      return publicUrl;
    } catch (err) {
      const msg = err.message ?? 'Image upload failed.';
      setError(msg);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadMultiple = useCallback(async (files) => {
    const urls = [];
    for (const file of files) {
      const url = await uploadImage(file);
      urls.push(url);
    }
    return urls;
  }, [uploadImage]);

  return { uploading, progress, error, uploadImage, uploadMultiple };
}
