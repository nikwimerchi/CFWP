import { RequestHandler, NextFunction, Response } from "express";
// FIX: Point to the new model for roles
import { TUserRole } from "../models/users.model"; 
import { RequestWithUser } from "../interfaces/auth.interface";
import { HttpException } from "../exceptions/HttpException";
import httpStatus from "http-status";

export const protectRoute = (allowedRoles: TUserRole[]): RequestHandler => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    // 1. Check if user exists (set by authMiddleware)
    if (!req.user) {
      return next(new HttpException(httpStatus.UNAUTHORIZED, "Unauthorized"));
    }

    // 2. Check if user's role is in the allowed list
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    // 3. Block access if role doesn't match
    return next(
      new HttpException(
        httpStatus.FORBIDDEN, // Better to use FORBIDDEN (403) than BAD_REQUEST (400)
        `${req.user.role} is not allowed to access this resource`
      )
    );
  };
};