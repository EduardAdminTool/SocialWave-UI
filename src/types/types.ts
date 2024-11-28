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
  description: string;
  createdAt: string;
  updatedAt: string;
  images: PostImages[];
  videos: PostVideo[];
}

export interface SignInProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
