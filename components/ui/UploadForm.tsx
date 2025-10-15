'use client';

import { useState } from 'react';

export default function UploadForm({ onUpload }: { onUpload: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const uploadImage = async () => {
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.set('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Upload failed');

      // Simulate progress bar (since fetch doesn't provide real-time progress)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      const result = await res.json();

      if (result.success) {
        setUploadedUrl(result.path);
        onUpload(result.path);
      } else {
        alert('Upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadedUrl('');
    setProgress(0);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full border p-2 rounded cursor-pointer"
      />

      {!uploading && !uploadedUrl && file && (
        <button
          type="button"
          onClick={uploadImage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer"
        >
          Upload Image
        </button>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
          <div
            className="bg-blue-600 h-4"
            style={{ width: `${progress}%`, transition: 'width 0.2s' }}
          />
        </div>
      )}

      {uploadedUrl && (
        <div className="flex items-center justify-between mt-1">
          <span className="text-green-600">Uploaded successfully!</span>
          <button
            type="button"
            onClick={resetUpload}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
