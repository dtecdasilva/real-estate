'use client';

import { useState } from 'react';
import {
  CldUploadWidget,
  CldImage,
  type CloudinaryUploadWidgetResults,
} from 'next-cloudinary';

interface UploadInfo {
  secure_url?: string;
  uploadInfo?: {
    secure_url?: string;
  };
}

export default function UploadForm({
  onUpload,
}: {
  onUpload: (urls: string[]) => void;
}) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (!result?.info) return;

    const info = result.info as UploadInfo;
    const url = info.secure_url ?? info.uploadInfo?.secure_url;

    if (url) {
      // Just update the local list; don't call onUpload yet
      setUploadedUrls((prev) => [...prev, url]);
    }
  };

  const handleAllUploadsComplete = () => {
    setUploading(false);
    // Call onUpload only once, with the final list
    onUpload(uploadedUrls);
  };

  return (
    <div className="space-y-3">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          multiple: true,
          maxFiles: 10,
          resourceType: 'image',
        }}
        onUploadAdded={() => setUploading(true)}
        onSuccess={handleSuccess}
        onQueuesEnd={handleAllUploadsComplete}
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
            <CldImage
              key={index}
              alt={`Uploaded image ${index + 1}`}
              src={url}
              width="200"
              height="200"
              className="rounded shadow-md object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
