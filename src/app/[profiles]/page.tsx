"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StoryCarousel } from "@/components/StoryCarousel";
import { Account } from "@/types/account/types";
import { Post } from "@/types/posts/types";
import withAuth from "@/utils/withAuth";
import { Grid, MessageSquare, Bookmark } from "lucide-react";
import { PostModal } from "@/components/PostModal";
import { getUserAccount } from "@/services/account";
import { useSearchParams } from "next/navigation";
import { requestFollow } from "@/services/follow";
import { getUserFollow } from "@/services/follow";
import { deleteRequest } from "@/services/follow";
import { unfollowFollow } from "@/services/follow";
function AccountPage() {
  const searchParams = useSearchParams();
  const [followClicked, setIsFollowClicked] = useState(false);
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);
  const [followRequest, setFollowRequest] = useState("");
  const [error, setError] = useState<string | null>("");
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>("");
  const userId = searchParams?.get("userId");

  const story = [
    { image: "poza", name: "Andrei" },
    { image: "poza1", name: "Matei1" },
  ];

  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    if (requestStatus) {
      const timer = setTimeout(() => setRequestStatus(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  const fetchAccount = async () => {
    setError(null);
    try {
      const fetchedAccount = await getUserAccount(Number(userId));
      setAccountInfo(fetchedAccount);
      const response = await getUserFollow(Number(userId));

      if (response.message === "Not following") setFollowRequest("Follow");
      else if (response.message === "Following") {
        setFollowRequest("Following");
        setRequestStatus(fetchedAccount.name + " has accepted your request");
      } else {
        setFollowRequest("Follow request already sent");
      }
    } catch (err) {
      setError("Nu s-au putut obtine date");
      setFollowRequest("Failed to Follow");
    }
  };

  const handleFollowButton = async () => {
    try {
      if (followRequest === "Follow request already sent") {
        await deleteRequest(Number(userId));
        setFollowRequest("Follow");
      } else if (followRequest === "Following") {
        await unfollowFollow(Number(userId));
        setFollowRequest("Follow");
      } else {
        const response = await requestFollow(Number(userId));
        setFollowRequest("Follow request already sent");
      }
    } catch (err) {
      console.error("Error requesting follow:", err);
    }
    setIsFollowClicked(!followClicked);
  };

  const openPostModal = (post: Post) => {
    setActivePost(post);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      {requestStatus && (
        <div className="flex justify-center items-center text-xl">
          {requestStatus}
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-8">
        <Avatar className="w-32 h-32 md:w-40 md:h-40">
          <AvatarImage
            src={accountInfo?.profilePicture || ""}
            alt="Profile picture"
          />
          <AvatarFallback>{accountInfo?.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-semibold">
              {accountInfo?.name || "Loading..."}
            </h2>
            <Button className="w-auto" onClick={handleFollowButton}>
              {followRequest}
            </Button>
          </div>
          <div className="flex space-x-8">
            <span className="font-medium">
              {accountInfo?.posts?.length || 0} posts
            </span>
            <span className="font-medium">12,521 followers</span>
            <span className="font-medium">700 following</span>
          </div>
          <p className="text-center md:text-left max-w-md">
            {accountInfo?.bio || ""}
          </p>
        </div>
      </div>

      <ScrollArea className="w-full whitespace-nowrap mb-8">
        <div className="flex w-max space-x-4 p-4">
          <StoryCarousel stories={story} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="mb-4 flex justify-center space-x-4">
        <Button variant="ghost" size="sm">
          <Grid className="w-4 h-4 mr-2" /> Posts
        </Button>
        <Button variant="ghost" size="sm">
          <Bookmark className="w-4 h-4 mr-2" /> Saved
        </Button>
        <Button variant="ghost" size="sm">
          <MessageSquare className="w-4 h-4 mr-2" /> Tagged
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {accountInfo?.posts?.map((post, index) => (
          <Card
            key={`post-${index}`}
            className="cursor-pointer"
            onClick={() => openPostModal(post)}
          >
            <CardContent className="p-0 aspect-square relative">
              {post?.images.length > 0 ? (
                <Image
                  src={post.images[0].imageUrl}
                  alt={`Post ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <video
                  className="object-cover w-full h-full"
                  controls
                  src={post.videos[0].videoUrl}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <PostModal
        post={activePost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default withAuth(AccountPage);