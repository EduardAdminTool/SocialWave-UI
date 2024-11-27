export interface Posts {
  postId: number;
  userId: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    avatar: string;
  };
  image: string;
}
