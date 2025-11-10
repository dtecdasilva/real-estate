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

    // Cast to any because Cloudinary's typing doesn't include `files`
    const info = result.info as any;

    let urls: string[] = [];

    if (Array.isArray(info)) {
      // When multiple files are uploaded
      urls = info.map((file: any) => file?.secure_url).filter(Boolean);
    } else if (info.files) {
      // When multiple uploads come under one info object
      urls = info.files
        .map((f: any) => f.uploadInfo?.secure_url)
        .filter(Boolean);
    } else if (info.secure_url) {
      // Single upload fallback
      urls = [info.secure_url];
    }

    const updatedUrls = [...uploadedUrls, ...urls];
    setUploadedUrls(updatedUrls);
    onUpload(updatedUrls);
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
        onUpload={() => setUploading(false)}
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
