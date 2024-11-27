"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import React, { useState } from "react";
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

export default function AccountPage() {
  const [followClicked, setIsFollowClicked] = useState(false);
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

  const posts = [
    {
      photo: "/post.jpg",
    },
    {
      photo: "/post.jpg",
    },
    {
      photo: "/post.jpg",
    },
    {
      photo: "/post.jpg",
    },
  ];

  const handleFollowButton = () => {
    setIsFollowClicked(!followClicked);
  };
  return (
    <div className="py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center items-center">
          <Avatar className="w-64 h-64">
            <AvatarImage src="/post.jpg" alt="Profile picture" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-semibold text-blue-800">Account</h2>
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
          <p className="text-xl text-gray-600">Descrierea contului</p>
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
      <div className="grid grid-cols-3 p-4 gap-4">
        {posts.map((item, index) => (
          <Card className="w-auto" key={index}>
            <CardContent className="p-0">
              <div className="relative w-full h-64">
                {" "}
                <Image
                  src={item.photo}
                  alt="Public Image"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
