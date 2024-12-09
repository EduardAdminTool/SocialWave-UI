"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CommentModalProps } from "@/types/posts/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { FollowersFollowingProps } from "@/types/account/types";
export function FollowersFollowingModal({
  FollowersFollowing,
  isOpen,
  onClose,
  type,
}: FollowersFollowingProps) {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  const [userIdFromToken, setUserIdFromToken] = useState<number | null>(null);

  const [error, setError] = useState<string | null>("");
  const lastCommentRef = useRef<HTMLDivElement | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const goToUser = (userId: number) => {
    router.push(`/account/${userId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md w-full rounded-lg overflow-hidden">
        <DialogHeader className="bg-white p-4 border-b border-gray-300">
          <DialogTitle className="text-base font-semibold text-center">
            {type}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px] overflow-y-auto bg-white">
          {FollowersFollowing.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <Avatar
                  className="w-10 h-10 cursor-pointer"
                  onClick={() => goToUser(item.userId)}
                >
                  <AvatarImage
                    src={item.profilePicture || ""}
                    alt={item.name || "User"}
                  />
                  <AvatarFallback>
                    {item.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div
                  onClick={() => goToUser(item.userId)}
                  className="cursor-pointer"
                >
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.name || "No username"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
