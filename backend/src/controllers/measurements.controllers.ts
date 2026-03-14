import { Response } from "express";
import httpStatus from "http-status";
import * as measurementService from "../services/measurements.service";
import { RequestWithUser } from "../interfaces/auth.interface";
import { MeasurementDto } from "../dtos/measurement.dto";

export const createMeasurement = async (
  req: RequestWithUser, 
  res: Response
) => {
  try {
    const data: MeasurementDto = req.body;
    const savedData = await measurementService.createMeasurement(data);
    
    return res
      .status(httpStatus.CREATED)
      .json({ data: savedData, message: "Measurement added!" });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const getMeasurements = async (req: RequestWithUser, res: Response) => {
  try {
    const measurements = await measurementService.getMeasurements();
    
    // Updated to OK (200) for a standard GET request
    return res.status(httpStatus.OK).json({ measurements });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const editMeasurement = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params; // Ensure this is a UUID string for Supabase
    const data: MeasurementDto = req.body;
    
    const savedData = await measurementService.editMeasurement(data, id);
    
    return res
      .status(httpStatus.OK)
      .json({ data: savedData, message: "Measurement updated!" });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const deleteMeasurement = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const { id } = req.params;
    await measurementService.deleteMeasurement(id);
    
    return res.status(httpStatus.OK).json({ message: "Measurement deleted!" });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};