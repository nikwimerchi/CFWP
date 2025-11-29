import { IAddress, IUser, TUserRole } from './user';

export interface IChild {
  _id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  age: number;
  sex: string;
  dateOfBirth: string;
  status: TChildStatus;
  address: IAddress;
  registeredBy: IRegisteredBy;
  parentId: string;
  createdAt: string;
}

export type TChildStatus = 'pending' | 'approved' | 'rejected';

export interface IRegisteredBy {
  userId: string;
  role: TUserRole;
}

export interface IChildWithParent extends IChild {
  parent: IUser;
}
