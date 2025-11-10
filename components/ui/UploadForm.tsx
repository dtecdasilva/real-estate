'use client';

import { useState } from 'react';
import {
  CldUploadWidget,
  CldImage,
  type CloudinaryUploadWidgetResults,
} from 'next-cloudinary';

export default function UploadForm({
  onUpload,
}: {
  onUpload: (urls: string[]) => void;
}) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (!result?.info) return;

    // Define a safe, minimal type for the upload info
    interface UploadInfo {
      secure_url?: string;
      uploadInfo?: {
        secure_url?: string;
      };
    }

    // Use the defined type instead of `any`
    const info = result.info as UploadInfo;
    const url = info.secure_url ?? info.uploadInfo?.secure_url;

    if (url) {
      const updatedUrls = [...uploadedUrls, url];
      setUploadedUrls(updatedUrls);
      onUpload(updatedUrls);
    }
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
        onQueuesEnd={() => setUploading(false)}
        onSuccess={handleSuccess}
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
