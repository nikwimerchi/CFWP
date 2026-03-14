import { Response } from "express";
import httpStatus from "http-status";
import { RequestWithUser } from "../interfaces/auth.interface";
import * as healthDataService from "../services/healthData.service";
import { ChildHealthDataDto } from "../dtos/healthData.dto";

// FIX for TS2551: Renamed to registerHealthData to match route expectation
export const registerHealthData = async (req: RequestWithUser, res: Response) => {
  try {
    const data: ChildHealthDataDto = req.body;
    const savedData = await healthDataService.registerChildHealthData(data, req.user);

    res.status(httpStatus.CREATED).json({
      data: savedData,
      message: "Health data recorded successfully",
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

// FIX for TS2769: This MUST take (req, res), not (childId, year)
export const getHealthData = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    const selectedYear = year ? Number(year) : new Date().getFullYear();

    const data = await healthDataService.getHealthData(id, selectedYear);

    res.status(httpStatus.OK).json({ data });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};