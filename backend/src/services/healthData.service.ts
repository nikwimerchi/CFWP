import httpStatus from "http-status";
import { supabase } from "../db";
import { HttpException } from "../exceptions/HttpException";
import {
  calculateYearsAndMonths,
  isEmpty,
  returnCHildHealthCondition,
} from "../utils/util";
import { IChild, IChildHealthData } from "../interfaces/child.interface";
import { User } from "../models/users.model";
import { ChildHealthDataDto } from "../dtos/healthData.dto";
import { sendNotification } from "./notifications.service";

/**
 * Register Child Health Data & Calculate Condition
 */
export const registerChildHealthData = async (
  data: ChildHealthDataDto,
  user: User
): Promise<IChildHealthData> => {
  if (isEmpty(data))
    throw new HttpException(httpStatus.BAD_REQUEST, "Invalid data");

  // 1. Check if health data for this specific month/year already exists
  const { data: findData } = await supabase
    .from('child_health_data')
    .select('id')
    .eq('month', data.month)
    .eq('year', data.year)
    .eq('childId', data.childId)
    .single();

  if (findData)
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `This Child health data already exists for the specified date`
    );

  // 2. Fetch Child Details
  const { data: child, error: childError } = await supabase
    .from('children')
    .select('*')
    .eq('id', data.childId)
    .single();

  if (childError || !child)
    throw new HttpException(httpStatus.BAD_REQUEST, `Child not found`);

  // 3. Calculate Age and Fetch Comparative Measurements
  const { years, months } = calculateYearsAndMonths(child.dateOfBirth);

  const { data: measurement, error: measError } = await supabase
    .from('measurements')
    .select('*')
    .eq('age', years)
    .eq('months', months)
    .single();

  if (measError || !measurement)
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `The child is ${years} Years and ${months} Months. No standard growth measurements found for this age. Please contact Admin.`
    );

  // 4. Determine Health Condition (Utility Logic remains the same)
  const { healthCondition, value } = returnCHildHealthCondition(
    data,
    measurement
  );

  // 5. Save the Health Record
  const { data: savedData, error: saveError } = await supabase
    .from('child_health_data')
    .insert([{
      ...data,
      healthCondition,
      conditionValue: value,
      registeredBy: { userId: user.id, role: user.role },
    }])
    .select()
    .single();

  if (saveError) throw new HttpException(500, saveError.message);

  // 6. Notify Parent
  await sendNotification(
    child.parentId,
    "Health data for your child has been recorded",
    `Hello! Please check out the health information for your child ${child.firstName} ${child.lastName}. Condition: ${healthCondition}`
  );

  return savedData;
};

/**
 * Fetch Health History for a Child
 */
export const getHealthData = async (
  childId: string,
  year: number
): Promise<IChildHealthData[]> => {
  if (!childId)
    throw new HttpException(httpStatus.BAD_REQUEST, `Invalid information`);

  const { data, error } = await supabase
    .from('child_health_data')
    .select('*')
    .eq('childId', childId)
    .eq('year', year)
    .order('month', { ascending: true });

  if (error) throw new HttpException(500, error.message);
  
  return data as IChildHealthData[];
};