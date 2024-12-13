"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Trash, X } from "lucide-react";
import { Story } from "@/types/story/types";
import { deleteStory } from "@/services/story";
interface StoryModalProps {
  stories: Story[];
  initialStoryIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onDeleteStory: (index: number) => void;
}

export function StoryModal({
  stories,
  initialStoryIndex,
  isOpen,
  onClose,
  onDeleteStory,
}: //
StoryModalProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const getTokenUserId = () => {
      const token = localStorage.getItem("authToken");
      if (!token) return null;

      const [, payload] = token.split(".");
      const decodedPayload = atob(payload);
      const { sub } = JSON.parse(decodedPayload);
      return sub;
    };

    const userId = getTokenUserId();
    setCurrentUserId(userId);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            if (currentStoryIndex < stories.length - 1) {
              setCurrentStoryIndex(currentStoryIndex + 1);
              return 0;
            } else {
              clearInterval(timer);
              onClose();
              return 100;
            }
          }
          return prevProgress + 1;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isOpen, currentStoryIndex, stories.length, onClose]);

  useEffect(() => {
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [currentStoryIndex]);

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleDeleteStory = async () => {
    const currentStory = stories[currentStoryIndex];
    if (!currentStory) return;

    try {
      await deleteStory(currentStory.storyId);

      onDeleteStory(currentStoryIndex);

      if (currentStoryIndex >= stories.length - 1) {
        setCurrentStoryIndex(stories.length - 2);
      }
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const currentStory = stories[currentStoryIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle></DialogTitle>
      <DialogContent className="max-w-screen-md h-[80vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Story Viewer</DialogTitle>

        <div className="relative w-full h-full">
          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 z-10 flex">
            {stories.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-blue-200 mr-1 rounded-sm"
              >
                <div
                  className="h-full bg-blue-500 rounded-sm"
                  style={{
                    width: `${
                      index < currentStoryIndex
                        ? 100
                        : index === currentStoryIndex
                        ? progress
                        : 0
                    }%`,
                    transition: "width 0.05s linear",
                  }}
                />
              </div>
            ))}
          </div>

          {currentStory?.videoUrl ? (
            <video
              ref={videoRef}
              src={currentStory.videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <img
              src={currentStory?.imageUrl}
              alt={currentStory?.name}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute top-4 left-4 flex items-center bg-black bg-opacity-50 rounded-full p-2">
            <img
              src={currentStory?.profilePicture}
              alt={currentStory?.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-white font-semibold">
              {currentStory?.name}
            </span>
          </div>

          {/* Arrow Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
            onClick={handlePrevStory}
            disabled={currentStoryIndex === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          {Number(currentUserId) === currentStory?.userId && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-16 text-white"
              onClick={() => setIsConfirmModalOpen(true)}
            >
              <Trash className="h-6 w-6" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-blue-500 focus:bg-blue-500"
            onClick={handleNextStory}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
        {successMessage && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            {successMessage}
          </div>
        )}
      </DialogContent>
      <Dialog
        open={isConfirmModalOpen}
        onOpenChange={() => setIsConfirmModalOpen(false)}
      >
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <p>Are you sure you want to delete this story?</p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsConfirmModalOpen(false);
                handleDeleteStory();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
