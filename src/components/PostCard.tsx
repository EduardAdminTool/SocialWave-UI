import { useEffect, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PostCardProps } from "@/types/posts/types";
import { deletePost } from "@/services/posts";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Posts } from "@/types/types";

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [postedAgo, setPostedAgo] = useState<string>("");

  const handleLikeClick = () => setIsLiked(!isLiked);

  const handleDeletePost = async (postId: number) => {
    await deletePost(postId);
  };

  const calculateDateDifference = (dateString: string) => {
    const today = new Date();
    const itemDate = new Date(dateString);

    const diffMs = today.getTime() - itemDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffSeconds < 60) {
      return diffSeconds === 1 ? "1 second ago" : `${diffSeconds} seconds ago`;
    }

    if (diffMinutes < 60) {
      return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    }

    if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }

    const differenceDays = Math.floor(diffHours / 24);
    if (differenceDays < 30) {
      return differenceDays === 1 ? "1 day ago" : `${differenceDays} days ago`;
    }

    const differenceMonths = Math.floor(differenceDays / 30);
    if (differenceMonths >= 6) {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return itemDate.toLocaleDateString("en-US", options);
    }

    return differenceMonths === 1
      ? "1 month ago"
      : `${differenceMonths} months ago`;
  };

  const updatePostTimes = () => {
    const updatedPostedAgo = calculateDateDifference(post.createdAt);
    setPostedAgo(updatedPostedAgo);
  };

  useEffect(() => {
    updatePostTimes();

    const intervalId = setInterval(() => {
      updatePostTimes();
    }, 1);

    return () => {
      clearInterval(intervalId);
    };
  }, [post]);

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
        <div className="relative w-full overflow-x-auto flex items-center space-x-4 py-4">
          {post.images?.map((imageUrl, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-[500px] relative"
            >
              <Image
                src={imageUrl.imageUrl}
                alt={`Post image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg p-4"
              />
            </div>
          ))}
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
