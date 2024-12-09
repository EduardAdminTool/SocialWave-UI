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
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { deleteComment, updateComment } from "@/services/comments";
import { Comments } from "@/types/types";
import { getAccountInfo } from "@/services/account";
import { Account } from "@/types/account/types";
export function CommentModal({
  comments,
  isOpen,
  onClose,
  postId,
}: CommentModalProps) {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);
  const [userIdFromToken, setUserIdFromToken] = useState<number | null>(null);
  const [updatedComments, setUpdatedComments] = useState<Comments[]>(comments);
  const [error, setError] = useState<string | null>("");
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        const userIdFromToken = decodedToken?.sub;

        if (userIdFromToken) {
          setUserIdFromToken(Number(userIdFromToken));
        } else {
          console.error("No 'sub' claim in token or it's not a valid number");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const fetchAccount = async () => {
    setError(null);
    try {
      const fetchedAccount = await getAccountInfo();
      setAccountInfo(fetchedAccount);
    } catch (err) {
      setError("Nu s-au putut obtine date");
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await createComment(postId, newComment);

      const commentId = response[0].commentId;

      const newCommentObj: Comments = {
        commentId: commentId,
        parentId: 0,
        postId,
        userId: userIdFromToken!,
        text: newComment,
        createAt: new Date().toISOString(),
        name: String(accountInfo?.name),
        profilePicture: String(accountInfo?.profilePicture),
      };

      setUpdatedComments((prevComments) => [...prevComments, newCommentObj]);

      setNewComment("");
    } catch (error) {
      setError("Failed to add comment");
      console.error(error);
    }
  };

  const handleEditComment = (commentId: number, text: string) => {
    setEditingCommentId(commentId);
    setEditedCommentText(text);
    setIsUpdateOpen(true);
  };

  const handleUpdateComment = async (commentId: number) => {
    try {
      const response = await updateComment(
        commentId,
        editedCommentText,
        Number(userIdFromToken)
      );

      setUpdatedComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === commentId
            ? { ...comment, text: editedCommentText }
            : comment
        )
      );

      setEditingCommentId(null);
      setIsUpdateOpen(false);
    } catch (error) {
      setError("Failed to update comment");
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await deleteComment(commentId);

      setUpdatedComments((prevComments) =>
        prevComments.filter((comment) => comment.commentId !== commentId)
      );
    } catch (error) {
      setError("Failed to delete comment");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md w-full rounded-lg overflow-hidden">
        <DialogHeader className="bg-white p-4 border-b border-gray-300">
          <DialogTitle className="text-base font-semibold text-center">
            Comments
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px] overflow-y-auto bg-white">
          {updatedComments.length > 0 ? (
            updatedComments.map((comment, index) => (
              <div
                key={comment.commentId}
                className={`flex items-start space-x-3 p-4 ${
                  index !== updatedComments.length - 1
                    ? "border-b border-gray-300"
                    : ""
                }`}
              >
                <Avatar
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/account/${comment.userId}`)}
                  className="h-8 w-8"
                >
                  <AvatarImage src={comment.profilePicture} />
                  <AvatarFallback>{comment.name}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => router.push(`/account/${comment.userId}`)}
                      className="font-semibold mr-2"
                    >
                      {comment.name}
                    </span>
                    {editingCommentId === comment.commentId ? (
                      <input
                        type="text"
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                        className="text-sm w-full border rounded-md p-1"
                      />
                    ) : (
                      comment.text
                    )}
                  </p>
                </div>
                {comment.userId === userIdFromToken && !isUpdateOpen && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleEditComment(comment.commentId, comment.text)
                        }
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteComment(comment.commentId)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {editingCommentId === comment.commentId && (
                  <Button
                    onClick={() =>
                      handleUpdateComment(Number(comment.commentId))
                    }
                    className="mt-2 text-blue-500 font-semibold text-sm"
                    disabled={!editedCommentText.trim()}
                  >
                    Save
                  </Button>
                )}
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
