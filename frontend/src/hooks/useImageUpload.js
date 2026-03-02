import { useState, useCallback } from 'react';
import { productsApi } from '../api/products.api';
import axiosInstance from '../api/axios';

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

      // 2. PUT directly to S3 (no auth header — presigned URL handles it)
      await axiosInstance.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
          // Remove auth header for S3 requests
          Authorization: undefined,
        },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
        // Use raw axios for S3 to bypass our interceptors
        transformRequest: [(data) => data],
      });

      setProgress(100);
      return publicUrl;
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Image upload failed.';
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
