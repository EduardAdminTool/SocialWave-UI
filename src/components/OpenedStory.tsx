"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X, Heart, Send } from 'lucide-react';
import { SignInProps } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

export default function OpenedStory({ isOpen, setIsOpen }: SignInProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleLikeClick = () => setIsLiked(!isLiked);

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyText(e.target.value);
  };

  const handleSendReply = () => {
    setReplyText("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] h-[100vh] p-0 bg-black text-white border-none rounded-none overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 z-10">
            <div className="flex items-center space-x-2">
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

          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
             <div className="absolute w-full h-full bg-blue-500 animate-loading-bar"></div>
          </div>

          <div className="flex-grow relative">
            <Image
              src="/post.jpg"
              alt="Story Image"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="p-4 bg-transparent absolute bottom-0 left-0 right-0">
            <div className="flex items-center space-x-2 bg-black bg-opacity-50 rounded-full p-1">
              <Input
                type="text"
                placeholder="Send message"
                className="flex-grow bg-transparent border-none text-white placeholder-gray-400 focus:outline-none focus:ring-0"
                value={replyText}
                onChange={handleReplyChange}
              />
              <div className="flex items-center space-x-2">
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
      </DialogContent>
    </Dialog>
  );
}

