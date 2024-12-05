"use client";

import { useState } from "react";
import { Heart, Send, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function NotificationModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
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
      </div>
    </div>
  );
}
