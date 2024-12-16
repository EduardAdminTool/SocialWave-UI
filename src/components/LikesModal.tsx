"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikesModalProps } from "@/types/posts/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LikesModal({ likes, isOpen, onClose }: LikesModalProps) {
  const router = useRouter();
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-0 rounded-lg overflow-hidden shadow-xl bg-white">
        <DialogHeader className="flex justify-between items-center p-4 bg-white border-b border-gray-300">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            Likes
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[400px] overflow-y-auto">
          {likes.length > 0 ? (
            likes.map((like, index) => (
              <div
                onClick={() => router.push(`/account/${like.userId}`)}
                key={like.name}
                className={`flex items-center cursor-pointer space-x-4 p-4 hover:bg-gray-100 transition-all duration-200 ${
                  index !== likes.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    onClick={() => router.push(`/account/${like.userId}`)}
                    className="rounded-full object-cover cursor-pointer"
                    src={like.profilePicture}
                  />
                  <AvatarFallback>{like.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-800">
                    {like.name}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center p-4">
              No likes yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
