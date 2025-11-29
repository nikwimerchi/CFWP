import httpStatus from "http-status";
import { HttpException } from "../exceptions/HttpException";
import { isEmpty } from "../utils/util";
import { MeasurementDto } from "../dtos/measurement.dto";
import { IMeasurement } from "../interfaces/measurements.interface";
import measurementsModel from "../models/measurements.model";

export const createMeasurement = async (
  data: MeasurementDto
): Promise<IMeasurement> => {
  if (isEmpty(data))
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      "measurement data is empty"
    );

  const findData: IMeasurement = await measurementsModel.findOne({
    age: data.age,
    months: data.months,
  });
  if (findData) {
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `Data already exists, try different age and months`
    );
  }

  const savedData: IMeasurement = await measurementsModel.create(data);

  return savedData;
};

export const getMeasurements = async (): Promise<IMeasurement[]> => {
  const savedData: IMeasurement[] = await measurementsModel.find({});
  return savedData;
};

export const editMeasurement = async (
  data: MeasurementDto,
  id: string
): Promise<IMeasurement> => {
  if (isEmpty(data))
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      "Measurement data is empty"
    );

  const measurement: IMeasurement = await measurementsModel.findOneAndUpdate(
    {
      _id: id,
    },
    data
  );
  if (!measurement)
    throw new HttpException(httpStatus.BAD_REQUEST, `measurement not found`);

  return measurement;
};

export const deleteMeasurement = async (id: string) => {
  await measurementsModel.deleteOne({
    _id: id,
  });
};
