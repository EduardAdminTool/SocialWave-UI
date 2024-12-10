"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import Image from "next/image";
import { Post } from "@/types/posts/types";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MdDelete } from "react-icons/md";
import { deletePost } from "@/services/posts";
import { Likes } from "@/types/types";
import { createLike, deleteLike } from "@/services/feed";
interface PostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  name: string;
  profilePicture: string;
}
export function PostModal({
  post,
  isOpen,
  onClose,
  userId,
  name,
  profilePicture,
}: PostModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesArray, setLikesArray] = useState<Likes[]>(post?.likes || []);

  useEffect(() => {
    if (post) {
      const userHasLiked = post.likes.some((like) => like.userId === userId);
      if (userHasLiked) {
        setIsLiked(true);
      }
      setLikesArray(post.likes);
    }
  }, [post, userId]);

  const deletePostButton = async () => {
    await deletePost(Number(post?.postId));
    onClose();
  };

  const nextMedia = () => {
    if (
      post &&
      post.images.length + post.videos.length > currentMediaIndex + 1
    ) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const renderDots = () => {
    if (!post) return null;
    const totalMedia = post.images.length + post.videos.length;
    return (
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 py-2 px-4 rounded-full">
        {Array.from({ length: totalMedia }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300 focus:outline-none",
              currentMediaIndex === index ? "bg-blue-600" : "bg-blue-300"
            )}
            onClick={() => setCurrentMediaIndex(index)}
            aria-label={`Go to media ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  const handleLikeClick = async () => {
    try {
      if (!isLiked) {
        const response = await createLike(post?.postId!);
        if (response) {
          setLikesArray([
            ...likesArray,
            {
              userId: userId,
              postId: post?.postId!,
              name: name,
              profilePicture: profilePicture,
            },
          ]);
        }
        setIsLiked(true);
      } else {
        const response = await deleteLike(post?.postId!);
        if (response) {
          setIsLiked(false);
          setLikesArray(likesArray.filter((like) => like.userId !== userId));
        }
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 relative h-[400px] md:h-[600px]">
            {(post.images.length > 0 || post.videos.length > 0) && (
              <div className="relative flex h-full justify-center items-center overflow-hidden">
                {currentMediaIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevMedia}
                    className="absolute left-4 z-10 p-0 bg-transparent"
                  >
                    &lt;
                  </Button>
                )}

                <AnimatePresence initial={false}>
                  <motion.div
                    key={currentMediaIndex}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 flex justify-center items-center"
                  >
                    {post.images.length > 0 &&
                    currentMediaIndex < post.images.length ? (
                      <Image
                        src={String(post.images[currentMediaIndex])}
                        alt={`Post image ${currentMediaIndex + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-lg"
                      />
                    ) : (
                      post.videos.length > 0 && (
                        <video
                          controls
                          className="w-full h-full object-cover rounded-lg"
                          onError={() => console.log("Video failed to load")}
                        >
                          <source
                            src={String(
                              post.videos[
                                currentMediaIndex - post.images.length
                              ]
                            )}
                            type="video/mp4"
                          />
                          <source
                            src={String(
                              post.videos[
                                currentMediaIndex - post.images.length
                              ]
                            )}
                            type="video/webm"
                          />
                          <source
                            src={String(
                              post.videos[
                                currentMediaIndex - post.images.length
                              ]
                            )}
                            type="video/ogg"
                          />
                          Your browser does not support the video tag.
                        </video>
                      )
                    )}
                  </motion.div>
                </AnimatePresence>

                {currentMediaIndex <
                  post.images.length + post.videos.length - 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextMedia}
                    className="absolute right-4 z-10 p-0 bg-transparent"
                  >
                    &gt;
                  </Button>
                )}
                {renderDots()}
              </div>
            )}
          </div>
          <div className="w-full md:w-1/3 p-4 flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2" />
            </DialogHeader>
            <div className="flex-grow overflow-y-auto">
              <p className="text-sm mt-2">{post.description}</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="ghost" onClick={handleLikeClick}>
                    <Heart
                      className={`h-6 w-6 ${
                        isLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button variant="ghost">
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost">
                    <Send className="h-6 w-6" />
                  </Button>
                </div>
                <Button variant="ghost">
                  <Bookmark className="h-6 w-6" />
                </Button>
                <Button variant="ghost" onClick={deletePostButton}>
                  <MdDelete className="h-6 w-6" />
                </Button>
              </div>
              <p className="font-bold">{likesArray.length} Likes</p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
