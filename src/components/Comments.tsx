"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CommentModalProps } from "@/types/posts/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createComment } from "@/services/comments";
export function CommentModal({ comments, isOpen, onClose, name, profilePicture, postId }: CommentModalProps) {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    const response = await createComment(postId,newComment);
    console.log(response);
    
  };

  if (!isOpen) return null;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md w-full rounded-lg overflow-hidden">
        <DialogHeader className="bg-gray-100 p-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold">Comments</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px] overflow-y-auto p-4">
          {comments?.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.commentId}
                className="flex items-start space-x-2 mb-4 last:mb-0"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={profilePicture}
                  />
                  <AvatarFallback>{name}</AvatarFallback>
              </Avatar>
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center">
              No comments yet.
            </p>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
            <Button
              onClick={handleAddComment}
              className="text-sm"
              disabled={!newComment.trim()}
            >
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
