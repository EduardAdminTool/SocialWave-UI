import { FeedProps } from "../types";
import { Comments } from "../types";
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

export interface CommentModalProps {
  comments: Comments[];
  profilePicture: string;
  name: string;
  isOpen: boolean;
  onClose: () => void;
  postId: number;
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
