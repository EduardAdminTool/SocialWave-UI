"use client";

import React, { useState } from "react";

export default function createPost() {
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
    }
  };

  const handleUpload = () => {
    if (!media) {
      alert("Please select a file to upload.");
      return;
    }
    alert(`Uploading: ${media.name}`);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-4">
      <div className="space-y-4">
        <span className="text-2xl font-semibold">Your Post</span>
        <div className="border border-black">
          <textarea
            placeholder="Write your caption.."
            className="h-[150px] w-[800px]"
          ></textarea>
        </div>
      </div>
      <div className="flex border border-black w-[800px] h-auto flex-col items-center p-4">
        <h1 className="text-2xl font-semibold mb-4">Upload Image or Video</h1>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        <div className="flex justify-center">
          {preview && (
            <div className="mb-4">
              {media?.type.startsWith("image/") ? (
                <img
                  src={preview}
                  alt="Uploaded preview"
                  className="max-w-full max-h-64 rounded"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="max-w-full max-h-64 rounded"
                />
              )}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Publish
      </button>
    </div>
  );
}
