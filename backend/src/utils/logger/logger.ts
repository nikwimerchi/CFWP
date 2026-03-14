import winston, { format } from "winston";
import { TransformableInfo } from 'logform'; // Correct import for TransformableInfo
import { NODE_ENV } from "../../config";
interface LoggingInfo {
  level: string;
  message: string;
}

const enumerateErrorFormat = winston.format((info: any) => { 
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
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
      (info: any) => `${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;