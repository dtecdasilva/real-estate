'use client';

import { useState } from 'react';
import {
  CldUploadWidget,
  CldImage,
  type CloudinaryUploadWidgetResults,
} from 'next-cloudinary';

// Define a custom interface for the upload info
interface CloudinaryFileInfo {
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

    const info = result.info as
      | CloudinaryFileInfo
      | { files?: CloudinaryFileInfo[] }
      | CloudinaryFileInfo[];

    let urls: string[] = [];

    if (Array.isArray(info)) {
      // Case 1: info is an array of file info
      urls = info.map((file) => file.secure_url).filter(Boolean) as string[];
    } else if ('file' in info && Array.isArray(info.file)) {
      // Case 2: info.files exists
      urls = info.file
        .map((f) => f.uploadInfo?.secure_url)
        .filter(Boolean) as string[];
    } else if ('secure_url' in info && info.secure_url) {
      // Case 3: single upload
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
