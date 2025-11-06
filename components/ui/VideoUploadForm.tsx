'use client';

import { useState } from 'react';
import {
  CldUploadWidget,
  CldVideoPlayer,
  type CloudinaryUploadWidgetInfo,
} from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

export default function VideoUploadForm({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-3">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          resourceType: 'video', // ✅ specify video type
          multiple: false,
          maxFileSize: 50000000, // optional (limit 50MB)
        }}
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
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        )}
      </CldUploadWidget>

      {uploadedUrl && (
        <div className="mt-4 space-y-2">
          <CldVideoPlayer
            src={uploadedUrl}
            width="500"
            height="280"
            controls
            className="rounded shadow-md"
          />
          <button
            type="button"
            onClick={() => setUploadedUrl('')}
            className="text-green-600 hover:underline"
          >
            Replace Video
          </button>
        </div>
      )}
    </div>
  );
}
