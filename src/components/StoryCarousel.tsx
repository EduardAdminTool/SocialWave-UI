"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StoryModal } from "./StoryModal";
import { Story } from "@/types/story/types";

interface StoryCarouselProps {
  stories: Story[];
}

export function StoryCarousel({ stories }: StoryCarouselProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const openStoryModal = (index: number) => {
    setSelectedStoryIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      {stories.map((story, index) => (
        <button
          key={story.storyId}
          className="flex flex-col items-center space-y-1"
          onClick={() => openStoryModal(index)}
        >
          <Avatar className="w-16 h-16 ring-2 ring-blue-500 ring-offset-2">
            <AvatarImage src={story.profilePicture} alt={story.name} />
            <AvatarFallback>{story.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">{story.name}</span>
        </button>
      ))}
      <StoryModal
        stories={stories}
        initialStoryIndex={selectedStoryIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
