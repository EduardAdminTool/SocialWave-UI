"use client";

import { useState } from "react";
import { Heart, Send, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function OpenedStory({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleLikeClick = () => setIsLiked(!isLiked);

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyText(e.target.value);
  };

  const handleSendReply = () => {
    setReplyText("");
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <div className="relative text-white rounded-lg overflow-hidden w-[90%] max-w-4xl h-[90%]">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full z-50"
        >
          <X className="text-white h-6 w-6" />
        </button>

        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
          <div className="absolute w-1/4 h-full bg-blue-500"></div>
        </div>

        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black bg-opacity-50 px-3 py-1 rounded-full z-40">
          <Avatar className="h-8 w-8 ring-2 ring-white">
            <AvatarImage src="/post.jpg" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">matei</p>
            <p className="text-xs text-gray-400">2h</p>
          </div>
        </div>

        <div className="relative w-full h-full">
          <Image src="/post.jpg" alt="Story" fill className="object-cover" />

          <div className="absolute bottom-4 left-0 right-0 px-4 z-50">
            <div className="flex items-center space-x-2 bg-black bg-opacity-60 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Send message"
                className="flex-grow bg-transparent text-white placeholder-gray-400 border-none focus:outline-none"
                value={replyText}
                onChange={handleReplyChange}
              />
              <button onClick={handleLikeClick}>
                <Heart
                  className={`h-6 w-6 ${
                    isLiked ? "fill-red-500 text-red-500" : "text-white"
                  }`}
                />
              </button>
              <button onClick={handleSendReply}>
                <Send className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
