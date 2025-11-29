import { Response } from "express";
import httpStatus from "http-status";
import * as healtDataService from "../services/healthData.service";
import { RequestWithUser } from "../interfaces/auth.interface";
import { ChildHealthDataDto } from "../dtos/healthData.dto";
import { IChildHealthData } from "../interfaces/child.interface";

export const registerHealthData = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const data: ChildHealthDataDto = req.body;
    const savedData: IChildHealthData =
      await healtDataService.registerChildHealthData(data, req.user);

    res.status(httpStatus.CREATED).json({
      data: savedData,
      message: "Child HealthData has been recorded",
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const getHealthData = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    const y = year ? Number(year) : new Date().getFullYear();
    const data = await healtDataService.getHealthData(id, y);

    res.status(httpStatus.CREATED).json({
      data,
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};
