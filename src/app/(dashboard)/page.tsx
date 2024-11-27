"use client";

import React, { useState } from "react";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaComments } from "react-icons/fa";
import Image from "next/image";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FaLocationArrow, FaRegSave } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";

export default function Home() {
  const [isLiked, setIsLiked] = useState(false);
  const [postedAgo, setPostedAgo] = useState("");
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
      date: "2024-11-27T10:42:55",
    },
    {
      logo: "poza2",
      name: "Jason Culcat2",
      image: "/post.jpg",
      date: "2024-10-01T15:30:00",
    },
  ];

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const calculateDateDifference = (dateString: string) => {
    const today = new Date();
    const itemDate = new Date(dateString);

    const isToday = today.toDateString() === itemDate.toDateString();

    if (isToday) {
      const diffMs = today.getTime() - itemDate.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffMinutes < 60) {
        return diffMinutes === 1
          ? "1 minute ago"
          : `${diffMinutes} minutes ago`;
      }

      const diffHours = Math.floor(diffMinutes / 60);
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }

    const differenceMs = today.getTime() - itemDate.getTime();
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

    if (differenceDays >= 30) {
      const differenceMonths = Math.floor(differenceDays / 30);
      return differenceMonths === 1
        ? "1 month ago"
        : `${differenceMonths} months ago`;
    }

    return differenceDays === 1 ? "1 day ago" : `${differenceDays} days ago`;
  };
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
          {post.map((item) => (
            <div className="bg-white p-4 border border-black" key={item.name}>
              <div className="w-full">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-black rounded-full w-[80px] h-[80px] flex items-center justify-center">
                      {item.logo}
                    </div>
                    <div>{item.name}</div>
                  </div>
                  <div>
                    <IoIosOptions size={36} />
                  </div>
                </div>
              </div>
              <div className="w-full h-auto p-4">
                <Image
                  src={item.image}
                  alt="Public Image"
                  width={500}
                  height={500}
                  objectFit="cover"
                />
              </div>
              <div className="px-4 font-semibold">
                {calculateDateDifference(item.date)}
              </div>
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
