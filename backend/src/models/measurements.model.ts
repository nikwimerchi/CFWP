// src/models/measurements.model.ts

export interface Measurement {
  id: string;              // UUID from Supabase
  age: number;
  months: number;
  redHeight: number;
  yellowHeight: number;
  greenHeight: number;
  redWeight: number;
  yellowWeight: number;
  greenWeight: number;
  redWidth: number;
  yellowWidth: number;
  greenWidth: number;
  created_at?: string;
  updated_at?: string;
}