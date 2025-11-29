import httpStatus from "http-status";
import { HttpException } from "../exceptions/HttpException";
import {
  calculateYearsAndMonths,
  isEmpty,
  returnCHildHealthCondition,
} from "../utils/util";
import { IChild, IChildHealthData } from "../interfaces/child.interface";
import childModel from "../models/child.model";
import { IUser } from "../interfaces/users.interface";
import { ChildHealthDataDto } from "../dtos/healthData.dto";
import childHealthDataModel from "../models/childHealthData.model";
import measurementsModel from "../models/measurements.model";
import { sendNotification } from "./notifications.service";

export const registerChildHealthData = async (
  data: ChildHealthDataDto,
  user: IUser
): Promise<IChildHealthData> => {
  if (isEmpty(data))
    throw new HttpException(httpStatus.BAD_REQUEST, "Invalid data");
  const findData: IChildHealthData = await childHealthDataModel.findOne({
    month: data.month,
    year: data.year,
    childId: data.childId,
  });
  if (findData)
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `This Child health data already exist on specified date`
    );

  const child: IChild = await childModel.findOne({ _id: data.childId });
  if (!child)
    throw new HttpException(httpStatus.BAD_REQUEST, `Child not found`);

  //child ages
  const { years, months } = calculateYearsAndMonths(child.dateOfBirth);

  //get measurements
  const measurement = await measurementsModel.findOne({ age: years, months });

  if (!measurement)
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `The child is ${years} Years and ${months} Months and we dont have any measurements to follow while deciding child's health condition. Please contact admin to add measurement data for this case.`
    );

  const { healthCondition, value } = returnCHildHealthCondition(
    data,
    measurement
  );

  const savedData: IChildHealthData = await childHealthDataModel.create({
    ...data,
    healthCondition,
    conditionValue: value,
    registeredBy: { userId: user._id, role: user.role },
  });

  await sendNotification(
    child.parentId,
    "Health data for your child has been recorded",
    `Hello! Please checkout health information for your child ${child.firstName} ${child.lastName}`
  );

  return savedData;
};

export const getHealthData = async (
  childId: string,
  year: number
): Promise<IChildHealthData[]> => {
  if (!childId)
    throw new HttpException(httpStatus.BAD_REQUEST, `Invalid information`);

  const data: IChildHealthData[] = await childHealthDataModel.find({
    childId,
    year,
  });
  return data;
};
