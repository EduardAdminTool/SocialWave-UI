import * as React from "react";
import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import { FaComments } from "react-icons/fa";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FaLocationArrow, FaRegSave } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";

export default function Home() {
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
      image: "pozacontent1",
    },
    {
      logo: "poza2",
      name: "Jason Culcat2",
      image: "pozacontent2",
    },
  ];
  return (
    <div className="px-8">
<div className="text-blue-500 min-h-screen">
      <div className="bg-white h-[120px] flex items-center border border-b-black">
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
      <div className="h-screen">
        <div className="bg-white p-4">
          <div className="w-full border-b border-b-black">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-black rounded-full w-[80px] h-[80px] flex items-center justify-center">
                  {post[0].logo}
                </div>
                <div>{post[0].name}</div>
              </div>
              <div>
                <IoIosOptions size={36} />
              </div>
            </div>
          </div>
          <div className="w-full h-auto border-b border-b-black">
            {post[0].image}
          </div>
          <div className="w-full border-b px-4 py-2 border-b-black flex justify-between">
            <div className="flex gap-12">
              <CiHeart size={32} />
              <FaComments size={32} />
              <FaLocationArrow size={32} />
            </div>

            <FaRegSave size={32} />
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );
}
