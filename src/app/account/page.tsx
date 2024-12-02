"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StoryCarousel } from "@/components/StoryCarousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Posts } from "@/types/posts/types";
import { Account } from "@/types/account/types";
import { getPostsById, getPosts } from "@/services/posts";
import { getAccountInfo } from "@/services/account";

export default function AccountPage() {
  const [followClicked, setIsFollowClicked] = useState(false);
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activePostIndex, setActivePostIndex] = useState<number | null>(null); // Track which post is being viewed

  const story = [
    {
      image: "poza",
      name: "Andrei",
    },
    {
      image: "poza1",
      name: "Matei1",
    },
    {
      image: "poza1",
      name: "Matei2",
    },
    {
      image: "poza1",
      name: "Matei3",
    },
    {
      image: "poza1",
      name: "Matei4",
    },
    {
      image: "poza1",
      name: "Matei5",
    },
    {
      image: "poza1",
      name: "Matei6",
    },
    {
      image: "poza1",
      name: "Matei7",
    },
    {
      image: "poza1",
      name: "Matei8",
    },
    {
      image: "poza1",
      name: "Matei9",
    },
    {
      image: "poza1",
      name: "Matei91",
    },
    {
      image: "poza1",
      name: "Matei92",
    },
    {
      image: "poza1",
      name: "Matei93",
    },
    {
      image: "poza1",
      name: "Matei94",
    },
    {
      image: "poza1",
      name: "Matei95",
    },
    {
      image: "poza1",
      name: "Matei96",
    },
    {
      image: "poza1",
      name: "Matei79",
    },
    {
      image: "poza1",
      name: "Matei97",
    },
    {
      image: "poza1",
      name: "Matei98",
    },
    {
      image: "poza1",
      name: "Matei99",
    },
    {
      image: "poza1",
      name: "Matei988",
    },
    {
      image: "poza1",
      name: "Matei932",
    },
  ];

  useEffect(() => {
    fetchAccount();
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

  const handleFollowButton = () => {
    setIsFollowClicked(!followClicked);
  };

  const nextImage = () => {
    if (activePostIndex !== null && accountInfo?.posts) {
      const images = accountInfo.posts[activePostIndex]?.images || [];
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    }
  };

  const prevImage = () => {
    if (activePostIndex !== null && accountInfo?.posts) {
      const images = accountInfo.posts[activePostIndex]?.images || [];
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    }
  };

  return (
    <div className="py-2">
      {/* Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center items-center">
          <Avatar className="w-64 h-64">
            <AvatarImage
              src={accountInfo?.profilePicture || ""}
              alt="Profile picture"
            />
            <AvatarFallback>
              {accountInfo?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-semibold text-blue-800">
              {accountInfo?.name || "Loading..."}
            </h2>
            <Button
              variant={followClicked ? "outline" : "default"}
              className="w-24"
              onClick={handleFollowButton}
            >
              {followClicked ? "Following" : "Follow"}
            </Button>
          </div>
          <div className="flex gap-8 text-lg text-blue-600">
            <span className="font-medium">12 Posts</span>
            <span className="font-medium">12,521 Followers</span>
            <span className="font-medium">700 Following</span>
          </div>
          <p className="text-xl text-gray-600">{accountInfo?.bio || ""}</p>
        </div>
      </div>

      <div className="border-b border-t border-black flex">
        <ScrollArea className="w-128 whitespace-nowrap">
          <div className="flex w-max">
            <StoryCarousel stories={story} />
          </div>
          <ScrollBar orientation="horizontal" className="opacity-0" />
        </ScrollArea>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4 gap-4">
        {accountInfo?.posts?.map((item, postIndex) =>
          item.images?.length > 0 ? (
            <Card
              className="w-auto"
              key={`post-${postIndex}`}
              onClick={() => setActivePostIndex(postIndex)} // Set active post on click
            >
              <CardContent className="p-0">
                <div className="relative w-full h-[500px]">
                  <div className="flex justify-center items-center relative">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevImage}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10"
                    >
                      &lt;
                    </Button>

                    <div className="relative w-full flex justify-center h-[500px] overflow-hidden">
                      <Image
                        src={item.images[currentImageIndex].imageUrl}
                        alt={`Post image ${currentImageIndex + 1}`}
                        width={800}
                        height={500}
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10"
                    >
                      &gt;
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-auto" key={`post-${postIndex}-no-image`}>
              <CardContent className="p-4">
                <p>No images available for this post</p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
