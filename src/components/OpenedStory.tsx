"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Apple, Key } from "lucide-react";
import { X } from "lucide-react";
import { Heart } from "lucide-react";

import { SignInProps } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa";

export default function OpenedStory({ isOpen, setIsOpen }: SignInProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => setIsLiked(!isLiked);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[825px] bg-blue-100 text-black border-none rounded-lg shadow-lg p-6">
        <DialogHeader className="space-y-4">
          <div className="relative w-full h-2 bg-gray-200 rounded-lg overflow-hidden">
            <div className="absolute w-full h-full bg-blue-500 animate-loading-bar"></div>
          </div>
          <DialogTitle className="flex items-center space-x-4 pb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={"/post.jpg"} className="rounded-full" />
              <AvatarFallback>Matei</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">Matei</h3>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
          <Image
            src={"/post.jpg"}
            alt="Public Image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        <div className="flex items-center justify-between mt-4 space-x-4">
          <input
            placeholder="Send a message.."
            className="w-full max-w-[600px] px-4 py-2 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />

          <div
            onClick={handleLikeClick}
            className="relative p-2 hover:bg-gray-200 rounded-full cursor-pointer transition-all ease-in-out"
          >
            <Heart
              className={`h-10 w-10 transition-colors duration-300 ease-in-out transform ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              } hover:scale-110`}
            />
          </div>

          <Link href="/messages" className="group">
            <div className="transition-all duration-300 ease-in-out transform group-hover:scale-110">
              <FaLocationArrow
                size={36}
                className="text-gray-600 transition-colors duration-300 ease-in-out hover:text-blue-600"
              />
            </div>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
