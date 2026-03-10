export type Reminder = {
  id: string;
  personId: string;
  memoId?: string;
  title: string;
  remindAt: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
  notificationId?: string;
};
