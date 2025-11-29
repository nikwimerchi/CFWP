export interface IMeasurement {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
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

export type THealthCondition = 'yellow' | 'red' | 'green';
