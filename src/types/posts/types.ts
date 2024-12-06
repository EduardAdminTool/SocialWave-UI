import { FeedProps } from "../types";
export interface PostCardProps {
  posts: FeedProps;
}

interface PostImages {
  imagePostId: number;
  postId: number;
  imageUrl: string;
}

interface PostVideo {
  videoPostId: number;
  postId: number;
  videoUrl: string;
}

export interface Comments {
  commentId: number;
  parentId: number;
  postId: number;
  userId: number;
  text: string;
  createAt: string;
}

export interface Posts {
  postId: number;
  userId: number;
  profilePicture: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  images: PostImages[];
  videos: PostVideo[];
  name?: string;
  comments: Comments[];
}

export interface Post {
  postId: number;
  images: PostImages[];
  videos: PostVideo[];
  description: string;
  // likes: number;
  comments: Comments[];
  createdAt: string;
}
