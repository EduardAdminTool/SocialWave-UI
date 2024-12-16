"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Trash2,
  X,
} from "lucide-react";
import { Story } from "@/types/story/types";
import { deleteStory } from "@/services/story";
import { calculateDateDifference } from "@/utils/calculateDate";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

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
  const [isPaused, setIsPaused] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

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
    setProgress(0);
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
      onClose();

      if (currentStoryIndex >= stories.length - 1) {
        setCurrentStoryIndex(stories.length - 2);
      }
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const currentStory = stories[currentStoryIndex];

  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="relative w-full max-w-screen-md h-[80vh] bg-gray-900 rounded-lg overflow-hidden"
      >
        <div className="relative w-full h-full flex flex-col">
          <div className="absolute top-0 left-0 right-0 z-10 p-2">
            <Progress value={progress} className="h-1" />
          </div>

          <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center space-x-2">
              <Avatar>
                <img
                  src={currentStory?.profilePicture}
                  alt={currentStory?.name}
                  className="w-10 h-10 rounded-full"
                />
              </Avatar>
              <div className="flex flex-col">
                <span className="text-white font-semibold">
                  {currentStory?.name}
                </span>
                <span className="text-white/70 text-sm">
                  {calculateDateDifference(currentStory?.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {type === "account" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => setIsConfirmModalOpen(true)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {currentStory?.videoUrl ? (
              <video
                ref={videoRef}
                src={currentStory.videoUrl}
                className="w-full h-full object-contain"
                autoPlay
                muted
                playsInline
                onClick={handlePauseToggle}
              />
            ) : (
              <img
                src={currentStory?.imageUrl}
                alt={currentStory?.name}
                className="w-full h-full object-contain"
                onClick={handlePauseToggle}
              />
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-t from-black/50 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={handlePauseToggle}
            >
              {isPaused ? (
                <Play className="h-6 w-6" />
              ) : (
                <Pause className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {successMessage && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            {successMessage}
          </div>
        )}
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this story?</p>
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
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modal, document.body);
}
