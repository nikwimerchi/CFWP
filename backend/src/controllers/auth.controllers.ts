import { NextFunction, Request, Response } from "express";
import { CreateUserDto, LoginDto } from "../dtos/users.dto";
import { IUser } from "../interfaces/users.interface";
import { login, logout, signup, verifyEmail } from "../services/auth.service";
import { RequestWithUser } from "../interfaces/auth.interface";
import { FRONTEND_PUBLIC_URL } from "../config";

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: CreateUserDto = req.body;
    const signUpUserData: IUser = await signup(userData);

    res.status(201).json({
      data: signUpUserData,
      message:
        "Email verification instructions has been sent to " +
        signUpUserData.email +
        ". Please check your inbox.",
    });
  } catch (error) {
    next(error);
  }
}

export async function logIn(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: LoginDto = req.body;
    const { cookie, findUser, token } = await login(userData);

    res.setHeader("Set-Cookie", [cookie]);
    res.status(200).json({ user: findUser, token, message: "login" });
  } catch (error) {
    next(error);
  }
}

export async function verifyUserEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { verificationToken } = req.params;
    await verifyEmail(verificationToken);
    res.redirect(FRONTEND_PUBLIC_URL + "/verify/success");
  } catch (error) {
    next(error);
  }
}

export async function logOut(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    const userData: IUser = req.user;
    const logOutUserData: IUser = await logout(userData);

    res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
    res.status(200).json({ data: logOutUserData, message: "logout" });
  } catch (error) {
    next(error);
  }
}
