// src/models/chats.model.ts

export type TChatRole = "user" | "assistant";

export interface Chat {
  id?: string;               // Supabase primary key (uuid)
  role: TChatRole;
  content: string;
  childId: string;           // Foreign key to children table
  userId: string;            // Foreign key to users table (the sender)
  createdAt?: string;        // Maps to created_at in DB
  updatedAt?: string;        // Maps to updated_at in DB
}