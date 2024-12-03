"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import withAuth from "@/utils/withAuth";
function Search() {
  const posts = [
    {
      index: 1,
      type: "img",
    },
    {
      index: 2,
      type: "video",
    },
    {
      index: 3,
      type: "img",
    },
    {
      index: 4,
      type: "img",
    },
    {
      index: 5,
      type: "img",
    },
    {
      index: 6,
      type: "img",
    },
    {
      index: 7,
      type: "video",
    },
    {
      index: 8,
      type: "img",
    },
    {
      index: 9,
      type: "img",
    },
    {
      index: 10,
      type: "video",
    },
    {
      index: 11,
      type: "img",
    },
    {
      index: 12,
      type: "video",
    },
    {
      index: 13,
      type: "img",
    },
    {
      index: 14,
      type: "video",
    },
    {
      index: 15,
      type: "img",
    },
    {
      index: 16,
      type: "img",
    },
  ];

  return (
    <div className="grid grid-cols-4">
      {posts.map((item) => (
        <Card className="w-auto" key={item.index}>
          <CardContent className="p-0">
            <div className="relative w-full h-64">
              {" "}
              <Image
                src={"/post.jpg"}
                alt="Public Image"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default withAuth(Search);
