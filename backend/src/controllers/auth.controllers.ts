import { NextFunction, Request, Response } from "express";
import { CreateUserDto, LoginDto } from "../dtos/users.dto";
import { User } from "../models/users.model"; 
import { login, logout, signup, verifyEmail } from "../services/auth.service";
import { RequestWithUser } from "../interfaces/auth.interface";
import { FRONTEND_PUBLIC_URL } from "../config"; 

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: CreateUserDto = req.body;
    const signUpUserData: User = await signup(userData);

    res.status(201).json({
      data: signUpUserData,
      message: `Email verification instructions have been sent to ${signUpUserData.email}. Please check your inbox.`,
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
    
    // Fallback if FRONTEND_PUBLIC_URL is undefined during migration
    const redirectUrl = FRONTEND_PUBLIC_URL || 'http://localhost:3000';
    res.redirect(`${redirectUrl}/verify/success`);
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
    const userData: User = req.user;
    
    // FIX: Just await the logout. Most auth services return void on logout.
    // If your service returns the user, keep it; if it returns void, remove the assignment.
    await logout(userData); 

    res.setHeader("Set-Cookie", ["Authorization=; Max-age=0; Path=/; HttpOnly"]);
    res.status(200).json({ message: "logout" });
  } catch (error) {
    next(error);
  }
}