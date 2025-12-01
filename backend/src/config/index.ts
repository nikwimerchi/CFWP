export const MONGO_URI = process.env.MONGO_URI;

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  ORIGIN,
  SMTP_EMAIL,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  BACKEND_PUBLIC_URL,
  FRONTEND_PUBLIC_URL,
} = process.env;

// Ensure PORT has a fallback value for safety, although it should be in .env
export const APP_PORT = PORT || '8080';