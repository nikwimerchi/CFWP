import { hash } from "bcryptjs";
import { isEmpty } from "class-validator";
import { CreateAdvisorDto } from "../dtos/users.dto";
import { IUser } from "../interfaces/users.interface";
import { HttpException } from "../exceptions/HttpException";
import httpStatus from "http-status";
import userModel from "../models/users.model";
import { logger } from "../utils/logger";
import { generatePassword, sendEmail } from "../utils/util";
import { advisorLoginDetailsEmailTemplate } from "../utils/emailTemplates";
import { IChild, IChildWithParent } from "../interfaces/child.interface";
import childModel from "../models/child.model";

export async function registerAdvisor(
  userData: CreateAdvisorDto
): Promise<IUser> {
  if (isEmpty(userData))
    throw new HttpException(httpStatus.BAD_REQUEST, "Advisor data is empty");

  const findUser: IUser = await userModel.findOne({ email: userData.email });
  if (findUser)
    throw new HttpException(
      httpStatus.CONFLICT,
      `This email ${userData.email} already exists`
    );

  const password = generatePassword(8);

  const hashedPassword = await hash(password, 10);

  //sending verification email
  const email = await sendEmail(
    "CWFP Health Advisor Login Credentials",
    userData.email,
    advisorLoginDetailsEmailTemplate(userData.names, password, userData.email)
  );

  if (!email.sent) {
    logger.error("Failed to send verification email to: " + userData.email);
    logger.error(email.details);
    throw new HttpException(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Something went wrong while sending login details to ${userData.email}. Please try again later`
    );
  }
  logger.info("Verification email sent to: " + userData.email);

  const createUserData: IUser = await userModel.create({
    ...userData,
    password: hashedPassword,
    role: "advisor",
    isEmailVerified: true,
    isVerified: true,
  });

  return createUserData;
}

export const approveAdvisor = async (id: string): Promise<IUser> => {
  const findAdvisor: IUser = await userModel.findOneAndUpdate(
    { _id: id },
    {
      isVerified: true,
    }
  );
  if (!findAdvisor)
    throw new HttpException(httpStatus.BAD_REQUEST, `Advisor not found`);

  return findAdvisor;
};

export const rejectAdvisor = async (id: string): Promise<IUser> => {
  const findAdvisor: IUser = await userModel.findOneAndUpdate(
    { _id: id },
    {
      isVerified: false,
    }
  );
  if (!findAdvisor)
    throw new HttpException(httpStatus.BAD_REQUEST, `Advisor not found`);

  return findAdvisor;
};

export const findAllAdvisors = async (
  filter: object,
  skip: number,
  limit: number
): Promise<{ advisors: IUser[]; total: number }> => {
  //all
  const allAdvisors: IUser[] = await userModel.find({ role: "advisor" });

  //specific
  const advisors: IUser[] = await userModel
    .find({ ...filter, role: "advisor" })
    .select("-password") // Exclude password field
    .skip(skip)
    .limit(limit);

  return { advisors, total: allAdvisors.length };
};

export const findAdvisorChildren = async (
  advisor: IUser,
  filters: Object
): Promise<IChildWithParent[]> => {
  const children: IChildWithParent[] = [];

  const allChildren: IChild[] = await childModel.find({
    "address.province": advisor.address.province,
    "address.district": advisor.address.district,
    "address.sector": advisor.address.sector,
    "address.cell": advisor.address.cell,
    "address.village": advisor.address.village,
    ...filters,
  });

  for (let i = 0; i < allChildren.length; i++) {
    const child = allChildren[i];
    const parent = await userModel
      .findOne({ _id: child.parentId })
      .select("-password");
    if (parent) {
      //@ts-ignore
      children.push({ ...child._doc, parent });
    }
  }

  return children;
};

export const findAdvisorParent = async (advisor: IUser): Promise<IUser[]> => {
  const parents: IUser[] = await userModel
    .find({
      "address.province": advisor.address.province,
      "address.district": advisor.address.district,
      "address.sector": advisor.address.sector,
      "address.cell": advisor.address.cell,
      "address.village": advisor.address.village,
      role: "parent",
    })
    .select("-password");

  return parents;
};
