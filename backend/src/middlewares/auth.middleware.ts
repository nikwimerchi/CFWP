import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import {
  DataStoredInToken,
  RequestWithUser,
} from "../interfaces/auth.interface";
import { SECRET_KEY } from "../config";
import userModel from "../models/users.model";
import httpStatus from "http-status";
import { HttpException } from "../exceptions/HttpException";

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization =
      req.cookies["Authorization"] ||
      (req.header("Authorization")
        ? req.header("Authorization").split("Bearer ")[1]
        : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(
        Authorization,
        secretKey
      )) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(
          new HttpException(
            httpStatus.UNAUTHORIZED,
            "User session has been expired"
          )
        );
      }
    } else {
      next(
        new HttpException(
          httpStatus.BAD_REQUEST,
          "Authentication token missing"
        )
      );
    }
  } catch (error) {
    next(
      new HttpException(
        httpStatus.UNAUTHORIZED,
        "User session has been expired"
      )
    );
  }
};

export default authMiddleware;
