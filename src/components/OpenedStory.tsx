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
      <DialogContent className="sm:max-w-[825px] bg-blue-200 text-black border-none h-auto">
        <DialogHeader className="space-y-4">
          <div className="relative w-full h-2 bg-gray-200 overflow-hidden">
            <div className="absolute w-full h-full bg-blue-500 animate-loading-bar"></div>
          </div>
          <DialogTitle className="flex flex-row items-center space-x-4 pb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={"/post.jpg"} className="rounded-full" />
              <AvatarFallback>Matei</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Matei</h3>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="relative w-full h-[800px]">
            <Image
              src={"/post.jpg"}
              alt="Public Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <input
            placeholder="Trimite un mesaj.."
            className="border border-black w-[600px] text-center rounded-full h-[40px]"
          />
          <div onClick={handleLikeClick}>
            <Heart
              className={`h-10 w-10 ${
                isLiked ? "fill-red-500 text-red-500" : ""
              } hover:scale-110 cursor-pointer transition-colors duration-300 ease-in-out`}
            />
          </div>

          <Link href="/messages" className="group">
            <div className="transition-all duration-300 ease-in-out transform group-hover:scale-110">
              <FaLocationArrow
                size={36}
                className="transition-colors duration-300 ease-in-out"
              />
            </div>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
