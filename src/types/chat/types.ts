export interface Chat {
  chatId: number;
  lastMessage: string;
  otherUser: OtherUser;
}

interface OtherUser {
  userId: number;
  profilePicture: string;
  name: string;
}
