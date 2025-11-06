'use client';

import { useState } from 'react';
import { CldUploadWidget, CldImage, type CloudinaryUploadWidgetInfo } from 'next-cloudinary';

export default function UploadForm({
  onUpload,
}: {
  onUpload: (urls: string[]) => void;
}) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-3">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          multiple: true, // ✅ allow multiple files
          maxFiles: 10,   // optional limit
          resourceType: 'image',
        }}
        onSuccess={(result) => {
          const info = result?.info as CloudinaryUploadWidgetInfo;
          if (info?.secure_url) {
            const newUrls = [...uploadedUrls, info.secure_url];
            setUploadedUrls(newUrls);
            onUpload(newUrls); // send all URLs
          }
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
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
        )}
      </CldUploadWidget>

      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {uploadedUrls.map((url, index) => (
            <div key={index} className="relative">
              <CldImage
                alt={`Uploaded image ${index + 1}`}
                src={url}
                width="300"
                height="300"
                className="rounded shadow-md"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
