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
import { getAccountInfo } from "@/services/account";
import withAuth from "@/utils/withAuth";
import { Grid, MessageSquare, Bookmark, MoreHorizontal } from "lucide-react";
import { PostModal } from "@/components/PostModal";
import { TbLogout } from "react-icons/tb";
import { getStoriesByMe } from "@/services/story";
import { Story } from "@/types/story/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jwt from "jsonwebtoken";
import { FollowersFollowingModal } from "@/components/FollowersFollowingModal";

function AccountPage() {
  const [followClicked, setIsFollowClicked] = useState(false);
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>("");
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowersFollowingModalOpen, setIsFollowersFollowingModalOpen] =
    useState(false);
  const [isPostDeleted, setIsPostDeleted] = useState(false);
  const [modalType, setModalType] = useState<string | null>("");
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    if (isPostDeleted) {
      fetchAccount();
      setIsPostDeleted(false);
    }
  }, [isPostDeleted]);

  useEffect(() => {
    fetchStories();
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

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await getStoriesByMe();
      if (token) {
        try {
          const decodedToken = jwt.decode(token);
          const userIdFromToken = decodedToken?.sub;
          for (let i = 0; i < response.length; i++) {
            if (userIdFromToken === response[i].userId) {
              setStories(response);
            } else {
              console.error(
                "No 'sub' claim in token or it's not a valid number"
              );
            }
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
      setStories(response);
    } catch (err) {
      console.log(err);
    }
  };

  const openPostModal = (post: Post) => {
    setActivePost(post);
    setIsModalOpen(true);
  };

  const openFollowersFollowingModal = (type: string) => {
    if (type === "Followers") {
      setModalType("Followers");
    } else if (type === "Following") {
      setModalType("Following");
    }
    setIsFollowersFollowingModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    location.reload();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-8">
        <Avatar className="w-32 h-32 md:w-40 md:h-40">
          <AvatarImage
            src={accountInfo?.profilePicture || ""}
            alt="Profile picture"
          />
          <AvatarFallback>{accountInfo?.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold">
              {accountInfo?.name || "Loading..."}
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <TbLogout className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex space-x-8">
            <span className="font-medium">
              {accountInfo?.posts?.length || 0} posts
            </span>
            <span
              className="font-medium cursor-pointer"
              onClick={() => openFollowersFollowingModal("Followers")}
            >
              {accountInfo?.followers.length} Followers
            </span>
            <span
              className="font-medium cursor-pointer"
              onClick={() => openFollowersFollowingModal("Following")}
            >
              {accountInfo?.following.length} Following
            </span>
          </div>
          <p className="text-center md:text-left max-w-md">
            {accountInfo?.bio || ""}
          </p>
        </div>
      </div>

      <ScrollArea className="w-full whitespace-nowrap mb-8">
        <div className="flex w-max space-x-4 p-4">
          <StoryCarousel
            stories={stories}
            type={"account"}
            setStories={setStories}
          />
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
                  src={String(post.images[0])}
                  alt={`Post ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <video
                  className="object-cover w-full h-full"
                  controls
                  src={String(post.videos[0])}
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
        userId={accountInfo?.userId!}
        name={accountInfo?.name!}
        profilePicture={accountInfo?.profilePicture!}
      />

      {modalType === "Followers" ? (
        <FollowersFollowingModal
          type={"Followers"}
          FollowersFollowing={accountInfo?.followers || []}
          isOpen={isFollowersFollowingModalOpen}
          onClose={() => setIsFollowersFollowingModalOpen(false)}
        />
      ) : (
        <FollowersFollowingModal
          type={"Following"}
          FollowersFollowing={accountInfo?.following || []}
          isOpen={isFollowersFollowingModalOpen}
          onClose={() => setIsFollowersFollowingModalOpen(false)}
        />
      )}
    </div>
  );
}

export default withAuth(AccountPage);
