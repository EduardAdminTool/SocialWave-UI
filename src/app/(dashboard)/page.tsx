"use client";

import React, { useState, useEffect } from "react";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaComments } from "react-icons/fa";
import Image from "next/image";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FaLocationArrow, FaRegSave } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";
import { StoryCarousel } from "@/components/StoryCarousel";

import { getPosts, deletePost } from "@/services/posts";
import { Posts } from "@/types/types";
import { PostCard } from "@/components/PostCard";
export default function Home() {
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Posts[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError("Nu s-au putut obtine postari");
    }
  };

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

  return (
    <div className="py-4">
      <div className="text-blue-500 min-h-screen">
        <div className="h-[120px] flex items-center bg-gradient-to-b from-blue-100 to-white border rounded-md">
          <div className="flex flex-col justify-start px-8 space-y-2">
            <div
              className="h-16 w-16 flex justify-center items-center rounded-full 
          bg-blue-200"
            >
              Poza
            </div>
            <div className="text-xs font-medium text-blue-800 truncate w-16 text-center">
              Your Story
            </div>
          </div>
          <ScrollArea className="w-128 whitespace-nowrap">
            <div className="flex w-max space-x-4 p-4">
              <StoryCarousel stories={story} />
            </div>
            <ScrollBar orientation="horizontal" className="opacity-0" />
          </ScrollArea>
        </div>
        <div className="min-h-screen py-4 space-y-4">
          {posts.map((item, index) => (
            <PostCard key={item.postId} post={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
