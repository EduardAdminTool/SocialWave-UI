"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StoryCarousel } from "@/components/StoryCarousel";
import { getFeed } from "@/services/feed";
import { FeedProps } from "@/types/types";
import { PostCard } from "@/components/PostCard";
import withAuth from "@/utils/withAuth";
import { Story } from "@/types/story/types";
import { getStories } from "@/services/story";

function Home() {
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<FeedProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const fetchedPagesRef = useRef<Set<number>>(new Set());
  const firstLoadRef = useRef(true);
  const [stories, setStories] = useState<Story[]>([]);

  const fetchPosts = useCallback(
    async (page: number) => {
      if (isLoading || fetchedPagesRef.current.has(page) || !hasMore) return;
      setIsLoading(true);
      setError(null);

      try {
        const fetchedPosts = await getFeed(page);

        if (fetchedPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
          fetchedPagesRef.current.add(page);
        }
      } catch (err) {
        setError("Failed to fetch posts");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore]
  );

  const fetchStories = useCallback(async () => {
    try {
      const response = await getStories();
      console.log("Stories fetched:", response);

      setStories(response);
      console.log("Stories set:", stories);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      return [];
    }
  }, []);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            !isLoading &&
            hasMore &&
            !fetchedPagesRef.current.has(currentPage + 1)
          ) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        },
        {
          rootMargin: "200px",
        }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, currentPage]
  );

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      fetchPosts(1);
    }
  }, [fetchPosts]);

  useEffect(() => {
    if (currentPage > 1 && !fetchedPagesRef.current.has(currentPage)) {
      fetchPosts(currentPage);
    }
  }, [currentPage, fetchPosts]);

  return (
    <div className="text-blue-500 min-h-screen">
      <div className="h-[120px] flex items-center bg-gradient-to-b from-blue-100 to-white border rounded-md">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-4">
            <StoryCarousel stories={stories} />
          </div>
          <ScrollBar orientation="horizontal" className="opacity-0" />
        </ScrollArea>
      </div>
      <div className="min-h-screen py-4 space-y-4">
        {posts.map((item, index) => {
          if (index === posts.length - 1) {
            return (
              <div ref={lastPostRef} key={`${index}`}>
                <PostCard posts={item} />
              </div>
            );
          }
          return <PostCard key={`${index}`} posts={item} />;
        })}
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
                setCurrentPage(1);
                setPosts([]);
                setHasMore(true);
                fetchedPagesRef.current.clear();
                fetchPosts(1);
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
