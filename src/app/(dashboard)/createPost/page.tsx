"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Video, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import { createPost, createStory } from "@/services/posts";
import withAuth from "@/utils/withAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";

function CreatePostPage() {
  const router = useRouter();

  const [media, setMedia] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"post" | "story">("post");
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

  const handleFile = useCallback(
    async (file: File) => {
      let processedFile = file;
      if (file.type.startsWith("image/")) {
        processedFile = await compressImage(file);
      }

      if (activeTab === "story") {
        console.log("Setting media and previews for story");
        setMedia([processedFile]);
        setPreviews([URL.createObjectURL(processedFile)]);
      } else {
        setMedia((prevFiles) => [...prevFiles, processedFile]);
        setPreviews((prevPreviews) => [
          ...prevPreviews,
          URL.createObjectURL(processedFile),
        ]);
      }
    },
    [activeTab]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files) {
        if (activeTab === "story" && files.length > 0) {
          handleFile(files[0]);
        } else {
          Array.from(files).forEach((file) => {
            if (
              file &&
              (file.type.startsWith("image/") || file.type.startsWith("video/"))
            ) {
              handleFile(file);
            }
          });
        }
      }
    },
    [handleFile, activeTab]
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
    const files = e.target.files;
    if (files) {
      if (activeTab === "story" && files.length > 0) {
        handleFile(files[0]);
      } else {
        Array.from(files).forEach((file) => {
          handleFile(file);
        });
      }
    }
  };

  const handleUpload = async () => {
    setError(null);
    setSuccess(null);
    setIsUploading(true);

    if (activeTab === "post" && !description.trim()) {
      setError("Please enter a description");
      setIsUploading(false);
      return;
    }

    if (media.length === 0) {
      setError("Please select at least one image or video");
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

      if (activeTab === "post") {
        await createPost(description, localTimeString, localTimeString, media);
        setSuccess("Post created successfully");
      } else {
        await createStory(media);
        setSuccess("Story created successfully");
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setError(`Failed to create ${activeTab}. Please try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteMedia = (index: number) => {
    if (activeTab === "story") {
      console.log("Clearing media and previews for story");
      setMedia([]);
      setPreviews([]);
    } else {
      setMedia((prevFiles) => prevFiles.filter((_, i) => i !== index));
      setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-blue-800">
            Create Your Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "post" | "story")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="post" className="py-2 text-lg font-semibold">
                Post
              </TabsTrigger>
              <TabsTrigger value="story" className="py-2 text-lg font-semibold">
                Story
              </TabsTrigger>
            </TabsList>
            <TabsContent value="post">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CreatePostContent
                  description={description}
                  setDescription={setDescription}
                  isDragging={isDragging}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  handleSelectFileClick={handleSelectFileClick}
                  previews={previews}
                  media={media}
                  handleDeleteMedia={handleDeleteMedia}
                  error={error}
                  success={success}
                  isUploading={isUploading}
                  handleUpload={handleUpload}
                />
              </motion.div>
            </TabsContent>
            <TabsContent value="story">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CreateStoryContent
                  isDragging={isDragging}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  handleSelectFileClick={handleSelectFileClick}
                  previews={previews}
                  media={media}
                  handleDeleteMedia={handleDeleteMedia}
                  error={error}
                  success={success}
                  isUploading={isUploading}
                  handleUpload={handleUpload}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </motion.div>
    </div>
  );
}

function CreatePostContent({
  description,
  setDescription,
  isDragging,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  fileInputRef,
  handleFileChange,
  handleSelectFileClick,
  previews,
  media,
  handleDeleteMedia,
  error,
  success,
  isUploading,
  handleUpload,
}) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Textarea
          placeholder="Write your caption..."
          className="h-32 w-full transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </motion.div>
      <UploadArea
        isDragging={isDragging}
        handleDrop={handleDrop}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleSelectFileClick={handleSelectFileClick}
      />
      <PreviewArea
        previews={previews}
        media={media}
        handleDeleteMedia={handleDeleteMedia}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-green-500 text-center"
          >
            {success}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={handleUpload}
          className="w-full max-w-xs bg-blue-600 hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          disabled={isUploading}
        >
          {isUploading ? "Publishing..." : "Publish Post"}
        </Button>
      </motion.div>
    </div>
  );
}

function CreateStoryContent({
  isDragging,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  fileInputRef,
  handleFileChange,
  handleSelectFileClick,
  previews,
  media,
  handleDeleteMedia,
  error,
  success,
  isUploading,
  handleUpload,
}) {
  return (
    <div className="space-y-6">
      <UploadArea
        isDragging={isDragging}
        handleDrop={handleDrop}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleSelectFileClick={handleSelectFileClick}
      />
      <PreviewArea
        previews={previews}
        media={media}
        handleDeleteMedia={handleDeleteMedia}
        isStory={true}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-green-500 text-center"
          >
            {success}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={handleUpload}
          className="w-full max-w-xs bg-blue-600 hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          disabled={isUploading}
        >
          {isUploading ? "Publishing..." : "Publish Story"}
        </Button>
      </motion.div>
    </div>
  );
}

function UploadArea({
  isDragging,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  fileInputRef,
  handleFileChange,
  handleSelectFileClick,
}) {
  return (
    <motion.div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
      </motion.div>
      <motion.p
        className="mt-2 text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Drag and drop your files here, or click to select files
      </motion.p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        multiple
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={handleSelectFileClick}
        >
          Select Files
        </Button>
      </motion.div>
    </motion.div>
  );
}

function PreviewArea({ previews, media, handleDeleteMedia, isStory = false }) {
  return (
    previews.length > 0 && (
      <div
        className={isStory ? "flex justify-center" : "grid grid-cols-2 gap-4"}
      >
        {previews.map((preview, index) => (
          <motion.div
            key={index}
            className={`relative ${isStory ? "w-full max-w-md" : ""}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {media[index]?.type.startsWith("image/") ? (
              <img
                src={preview}
                alt="Uploaded preview"
                className={`rounded-lg shadow-md ${
                  isStory ? "w-full h-96 object-cover" : "max-w-full max-h-64"
                }`}
              />
            ) : media[index]?.type.startsWith("video/") ? (
              <video
                src={preview}
                controls
                className={`rounded-lg shadow-md ${
                  isStory ? "w-full h-96 object-cover" : "max-w-full max-h-64"
                }`}
              />
            ) : null}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDeleteMedia(index)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
              aria-label="Delete"
            >
              <X size={16} />
            </motion.button>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full">
              {media[index]?.type.startsWith("image/") ? (
                <Image size={16} />
              ) : (
                <Video size={16} />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    )
  );
}

export default withAuth(CreatePostPage);
