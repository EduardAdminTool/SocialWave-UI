"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import { Story } from "@/types/story/types";
import { deleteStory } from "@/services/story";
import { calculateDateDifference } from "@/utils/calculateDate";
interface StoryModalProps {
  stories: Story[];
  initialStoryIndex: number;
  isOpen: boolean;
  type: string;
  onClose: () => void;
  onDeleteStory: (index: number) => void;
}

export function StoryModal({
  stories,
  initialStoryIndex,
  isOpen,
  type,
  onClose,
  onDeleteStory,
}: StoryModalProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex((prevIndex) => prevIndex + 1);
            return 0;
          } else {
            stopTimer();
            onClose();
            return 100;
          }
        }
        return prevProgress + 1;
      });
    }, 50);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    const getTokenUserId = () => {
      const token = localStorage.getItem("authToken");
      if (!token) return null;

      const [, payload] = token.split(".");
      const decodedPayload = atob(payload);
      const { sub } = JSON.parse(decodedPayload);
      return sub;
    };

    setCurrentUserId(getTokenUserId());
  }, []);

  useEffect(() => {
    if (isOpen && !isPaused) {
      startTimer();
      if (videoRef.current) {
        videoRef.current.play();
      }
    } else {
      stopTimer();
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

    return stopTimer;
  }, [isOpen, isPaused, currentStoryIndex]);

  const handlePauseToggle = () => {
    setIsPaused((prev) => {
      const newPausedState = !prev;
      if (videoRef.current) {
        if (newPausedState) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
      return newPausedState;
    });
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
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-screen-md h-[80vh] p-0 overflow-hidden"
        ref={modalRef}
      >
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
          {type === "account" && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-200 rounded-full p-2"
              onClick={handleDeleteStory}
            >
              <Trash2 className="h-6 w-6" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-200 rounded-full p-2"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <DialogTitle className="sr-only">Story Viewer</DialogTitle>

        <div className="relative w-full h-full">
          <div className="absolute top-0 left-0 right-0 z-10 flex">
            <div className="flex-1 h-1 bg-blue-200 mr-1 rounded-sm">
              <div
                className="h-full bg-blue-500 rounded-sm"
                // style={{
                //   width: `${
                //     index < currentStoryIndex
                //       ? 100
                //       : index === currentStoryIndex
                //       ? progress
                //       : 0
                //   }%`,
                //   transition: "width 0.05s linear",
                // }}
              />
            </div>
          </div>

          {currentStory?.videoUrl ? (
            <video
              ref={videoRef}
              src={currentStory.videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              onClick={handlePauseToggle}
            />
          ) : (
            <img
              src={currentStory?.imageUrl}
              alt={currentStory?.name}
              className="w-full h-full object-cover"
              onClick={handlePauseToggle}
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
          <div className="absolute top-4 right-[100px] bg-black bg-opacity-50 px-4 py-1 rounded-full">
            <span className="text-white text-sm font-medium">
              {calculateDateDifference(currentStory?.createdAt)}
            </span>
          </div>
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
