import { Request } from "express";
import { User } from "../models/users.model"; // FIX: Point to the new User model
export interface RequestWithUser extends Request {
  user: User;
}
export interface DataStoredInToken {
  id: string;   // Supabase UUID
  _id?: string; // Optional fallback for old Mongoose tokens
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User; // FIX: Use the new User interface
}