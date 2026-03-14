import nodemailer from "nodemailer";
import { SMTP_EMAIL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT } from "../config";
import { THealthCondition } from "../interfaces/child.interface";
import { ChildHealthDataDto } from "../dtos/healthData.dto";
import { IMeasurement } from "../interfaces/measurements.interface";

/**
 * @method isEmpty
 * @description Robust check for empty strings, objects, or null values.
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (typeof value === "object" && !Object.keys(value).length) return true;
  return false;
};

/**
 * @method sendEmail
 * @description Handles SMTP communication for verification and credentials.
 */
export const sendEmail = async (
  subject: string,
  to: string,
  htmlMessage: string
): Promise<{ sent: boolean; details: any }> => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // True for 465, false for 587
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    const response = await transporter.sendMail({
      from: `"Child Welfare Portal" <${SMTP_EMAIL}>`,
      to,
      subject,
      html: htmlMessage,
    });
    return { details: response, sent: true };
  } catch (error) {
    return { details: error, sent: false };
  }
};

/**
 * @method generatePassword
 * @description Generates secure temporary passwords for new Advisors.
 */
export const generatePassword = (length: number = 12): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
};

/**
 * @method calculateYearsAndMonths
 * @description Converts DOB to age for WHO measurement matching.
 */
export function calculateYearsAndMonths(fromDate: string): { years: number; months: number; totalMonths: number } {
  const now = new Date();
  const startDate = new Date(fromDate);

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    totalMonths: (years * 12) + months
  };
}

/**
 * @method returnCHildHealthCondition
 * @description Clinical logic to determine health status based on WHO standards.
 * Logic: If ANY metric is below the red threshold, the status is RED.
 */
export const returnCHildHealthCondition = (
  childData: ChildHealthDataDto,
  measurement: IMeasurement
): { healthCondition: THealthCondition; value: number; metric: string } => {
  
  // 1. EMERGENCY CHECK (RED) - If any metric is at or below red threshold
  if (childData.height <= measurement.redHeight) return { healthCondition: "red", value: childData.height, metric: 'height' };
  if (childData.weight <= measurement.redWeight) return { healthCondition: "red", value: childData.weight, metric: 'weight' };
  if (childData.width <= measurement.redWidth) return { healthCondition: "red", value: childData.width, metric: 'muac/width' };

  // 2. WARNING CHECK (YELLOW) - If any metric is below green but above red
  if (childData.height < measurement.greenHeight) return { healthCondition: "yellow", value: childData.height, metric: 'height' };
  if (childData.weight < measurement.greenWeight) return { healthCondition: "yellow", value: childData.weight, metric: 'weight' };
  if (childData.width < measurement.greenWidth) return { healthCondition: "yellow", value: childData.width, metric: 'muac/width' };

  // 3. HEALTHY (GREEN)
  return {
    healthCondition: "green",
    value: childData.height,
    metric: 'all'
  };
};