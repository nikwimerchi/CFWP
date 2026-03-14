import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import {
  DataStoredInToken,
  RequestWithUser,
} from "../interfaces/auth.interface";
import { SECRET_KEY } from "../config";
import { supabase } from "../db"; 
import httpStatus from "http-status";
import { HttpException } from "../exceptions/HttpException";
import { User } from "../models/users.model";

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
      
      // Verification of JWT
      const verificationResponse = verify(Authorization, secretKey) as DataStoredInToken;

      // Handle both old (_id) and new (id) token formats
      const userId = verificationResponse.id || verificationResponse._id;

      if (!userId) {
        throw new Error("Invalid Token Payload");
      }

      // Supabase query to find the user in our custom table
      const { data: findUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (findUser && !error) {
        // Explicitly map DB snake_case to our User interface camelCase
        // This prevents the "Property does not exist" errors in your controllers
        req.user = {
          ...findUser,
          phoneNumber: findUser.phone_number,
          isVerified: findUser.is_verified,
          isEmailVerified: findUser.is_email_verified,
          // Ensure 'id' is present if the DB returned it as something else
          id: findUser.id 
        } as User;
        
        next();
      } else {
        next(new HttpException(httpStatus.UNAUTHORIZED, "User not found or session expired"));
      }
    } else {
      next(new HttpException(httpStatus.BAD_REQUEST, "Authentication token missing"));
    }
  } catch (error) {
    next(new HttpException(httpStatus.UNAUTHORIZED, "User session has been expired"));
  }
};

export default authMiddleware;