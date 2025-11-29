import { IAddress, IUser } from "./users.interface";

export interface IChild {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  address: IAddress;
  parentId: string;
  sex: string;
  status: "pending" | "approved" | "rejected";
  registeredBy: {
    userId: string;
    role: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IChildWithParent extends IChild {
  parent: IUser;
}

export interface IChildHealthData {
  _id: string;
  childId: string;
  date: string;
  month: number;
  year: number;
  width: number;
  weight: number;
  height: number;
  parentId: string;
  healthCondition: THealthCondition;
  conditionValue: number;
  registeredBy: {
    userId: string;
    role: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type THealthCondition = "yellow" | "red" | "green";
