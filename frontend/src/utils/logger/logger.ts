import winston, { format, TransformableInfo } from 'winston';

// 1. Define LoggingInfo: Extend winston's TransformableInfo.
// This resolves the TS2345 error by ensuring structural compatibility.
interface LoggingInfo extends TransformableInfo {
  // message and level are inherited, but we add stack for error handling.
  stack?: string;
  // You might also need this if you manually set it:
  timestamp?: string; 
}

// 2. enumerateErrorFormat: Correctly types the format function argument.
// This function adds the error stack to the message if it exists.
const enumerateErrorFormat = format((info: LoggingInfo) => {
  if (info.stack) {
    // If the error object has a stack, append it to the message.
    info.message = `${info.message} | ${info.stack}`;
  }
  return info;
});

// 3. Logger Configuration
const logger = winston.createLogger({
  level: 'info',
  // You may want to use format.errors() which is the built-in way to handle stacks
  // We use the custom enumerateErrorFormat for compatibility with your existing code structure.
  format: format.combine(
    enumerateErrorFormat(), // Use the custom error formatter
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    
    // Define the print format using format.printf
    format.printf((info: LoggingInfo) => {
      // Safely access properties. Cast info.message from 'unknown' to 'string'.
      const message = (info.message as string) || '';
      const level = info.level.toUpperCase();
      const timestamp = info.timestamp;
      
      // Line 25 error is fixed here by using LoggingInfo and casting message
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    // Add other transports (e.g., File, HTTP) as needed
  ],
});

export default logger;