import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import userModel from "../models/users.model";
import { CreateUserDto, LoginDto } from "../dtos/users.dto";
import { IUser } from "../interfaces/users.interface";
import { generateRandomNumber, isEmpty, sendEmail } from "../utils/util";
import { HttpException } from "../exceptions/HttpException";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interface";
import { SECRET_KEY } from "../config";
import httpStatus from "http-status";
import { userEmailVerificationTemplate } from "../utils/emailTemplates";
import { logger } from "../utils/logger";
import { sendNotification } from "./notifications.service";

const users = userModel;

export async function signup(userData: CreateUserDto): Promise<IUser> {
  if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

  const findUser: IUser = await users.findOne({ email: userData.email });
  if (findUser)
    throw new HttpException(
      httpStatus.CONFLICT,
      `This email ${userData.email} already exists`
    );

  const randomNumber = generateRandomNumber();
  const unsafeVerificationToken = await hash(randomNumber + userData.email, 10);
  const verificationToken = unsafeVerificationToken
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const hashedPassword = await hash(userData.password, 10);

  //sending verification email
  const email = await sendEmail(
    "CWFP Email verification",
    userData.email,
    userEmailVerificationTemplate(userData.names, verificationToken)
  );

  if (!email.sent) {
    logger.error("Failed to send verification email to: " + userData.email);
    logger.error(email.details);
    throw new HttpException(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Something went wrong while sending verification link to your email address. Please try again later`
    );
  }
  logger.info("Verification email sent to: " + userData.email);

  const createUserData: IUser = await users.create({
    ...userData,
    password: hashedPassword,
    verificationToken,
  });

  if (userData.role === "advisor") {
    //find admin,
    const admin = await userModel.findOne({ role: "admin" });
    if (admin) {
      await sendNotification(
        admin._id,
        "New advisor signed up",
        `${userData.names} registered as an advisor and waiting for your approval.`
      );
    }
  }

  await sendNotification(
    createUserData._id,
    "Thanks for using our platform",
    `Dear ${userData.names} we appreciate you for trying out our Child and family health welfare system. To gether we can make our families become more happier.`
  );

  return createUserData;
}

export async function login(
  userData: LoginDto
): Promise<{ cookie: string; findUser: IUser; token: string }> {
  if (isEmpty(userData))
    throw new HttpException(httpStatus.NOT_FOUND, "userData is empty");

  const findUser: IUser = await users.findOne({ email: userData.email });
  if (!findUser)
    throw new HttpException(
      httpStatus.CONFLICT,
      `This email ${userData.email} was not found`
    );

  const isPasswordMatching: boolean = await compare(
    userData.password,
    findUser.password
  );
  if (!isPasswordMatching)
    throw new HttpException(httpStatus.CONFLICT, "Password is not matching");

  if (!findUser.isEmailVerified)
    throw new HttpException(
      httpStatus.CONFLICT,
      "Your email address is not verified, please check your inbox for more instructions."
    );

  //restrict advisors to login as long as they are not verified by admin
  if (findUser.role === "advisor" && !findUser.isVerified)
    throw new HttpException(
      httpStatus.CONFLICT,
      `Dear ${findUser.names}, please wait patiently. Admin must verify your account so that you can be able to login.`
    );

  const tokenData = createToken(findUser);
  const cookie = createCookie(tokenData);

  return { cookie, findUser, token: tokenData.token };
}

export async function logout(userData: IUser): Promise<IUser> {
  if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

  const findUser: IUser = await users.findOne({
    email: userData.email,
    password: userData.password,
  });
  if (!findUser)
    throw new HttpException(
      httpStatus.CONFLICT,
      `This email ${userData.email} was not found`
    );

  return findUser;
}

export async function verifyEmail(
  verificationToken: string
): Promise<{ user: IUser }> {
  if (isEmpty(verificationToken))
    throw new HttpException(httpStatus.BAD_REQUEST, "Invalid request");

  const findUser: IUser = await users.findOneAndUpdate(
    { verificationToken, isEmailVerified: false },
    { isEmailVerified: true }
  );
  if (!findUser)
    throw new HttpException(httpStatus.CONFLICT, `Invalid request`);

  return { user: findUser };
}

export function createToken(user: IUser): TokenData {
  const dataStoredInToken: DataStoredInToken = { _id: user._id };
  const secretKey: string = SECRET_KEY;
  const expiresIn: number = 60 * 60;

  return {
    expiresIn,
    token: sign(dataStoredInToken, secretKey, { expiresIn }),
  };
}

export function createCookie(tokenData: TokenData): string {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
}
