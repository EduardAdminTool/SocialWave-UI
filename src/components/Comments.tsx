"use client";

import React, { useEffect, useState } from "react";
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
import { Edit2, MoreHorizontal, Send, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jwt from 'jsonwebtoken';

export function CommentModal({ comments, isOpen, onClose, name, profilePicture, postId }: CommentModalProps) {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [userIdFromToken,setUserIdFromToken] = useState<number>(0);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        console.log("Decoded Token:", decodedToken);
        setUserIdFromToken(decodedToken?.sub);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleAddComment = async () => {
    const response = await createComment(postId, newComment);
    console.log(response);
    setNewComment(""); 
  };

  const handleEditComment = (commentId: string, text: string) => {
    setEditingCommentId(commentId);
    setEditedCommentText(text);
  };

  const handleUpdateComment = async (commentId: string) => {
    // const response = await updateComment(commentId, editedCommentText);
    // if (response.success) {
    //   setComments(comments.map(comment => 
    //     comment.commentId === commentId ? { ...comment, text: editedCommentText } : comment
    //   ));
    //   setEditingCommentId(null);
    //   setEditedCommentText("");
  };

  const handleDeleteComment = async (commentId: string) => {
    // Implement delete functionality here
    // For now, we'll just remove it from the local state
    // setComments(comments.filter(comment => comment.commentId !== commentId));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md w-full rounded-lg overflow-hidden">
        <DialogHeader className="bg-white p-4 border-b border-gray-300">
          <DialogTitle className="text-base font-semibold text-center">Comments</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px] overflow-y-auto bg-white">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div
                key={comment.commentId}
                className={`flex items-start space-x-3 p-4 ${
                  index !== comments.length - 1 ? 'border-b border-gray-300' : ''
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profilePicture} />
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {editingCommentId === comment.commentId ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <Button
                        // onClick={() => handleUpdateComment(comment.commentId)}
                        className="text-blue-500 font-semibold text-sm bg-transparent hover:bg-transparent p-0"
                      >
                        Update
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">
                        <span className="font-semibold mr-2">{name}</span>
                        {comment.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2h</p>
                    </>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center p-4">
              No comments yet.
            </p>
          )}
        </div>
        <div className="p-3 border-t border-gray-300 bg-white">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profilePicture} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 text-sm focus:outline-none"
            />
            <Button
              onClick={handleAddComment}
              className="text-blue-500 font-semibold text-sm bg-transparent hover:bg-transparent p-0"
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

