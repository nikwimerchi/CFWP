import winston, { format } from "winston";
import { TransformableInfo } from 'logform'; // Correct import for TransformableInfo
import { NODE_ENV } from "../../config";

interface LoggingInfo extends TransformableInfo {
  stack?: string;
  level: string;
  // Note: 'message: unknown' is now implicitly included from TransformableInfo
}

const enumerateErrorFormat = format((info: LoggingInfo) => {
  if (info instanceof Error) {
    // When an Error object is passed, winston attaches its properties.
    // We explicitly re-assign the message to the stack for detailed logs.
    info.message = info.stack;
  }
  return info;
});

const logger = winston.createLogger({
  level: NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    NODE_ENV === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),

    winston.format.printf(
      (info: LoggingInfo) => {
          // Safely cast info.message from 'unknown' to string
          const message = (info.message as string) || '';
          return `${info.level}: ${message}`;
      }
    )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;