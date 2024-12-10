import { FeedProps } from "../types";
import { Comments } from "../types";
import { Likes } from "../types";
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
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

export interface LikesModalProps {
  likes: Likes[];
  isOpen: boolean;
  onClose: () => void;
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
  likes: Likes[];
}

export interface Post {
  postId: number;
  images: PostImages[];
  videos: PostVideo[];
  description: string;
  comments: Comments[];
  createdAt: string;
  likes: Likes[];
}
