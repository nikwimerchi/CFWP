export interface IChat {
  role: "user" | "assistant";
  content: string;
  childId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
