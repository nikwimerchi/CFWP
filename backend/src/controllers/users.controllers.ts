import { Request, Response } from "express";
import { findAllUsers, editUserData, changePwd } from "../services/users.service";
import httpStatus from "http-status";
import { ChangePasswordDto, EditUserDto } from "../dtos/users.dto";
import { User } from "../models/users.model"; // Use the new interface
import { RequestWithUser } from "../interfaces/auth.interface";

export const getUsers = async (req: Request, res: Response) => {
  try {

    const userData: User[] = await findAllUsers();

    return res.status(httpStatus.OK).json({ data: userData, message: "findAll" });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const editUser = async (req: RequestWithUser, res: Response) => {
  try {
    const userData: EditUserDto = req.body;
    const userId: string = req.user.id; 
    await editUserData(userData, userId);

    return res.status(httpStatus.CREATED).json({ message: "user info updated!" });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const changePassword = async (req: RequestWithUser, res: Response) => {
  try {
    const passwordData: ChangePasswordDto = req.body;
    const userId: string = req.user.id;
    await changePwd(passwordData, userId);

    return res.status(httpStatus.CREATED).json({ message: "Password changed!" });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};