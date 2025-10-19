'use client';

import { useState } from 'react';
import { CldUploadWidget, CldImage, type CloudinaryUploadWidgetInfo } from 'next-cloudinary';

export default function UploadForm({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-3">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result) => {
          const info = result?.info as CloudinaryUploadWidgetInfo;
          if (info?.secure_url) {
            setUploadedUrl(info.secure_url);
            onUpload(info.secure_url);
          }
          setUploading(false);
        }}
        onQueuesStart={() => setUploading(true)}
        onQueuesEnd={() => setUploading(false)}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        )}
      </CldUploadWidget>

      {uploadedUrl && (
        <div className="mt-4 space-y-2">
          <CldImage
            alt="Uploaded image"
            src={uploadedUrl}
            width="300"
            height="300"
            className="rounded shadow-md"
          />
          <button
            type="button"
            onClick={() => setUploadedUrl('')}
            className="text-blue-600 hover:underline"
          >
            Replace Image
          </button>
        </div>
      )}
    </div>
  );
}
