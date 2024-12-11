export interface Chat {
  chatId: number;
  lastMessage: LastMessage;
  otherUser: OtherUser;
}

interface LastMessage {
  text: string;
  createdAt: string;
  senderId: number;
  sentBy: string;
}
interface OtherUser {
  userId: number;
  profilePicture: string;
  name: string;
}
