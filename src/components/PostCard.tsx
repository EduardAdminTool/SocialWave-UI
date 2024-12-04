"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { PostCardProps } from "@/types/posts/types";
import { deletePost } from "@/services/posts";

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [postedAgo, setPostedAgo] = useState<string>("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleLikeClick = () => setIsLiked(!isLiked);

  const handleDeletePost = async (postId: number) => {
    await deletePost(postId);
  };

  const calculateDateDifference = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);

    const diffMs = now.getTime() - postDate.getTime();
    if (diffMs < 0) return "just now";

    const diffSeconds = Math.floor(diffMs / 1000);
    if (diffSeconds < 60)
      return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12)
      return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;

    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
  };

  const updatePostTimes = () => {
    const updatedPostedAgo = calculateDateDifference(post.createdAt);
    setPostedAgo(updatedPostedAgo);
  };

  useEffect(() => {
    updatePostTimes();

    const intervalId = setInterval(() => {
      updatePostTimes();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [post]);

  const nextMedia = () => {
    if (post.images.length + post.videos.length > currentMediaIndex + 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-6">
      <CardHeader className="flex flex-row items-center space-x-4 pb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={post.profilePicture} />
          <AvatarFallback>{post.userId}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{post.userId}</h3>
          <p className="text-sm text-gray-500">{postedAgo}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeletePost(post.postId)}
        >
          Delete
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full py-4">
          {/* Media Display */}
          {(post?.images.length > 0 || post?.videos.length > 0) && (
            <div className="relative flex justify-center items-center overflow-hidden" style={{ height: '500px' }}>
              {/* Previous Button */}
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

              {/* Media */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentMediaIndex}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 flex justify-center items-center"
                >
                  {post?.images.length > 0 && currentMediaIndex < post.images.length ? (
                    <Image
                      src={post.images[currentMediaIndex].imageUrl}
                      alt={`Post image ${currentMediaIndex + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  ) : (
                    post?.videos.length > 0 && (
                      <video
                        controls
                        className="w-full h-full object-cover rounded-lg"
                        onError={() => console.log("Video failed to load")}
                      >
                        <source
                          src={post.videos[currentMediaIndex - post.images.length].videoUrl}
                          type="video/mp4"
                        />
                        <source
                          src={post.videos[currentMediaIndex - post.images.length].videoUrl}
                          type="video/webm"
                        />
                        <source
                          src={post.videos[currentMediaIndex - post.images.length].videoUrl}
                          type="video/ogg"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Next Button */}
              {currentMediaIndex < post.images.length + post.videos.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMedia}
                  className="absolute right-4 z-10 p-0 bg-transparent"
                >
                  &gt;
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-lg">{post.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex space-x-4">
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
      </CardFooter>
    </Card>
  );
}
