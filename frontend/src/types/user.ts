export interface IUser {
  _id: string;
  names: string;
  email: string;
  address: IAddress;
  password: string;
  role: TUserRole;
  isEmailVerified: Boolean;
  phoneNumber: string;
  createdAt: string;
  isVerified: boolean;
  token: string;
}

export type TUserRole = 'admin' | 'advisor' | 'parent';
export interface IAddress {
  district: string;
  province: string;
  cell: string;
  village: string;
  sector: string;
}
