// src/models/child.model.ts

export interface Child {
  id: string; // Supabase UUID
  firstName: string;
  lastName: string;
  middleName?: string;
  age: number;
  sex: 'male' | 'female';
  dateOfBirth?: string;
  address: {
    district: string;
    province: string;
    cell: string;
    sector: string;
    village: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  parentId: string; // UUID
  registeredBy: {
    userId: string; // UUID
    role: string;
  };
  created_at?: string;
  updated_at?: string;
}