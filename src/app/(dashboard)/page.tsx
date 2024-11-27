"use client";

import React, { useState, useEffect } from "react";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaComments } from "react-icons/fa";
import Image from "next/image";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FaLocationArrow, FaRegSave } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";

import { getPosts } from "@/services/posts";
import { Posts } from "@/types/types";
export default function Home() {
  const [isLiked, setIsLiked] = useState(false);
  const [postedAgo, setPostedAgo] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Posts[]>([]);

  useEffect(() => {
    fetchPosts();
  });
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

  const post = [
    {
      logo: "poza1",
      name: "Jason Culcat",
      image: "/post.jpg",
      date: "2024-11-27T10:53:00",
    },
  ];

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const calculateDateDifference = (dateString: string) => {
    const today = new Date();
    const itemDate = new Date(dateString);

    const isToday = today.toDateString() === itemDate.toDateString();
    const diffMs = today.getTime() - itemDate.getTime();

    if (isToday) {
      const diffSeconds = Math.floor(diffMs / 1000);
      if (diffSeconds < 60) {
        return diffSeconds === 1
          ? "1 second ago"
          : `${diffSeconds} seconds ago`;
      }

      const diffMinutes = Math.floor(diffSeconds / 60);
      if (diffMinutes < 60) {
        return diffMinutes === 1
          ? "1 minute ago"
          : `${diffMinutes} minutes ago`;
      }

      const diffHours = Math.floor(diffMinutes / 60);
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }

    const differenceDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

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
    const updatedPostedAgo = post.map((p) => calculateDateDifference(p.date));
    setPostedAgo(updatedPostedAgo);
  };

  useEffect(() => {
    updatePostTimes();

    const intervalId = setInterval(() => {
      updatePostTimes();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="py-8">
      <div className="text-blue-500 min-h-screen px-8">
        <div className="bg-white h-[120px] flex items-center border border-black">
          <div className="flex flex-col justify-start px-8">
            <div className="rounded-full bg-black h-[80px] w-[80px] flex justify-center items-center">
              Poza
            </div>
            <div>Your Story</div>
          </div>
          <ScrollArea className="w-128 whitespace-nowrap">
            <div className="flex w-max space-x-4 p-4 ">
              {story.map((story) => (
                <div
                  key={story.name}
                  className="flex flex-col justify-center items-center"
                >
                  <div className="rounded-full bg-black h-[80px] w-[80px] flex justify-center items-center">
                    {story.image}
                  </div>
                  <div>{story.name}</div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="opacity-0" />
          </ScrollArea>
        </div>
        <div className="min-h-screen py-4 space-y-4">
          {posts.map((item, index) => (
            <div className="bg-white p-4 border border-black" key={item.userId}>
              <div className="w-full">
                <div className="p-4 flex items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-black rounded-full w-[80px] h-[80px] flex items-center justify-center">
                      {post[0].logo}
                    </div>
                    <div>{post[0].name}</div>
                    <div className="px-4 font-semibold">
                      {postedAgo[index]}{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-auto p-4">
                <Image
                  src={post[0].image}
                  alt="Public Image"
                  width={500}
                  height={500}
                  objectFit="cover"
                />
              </div>

              <div>{item.description}</div>
              <div className="w-full border-b px-4 py-2 border-b-black flex justify-between">
                <div className="flex gap-12">
                  <div className="cursor-pointer" onClick={handleLikeClick}>
                    {isLiked ? (
                      <AiFillHeart size={32} color="red" />
                    ) : (
                      <AiOutlineHeart size={32} color="black" />
                    )}
                  </div>
                  <FaComments size={32} />
                  <FaLocationArrow size={32} />
                </div>

                <FaRegSave size={32} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
