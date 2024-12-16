"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StoryModal } from "./StoryModal";
import { Story } from "@/types/story/types";
import { useEffect } from "react";

interface StoryCarouselProps {
  stories: Story[];
  type?: string;
}

export function StoryCarousel({
  stories: initialStories,
  type,
}: StoryCarouselProps) {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    setStories(initialStories);
  }, [initialStories]);

  const openStoryModal = (index: number) => {
    setSelectedStoryIndex(index);
    setIsModalOpen(true);
  };

  const closeStoryModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedStoryIndex(null);
    }, 0);
  };

  const handleDeleteStory = (index: number) => {
    const updatedStories = stories.filter((_, i) => i !== index);
    setStories(updatedStories);

    if (updatedStories.length === 0) {
      closeStoryModal();
    } else if (index >= updatedStories.length) {
      setSelectedStoryIndex(updatedStories.length - 1);
    }
  };

  return (
    <>
      {stories.map((story, index) => (
        <button
          key={story.storyId}
          className="flex flex-col items-center space-y-1 transform origin-center transition-transform duration-200 hover:scale-110"
          onClick={() => openStoryModal(index)}
        >
          <Avatar className="w-16 h-16 ring-2 ring-blue-500 ring-offset-2">
            <AvatarImage src={story.profilePicture} alt={story.name} />
            <AvatarFallback>{story.name}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">
            {type === "account" ? null : story.name}
          </span>
        </button>
      ))}
      {isModalOpen && selectedStoryIndex !== null && (
        <StoryModal
          stories={stories}
          initialStoryIndex={selectedStoryIndex}
          isOpen={isModalOpen}
          onClose={closeStoryModal}
          onDeleteStory={handleDeleteStory}
        />
      )}
    </>
  );
}
