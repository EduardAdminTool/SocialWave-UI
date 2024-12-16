export interface Notification {
  notificationId: number;
  userId: number;
  type: string;
  text: string;
  seen: boolean;
  details?: string[];
  createdAt: string;
  updatedAt: string;
}
