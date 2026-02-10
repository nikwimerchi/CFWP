import httpStatus from "http-status";
import { supabase } from "../db";
import { HttpException } from "../exceptions/HttpException";
import { isEmpty } from "../utils/util";
import { MeasurementDto } from "../dtos/measurement.dto";
import { IMeasurement } from "../interfaces/measurements.interface";

/**
 * Create a new Measurement Standard
 */
export const createMeasurement = async (
  data: MeasurementDto
): Promise<IMeasurement> => {
  if (isEmpty(data))
    throw new HttpException(httpStatus.BAD_REQUEST, "measurement data is empty");

  // Check if standard for this age/month combo already exists
  const { data: findData } = await supabase
    .from('measurements')
    .select('id')
    .eq('age', data.age)
    .eq('months', data.months)
    .single();

  if (findData) {
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `Reference data for ${data.age} years and ${data.months} months already exists.`
    );
  }

  const { data: savedData, error } = await supabase
    .from('measurements')
    .insert([data])
    .select()
    .single();

  if (error) throw new HttpException(500, error.message);
  return savedData as IMeasurement;
};

/**
 * Get all Measurement Standards
 */
export const getMeasurements = async (): Promise<IMeasurement[]> => {
  const { data, error } = await supabase
    .from('measurements')
    .select('*')
    .order('age', { ascending: true })
    .order('months', { ascending: true });

  if (error) throw new HttpException(500, error.message);
  return data as IMeasurement[];
};

/**
 * Edit an existing Measurement Standard
 */
export const editMeasurement = async (
  data: MeasurementDto,
  id: string
): Promise<IMeasurement> => {
  if (isEmpty(data))
    throw new HttpException(httpStatus.BAD_REQUEST, "Measurement data is empty");

  const { data: measurement, error } = await supabase
    .from('measurements')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error || !measurement)
    throw new HttpException(httpStatus.BAD_REQUEST, `Measurement standard not found`);

  return measurement as IMeasurement;
};

/**
 * Delete a Measurement Standard
 */
export const deleteMeasurement = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('measurements')
    .delete()
    .eq('id', id);

  if (error) throw new HttpException(500, "Could not delete measurement data");
};