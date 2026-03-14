import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";
import { logger } from "../utils/logger";
import httpStatus from "http-status";

const errorMiddleware = (
  error: any, // Changed from HttpException to any to catch PostgREST errors
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Determine Status: Use error.status, or check for Supabase 'code'
    let status: number = error.status || httpStatus.INTERNAL_SERVER_ERROR;
    
    // 2. Determine Message: Handle standard messages or Supabase error details
    let message: string = error.message || "Something went wrong";

    // Extra: Handle Supabase/PostgreSQL unique constraint errors (e.g., duplicate email)
    if (error.code === '23505') {
      status = httpStatus.CONFLICT;
      message = "Record already exists (Duplicate entry).";
    }

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    );

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;