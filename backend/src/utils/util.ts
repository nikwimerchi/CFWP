/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
import nodemailer from "nodemailer";
import { SMTP_EMAIL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT } from "../config";
import { THealthCondition } from "../interfaces/child.interface";
import { ChildHealthDataDto } from "../dtos/healthData.dto";
import { IMeasurement } from "../interfaces/measurements.interface";
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value === "string" && value.trim() === "") {
    return true;
  } else if (typeof value !== "number" && value === "") {
    return true;
  } else if (typeof value === "undefined" || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === "object" &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

export const sendEmail = async (
  subject: string,
  to: string,
  htmlMessage: string
): Promise<{ sent: boolean; details: any }> => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: SMTP_EMAIL,
      to,
      subject,
      html: htmlMessage,
    };
    const response = await transporter.sendMail(mailOptions);
    return { details: response, sent: true };
  } catch (error) {
    return { details: error, sent: false };
  }
};

export const generateRandomNumber = (): number => {
  const max = 999999;
  const min = 111111;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generatePassword = (length: number): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export function calculateYearsAndMonths(fromDate: string): {
  years: number;
  months: number;
} {
  const now = new Date();
  const startDate = new Date(fromDate);

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years: years,
    months: months,
  };
}

export const returnCHildHealthCondition = (
  childData: ChildHealthDataDto,
  measurement: IMeasurement
): { healthCondition: THealthCondition; value: number } => {
  //height
  if (
    childData.height > measurement.redHeight &&
    childData.height < measurement.greenHeight
  )
    return { healthCondition: "yellow", value: childData.height };

  if (childData.height <= measurement.redHeight)
    return { healthCondition: "red", value: childData.height };

  //weight
  if (
    childData.weight > measurement.redWeight &&
    childData.weight < measurement.greenWeight
  )
    return { healthCondition: "yellow", value: childData.weight };

  if (childData.weight <= measurement.redWeight)
    return { healthCondition: "red", value: childData.weight };

  //width
  if (
    childData.width > measurement.redWidth &&
    childData.width < measurement.greenWidth
  )
    return { healthCondition: "yellow", value: childData.width };

  if (childData.width <= measurement.redWidth)
    return { healthCondition: "red", value: childData.width };

  return {
    healthCondition: "green",
    value: childData.height,
  };
};
