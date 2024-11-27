import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import * as React from "react"
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AccountPage() {
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
  ]
  return (
    <div className="py-2">
      <div className="grid grid-cols-2 h-[300px]">
        <div className="flex justify-center items-center">
        <div className="bg-black w-[280px] h-[280px] rounded-full flex justify-center items-center">
          Account Photo
        </div>
        </div>
        <div className="py-8 flex flex-col">
          <div className="flex gap-4 items-center">
            <span className="text-3xl font-light">Account</span>
            <button className="bg-black text-white rounded-full w-[80px] h-[40px]">Follow</button>
          </div>
          <div className="flex gap-12 py-4 text-xl">
            <span>12 Posts</span>
            <span>12.521 Followers</span>
            <span>700 Following</span>
          </div>
          <div className="py-8 text-xl font-light">
            <span>Descrierea contului</span>
          </div>
        </div>
      </div>
      <div className="border border-black py-4 px-8 flex">
        <ScrollArea className="w-128 whitespace-nowrap">
          <div className="flex w-max space-x-4 p-4 gap-4">
            {story.map((item) => (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-black rounded-full w-[80px] h-[80px] flex justify-center items-center text-white">
                  {item.image}
                </div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="opacity-0" />
        </ScrollArea>
      </div>
      <div className="grid grid-cols-3 p-4 gap-4">
        {posts.map((item) => (
          <Card className="w-auto">
          <CardContent>
            <Image
                src={item.photo}
                alt="Public Image"
                width={800} 
                height={600}    
                objectFit="cover"         
            />
          </CardContent>
        </Card>
        ))}
      </div>
    </div>
  );
}
