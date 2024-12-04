export interface SignInProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export interface AccountSearchProps{
  name: string
  userId: number
  profilePicture: string
}
