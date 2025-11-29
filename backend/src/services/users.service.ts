import httpStatus from "http-status";
import {
  ChangePasswordDto,
  CreateUserDto,
  EditUserDto,
} from "../dtos/users.dto";
import { HttpException } from "../exceptions/HttpException";
import { IUser } from "../interfaces/users.interface";
import userModel from "../models/users.model";
import { isEmpty } from "../utils/util";
import { compare, hash } from "bcryptjs";

export const findAllUsers = async (): Promise<IUser[]> => {
  const users: IUser[] = await userModel.find({});
  return users;
};

export const createUser = async (userData: CreateUserDto): Promise<IUser> => {
  if (isEmpty(userData))
    throw new HttpException(httpStatus.BAD_REQUEST, "userData is empty");

  const findUser: IUser = await userModel.findOne({ email: userData.email });
  if (findUser)
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `This email ${userData.email} already exists`
    );

  const createUserData: IUser = await userModel.create(userData);

  return createUserData;
};

export const editUserData = async (userData: EditUserDto, userId: string) => {
  if (isEmpty(userData))
    throw new HttpException(httpStatus.BAD_REQUEST, "userData is empty");

  await userModel.findOneAndUpdate(
    {
      _id: userId,
    },
    userData
  );
};

export const changePwd = async (
  password: ChangePasswordDto,
  userId: string
): Promise<IUser> => {
  if (isEmpty(password))
    throw new HttpException(httpStatus.BAD_REQUEST, "No password provided");

  const findUser: IUser = await userModel.findOne({ _id: userId });
  if (!findUser)
    throw new HttpException(httpStatus.BAD_REQUEST, `User not found`);
  const isPasswordMatching: boolean = await compare(
    password.currentPassword,
    findUser.password
  );
  if (!isPasswordMatching)
    throw new HttpException(
      httpStatus.CONFLICT,
      "Current password is not matching"
    );

  const hashedPassword = await hash(password.newPassword, 10);

  const updatepassword: IUser = await userModel.findOneAndUpdate(
    {
      _id: userId,
    },
    { password: hashedPassword }
  );

  return updatepassword;
};
