export interface PostCardProps {
  post: Posts;
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

export interface Posts {
  postId: number;
  userId: number;
  profilePicture: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  images: PostImages[];
  videos: PostVideo[];
}

export interface Post {
  postId: number;
  images: PostImages[];
  videos : PostVideo[];
  description: string;
  // likes: number;
  // comments: string;
  createdAt: string;
}
