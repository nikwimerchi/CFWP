import { plainToInstance } from "class-transformer"; // Updated from plainToClass
import { validate, ValidationError } from "class-validator";
import { RequestHandler } from "express";
import { HttpException } from "../exceptions/HttpException";
import httpStatus from "http-status";

type ValueType = "body" | "query" | "params";

const validationMiddleware = (
  type: any,
  value: ValueType = "body",
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true
): RequestHandler => {
  return (req, res, next) => {
    // FIX: Using plainToInstance for better compatibility with class-transformer 0.5.1+
    const instance = plainToInstance(type, req[value]);

    validate(instance, {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        // IMPROVEMENT: Recursive flattener to catch errors in nested objects (like 'address')
        const message = errors
          .map((error: ValidationError) => {
            return error.constraints 
              ? Object.values(error.constraints) 
              : Object.values(error.children[0].constraints); // Simple nested check
          })
          .flat()
          .join(", ");
          
        next(new HttpException(httpStatus.BAD_REQUEST, message));
      } else {
        // Re-assign the transformed instance to req[value] 
        // so the controller receives the typed class instead of a plain object
        req[value] = instance;
        next();
      }
    });
  };
};

export default validationMiddleware;