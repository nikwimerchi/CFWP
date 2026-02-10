// src/models/childHealthData.model.ts

export interface ChildHealthData {
  id?: string;               // UUID primary key (auto-generated)
  child_id: string;          // UUID reference to children table
  measurement_date: string;  // ISO string or Date
  month: number;
  year: number;
  width: number;             // MUAC (Middle Upper Arm Circumference)
  weight: number;
  height: number;
  health_condition: 'red' | 'yellow' | 'green';
  condition_value: number;
  registered_by: {
    user_id: string;         // UUID of the advisor/doctor
    role: string;
  };
  created_at?: string;
  updated_at?: string;
}