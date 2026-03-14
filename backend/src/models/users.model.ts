// src/models/users.model.ts

export type TUserRole = "admin" | "advisor" | "parent";

export interface IAddress {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

export interface User {
  id: string;               // Replaces _id for Supabase
  names: string;
  email: string;            // Simplified from the object type
  address: IAddress;
  password?: string;        // Optional so we don't always send the hash
  phoneNumber: string;
  role: TUserRole;
  isVerified: boolean;
  isEmailVerified: boolean;
  verificationToken?: string;
  createdAt?: string;       // Matches the "missing" error in your screenshot
  updatedAt?: string;       // Matches the "missing" error in your screenshot
}