"use client";
import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Story, StoryCarouselProps, StoryItemProps } from "@/types/story/types";
import OpenedStory from "@/components/OpenedStory";

export function StoryCarousel({ stories }: StoryCarouselProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-xl p-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4">
          {stories.map((story) => (
            <div key={story.name}>
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`p-[3px] rounded-full 
                bg-blue-200
              `}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Avatar className="h-16 w-16 border-2 border-white hover:scale-105 cursor-pointer">
                    {/* <AvatarImage src={story.image} alt={story.name} /> */}
                    <AvatarFallback className="bg-blue-300 text-blue-800">
                      {story.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-xs font-medium text-blue-800 truncate w-16 text-center">
                  {story.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar
          orientation="horizontal"
          className="opacity-0 transition-opacity hover:opacity-100"
        />
      </ScrollArea>
      <OpenedStory isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
