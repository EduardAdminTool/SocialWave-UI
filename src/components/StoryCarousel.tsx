import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Story, StoryCarouselProps, StoryItemProps } from "@/types/story/types";

export function StoryCarousel({ stories }: StoryCarouselProps) {
  return (
    <div className="rounded-xl p-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4">
          {stories.map((story) => (
            <StoryItem key={story.name} name={story.name} image={story.image} />
          ))}
        </div>
        <ScrollBar
          orientation="horizontal"
          className="opacity-0 transition-opacity hover:opacity-100"
        />
      </ScrollArea>
    </div>
  );
}

function StoryItem({ name, image }: StoryItemProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`p-[3px] rounded-full 
          bg-blue-200
        `}
      >
        <Avatar className="h-16 w-16 border-2 border-white">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="bg-blue-300 text-blue-800">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <span className="text-xs font-medium text-blue-800 truncate w-16 text-center">
        {name}
      </span>
    </div>
  );
}
