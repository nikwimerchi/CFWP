// src/models/chats.model.ts

export interface Chat {
  id?: string;               // UUID from Supabase (optional on create)
  role: 'user' | 'assistant';
  content: string;
  childId: string;           // UUID string
  userId: string;            // UUID string
  created_at?: string;       // Supabase default timestamp
  updated_at?: string;
}

// Export a placeholder or type if your services still 
// look for "chatModel", but ideally, you'll call Supabase directly.
export type ChatModel = Chat;