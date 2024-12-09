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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md w-full rounded-lg overflow-hidden">
        <DialogHeader className="bg-white p-4 border-b border-gray-300">
          <DialogTitle className="text-base font-semibold text-center">
            Followers
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px] overflow-y-auto bg-white">
          {FollowersFollowing.map((item) => (
            <span>{item.name}</span>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
