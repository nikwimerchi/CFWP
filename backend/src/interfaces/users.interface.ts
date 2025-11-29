export interface IUser {
  _id: string;
  names: string;
  email: {
    type: String;
    required: true;
    unique: true;
  };
  address: IAddress;
  password: string;
  phoneNumber: string;
  role: TUserRole;
  isVerified: boolean; //admin aproval
  isEmailVerified: Boolean;
  verificationToken: string;
  createdAt: string;
  updatedAt: string;
}

export type TUserRole = "admin" | "advisor" | "parent";
export interface IAddress {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}
