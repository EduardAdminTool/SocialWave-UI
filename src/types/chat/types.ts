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

export interface MessagesProps {
  messages: MessagesType[];
  hasMore: boolean;
  totalMessages: number;
}

export interface MessagesType {
  chatId: number;
  createdAt: string;
  isRead: boolean;
  messageId: number;
  receiverId: number;
  senderId: number;
  text: string;
  updatedAt: string;
}
