"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import imageCompression from "browser-image-compression";
import { createPost } from "@/services/posts";

export default function CreatePostPage() {
  const router = useRouter();

  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (
    file: globalThis.File
  ): Promise<globalThis.File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  const handleFile = useCallback(async (file: File) => {
    let processedFile = file;
    if (file.type.startsWith("image/")) {
      processedFile = await compressImage(file);
    }
    setMedia(processedFile);
    const fileURL = URL.createObjectURL(processedFile);
    setPreview(fileURL);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (
        file &&
        (file.type.startsWith("image/") || file.type.startsWith("video/"))
      ) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUpload = async () => {
    setError(null);
    setSuccess(null);
    setIsUploading(true);

    if (!description.trim()) {
      setError("Please enter a description");
      setIsUploading(false);
      return;
    }

    if (!media) {
      setError("Please select an image or video");
      setIsUploading(false);
      return;
    }

    try {
      const now = new Date();
      const localTimeString = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
        now.getSeconds()
      ).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`;

      await createPost(description, localTimeString, localTimeString, media);

      console.log(media);
      setSuccess("Post created successfully");
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-blue-800">
            Create Your Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Textarea
              placeholder="Write your caption..."
              className="h-32 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your file here, or click to select a file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Button
              className="mt-4"
              variant="outline"
              onClick={handleSelectFileClick}
            >
              Select File
            </Button>
          </div>
          {preview && (
            <div className="flex justify-center">
              {media?.type.startsWith("image/") ? (
                <img
                  src={preview}
                  alt="Uploaded preview"
                  className="max-w-full max-h-64 rounded-lg shadow-md"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="max-w-full max-h-64 rounded-lg shadow-md"
                />
              )}
            </div>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <div className="flex justify-center">
            <Button
              onClick={handleUpload}
              className="w-full max-w-xs bg-blue-600 hover:bg-blue-500 hover:scale-105"
              disabled={isUploading}
            >
              {isUploading ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
