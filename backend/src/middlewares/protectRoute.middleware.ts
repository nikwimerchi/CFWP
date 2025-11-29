import { RequestHandler, NextFunction, Response } from "express";
import { TUserRole } from "../interfaces/users.interface";
import { RequestWithUser } from "../interfaces/auth.interface";
import { HttpException } from "../exceptions/HttpException";
import httpStatus from "http-status";

export const protectRoute = (allowedRoles: TUserRole[]): RequestHandler => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new HttpException(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    if (allowedRoles.includes(req.user.role)) return next();

    throw new HttpException(
      httpStatus.BAD_REQUEST,
      req.user.role + " Is not allowed to access this information"
    );
  };
};
