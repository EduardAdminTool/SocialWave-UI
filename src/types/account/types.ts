import { Posts } from "../posts/types";

export interface Account {
  userId: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  bio: string;
  profilePicture: string;
  coverPicture: string;
  birthdate: string;
  posts: Posts[];
  followers: FollowersFollowingProps[];
  following: FollowersFollowingProps[];
}

interface FollowersFollowingProps {
  userId: number;
  name: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  isAccepted: boolean;
}
