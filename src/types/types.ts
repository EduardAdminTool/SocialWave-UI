export interface SignInProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export interface AccountSearchProps {
  name: string;
  userId: number;
  profilePicture: string;
}

export interface FollowRequestsProps {
  userId: number;
  name: string;
  email: string;
  profilePicture: string;
  createAt: string;
}
