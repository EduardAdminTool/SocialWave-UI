"use client";

import React, { useState, useEffect } from "react";
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
  const [firstFetch, setFirstFetch] = useState<boolean>(true);
  const [previousPosts, setPreviousPosts] = useState<FeedProps[]>([]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedPosts = await getFeed(page);

      if (page === 1) {
        setPosts(fetchedPosts);
      } else {
        const newPosts = fetchedPosts.filter(
          (post: FeedProps) =>
            !posts.some((existingPost) => existingPost.postId === post.postId)
        );

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        }
      }

      setPreviousPosts(fetchedPosts);

      if (firstFetch) {
        setFirstFetch(false);
      }
    } catch (err) {
      setError("Nu s-au putut obtine postari");
    } finally {
      setIsLoading(false);
    }
  };

  const story = [
    { image: "poza", name: "Andrei" },
    { image: "poza1", name: "Matei1" },
  ];

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      hasMore &&
      !isLoading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, [hasMore, isLoading]);

  return (
    <div>
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
          {posts.length > 0 ? (
            posts.map((item) => <PostCard key={item.postId} posts={item} />)
          ) : (
            <div></div>
          )}
          {isLoading && <div className="text-center">Loading...</div>}
          {!hasMore && !firstFetch && (
            <div className="text-center text-gray-500">
              No more posts to load
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(Home);
