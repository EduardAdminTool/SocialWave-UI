"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StoryCarousel } from "@/components/StoryCarousel";
import { getFeed } from "@/services/feed";
import { FeedProps } from "@/types/types";
import { PostCard } from "@/components/PostCard";
import withAuth from "@/utils/withAuth";

function Home() {
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<FeedProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedPosts = await getFeed(page);

      if (fetchedPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      }
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!isLoading && hasMore) {
      fetchPosts();
    }
  }, [page]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight &&
      !isLoading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isLoading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const story = [
    { image: "poza", name: "Andrei" },
    { image: "poza1", name: "Matei1" },
  ];

  return (
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
          <PostCard key={`${item.id}-${index}`} posts={item} />
        ))}

        {isLoading && (
          <div className="text-center text-blue-500">Loading more posts...</div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center text-gray-500">No more posts to load</div>
        )}

        {error && (
          <div className="text-center text-red-500">
            {error}
            <button
              onClick={() => {
                setPage(1);
                setPosts([]);
                setHasMore(true);
                fetchPosts();
              }}
              className="ml-2 text-blue-500 underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(Home);
