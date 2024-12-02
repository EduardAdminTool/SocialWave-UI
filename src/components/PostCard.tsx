"use client";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image index

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

  // Handle changing images
  const nextImage = () => {
    if (post.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
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
          <h3 className="text-lg font-semibold">Matei</h3>
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
          {post.images?.length > 1 ? (
            <div className="relative">
              <div className="flex justify-center items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2"
                >
                  &lt;
                </Button>

                <div className="relative w-[800px] flex justify-center h-[500px] overflow-hidden">
                  <Image
                    src={post.images[currentImageIndex].imageUrl}
                    alt={`Post image ${currentImageIndex + 1}`}
                    width={600}
                    height={500}
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2"
                >
                  &gt;
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-[500px]">
              <Image
                src={post.images[0].imageUrl}
                alt="Post image"
                width={600}
                height={500}
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-lg">{post.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button variant="ghost" size="icon" onClick={handleLikeClick}>
            <Heart
              className={`h-6 w-6 ${
                isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Send className="h-6 w-6" />
          </Button>
        </div>
        <Button variant="ghost" size="icon">
          <Bookmark className="h-6 w-6" />
        </Button>
      </CardFooter>
    </Card>
  );
}
