export type Chat = {
  avatar: string;
  name: string;
  text: string;
  time: number;
  textCount: number;
  color: string;
};

export interface IChat {
  role: 'user' | 'assistant';
  content: string;
  childId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
