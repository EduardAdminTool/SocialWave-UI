"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CommentModal } from "./Comments";
import { LikesModal } from "./LikesModal";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import jwt from "jsonwebtoken";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { PostCardProps } from "@/types/posts/types";
import { createLike, deleteLike } from "@/services/feed";
import { Likes } from "@/types/types";
import { getAccountInfo } from "@/services/account";
import { Account } from "@/types/account/types";
export function PostCard({ posts }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [postedAgo, setPostedAgo] = useState<string>("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [likesArray, setLikesArray] = useState<Likes[]>(posts.likes);
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>("");
  const router = useRouter();

  useEffect(() => {
    fetchAccount();
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        const userIdFromToken = decodedToken?.sub;
        if (userIdFromToken) {
          const userHasLiked = posts.likes.some(
            (like) => like.userId === Number(userIdFromToken)
          );

          if (userHasLiked) {
            setIsLiked(!isLiked);
          }
        } else {
          console.error("No 'sub' claim in token or it's not a valid number");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLikeClick = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }

    try {
      const decodedToken = jwt.decode(token);
      const userIdFromToken = decodedToken?.sub;
      if (!userIdFromToken) {
        console.error("Invalid user ID");
        return;
      }

      if (!isLiked) {
        const response = await createLike(posts.postId);
        if (response) {
          setLikesArray([
            ...likesArray,
            {
              userId: Number(userIdFromToken),
              postId: posts.postId,
              name: accountInfo!.name,
              profilePicture: accountInfo!.profilePicture,
            },
          ]);
        }
        setIsLiked(true);
      } else {
        const response = await deleteLike(posts.postId);
        if (response) {
          setIsLiked(false);
          setLikesArray(
            likesArray.filter((like) => like.userId !== Number(userIdFromToken))
          );
        }
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const fetchAccount = async () => {
    setError(null);
    try {
      const fetchedAccount = await getAccountInfo();
      setAccountInfo(fetchedAccount);
    } catch (err) {
      setError("Nu s-au putut obtine date");
    }
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
    const updatedPostedAgo = calculateDateDifference(posts.createdAt);
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
  }, [posts]);

  const nextMedia = () => {
    if (posts.images.length + posts.videos.length > currentMediaIndex + 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const renderDots = () => {
    const totalMedia = posts.images.length + posts.videos.length;
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

  const openComments = () => {
    setIsCommentsOpen(!isCommentsOpen);
  };

  const openLikes = () => {
    setIsLikesOpen(!isLikesOpen);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-4">
      <CardHeader className="flex flex-row items-center space-x-4 pb-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            className="cursor-pointer"
            src={posts.profilePicture}
            onClick={() => router.push(`/${posts.name}?userId=${posts.userId}`)}
          />
          <AvatarFallback>{posts.userId}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3
            className="text-lg font-semibold cursor-pointer"
            onClick={() => router.push(`/account/${posts.userId}`)}
          >
            {posts.name}
          </h3>
          <p className="text-sm text-gray-500">{postedAgo}</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full py-4">
          {/* {(posts?.images.length > 0 || posts?.videos.length > 0) && (
            <div
              key={posts.description}
              className="relative flex justify-center items-center overflow-hidden"
              style={{ height: "500px" }}
            >
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
                  {posts?.images.length > 0 &&
                  currentMediaIndex < posts.images.length ? (
                    <Image
                      src={posts.images[currentMediaIndex]}
                      alt={`Post image ${currentMediaIndex + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  ) : (
                    posts?.videos.length > 0 && (
                      <video
                        controls
                        className="w-full h-full object-cover rounded-lg"
                        onError={() => console.log("Video failed to load")}
                      >
                        <source
                          src={
                            posts.videos[
                              currentMediaIndex - posts.images.length
                            ]
                          }
                          type="video/mp4"
                        />
                        <source
                          src={
                            posts.videos[
                              currentMediaIndex - posts.images.length
                            ]
                          }
                          type="video/webm"
                        />
                        <source
                          src={
                            posts.videos[
                              currentMediaIndex - posts.images.length
                            ]
                          }
                          type="video/ogg"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )
                  )}
                </motion.div>
              </AnimatePresence>

              {currentMediaIndex <
                posts.images.length + posts.videos.length - 1 && (
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
          )} */}
        </div>

        <div className="p-4">
          <p className="text-lg">{posts.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <div className="flex justify-between space-x-4 w-full">
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={handleLikeClick}>
              <Heart
                className={`h-6 w-6 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button variant="ghost" onClick={openComments}>
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost">
              <Send className="h-6 w-6" />
            </Button>
          </div>

          <Button variant="ghost">
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex justify-between w-full py-4 px-2">
          <span className="cursor-pointer" onClick={openLikes}>
            {likesArray.length} Likes
          </span>
        </div>
      </CardFooter>
      <CommentModal
        isOpen={isCommentsOpen}
        comments={posts.comments}
        onClose={() => setIsCommentsOpen(false)}
        postId={posts.postId}
      />

      <LikesModal
        isOpen={isLikesOpen}
        likes={likesArray}
        onClose={() => setIsLikesOpen(false)}
      />
    </Card>
  );
}
