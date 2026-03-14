import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// Destructure for internal use
const { 
  NODE_ENV: ENV_NODE,
  PORT: ENV_PORT,
  SUPABASE_URL: ENV_URL,
  SUPABASE_ANON_KEY: ENV_KEY,
  JWT_SECRET: ENV_JWT,
  LOG_FORMAT: ENV_LOG,
  ORIGIN: ENV_ORIGIN,
  SMTP_HOST: ENV_HOST,
  SMTP_PORT: ENV_SMTP_PORT,
  SMTP_EMAIL: ENV_EMAIL,
  SMTP_PASSWORD: ENV_PWD,
  FRONTEND_PUBLIC_URL: ENV_FRONTEND,
  CREDENTIALS: ENV_CRED
} = process.env;

// Explicitly export each variable
export const NODE_ENV = ENV_NODE;
export const PORT = ENV_PORT;
export const SUPABASE_URL = ENV_URL;
export const SUPABASE_ANON_KEY = ENV_KEY;
export const LOG_FORMAT = ENV_LOG;
export const ORIGIN = ENV_ORIGIN;
export const SMTP_HOST = ENV_HOST;
export const SMTP_PORT = ENV_SMTP_PORT;
export const SMTP_EMAIL = ENV_EMAIL;
export const SMTP_PASSWORD = ENV_PWD;

// Key compatibility exports
export const SECRET_KEY = ENV_JWT; 
export const FRONTEND_PUBLIC_URL = ENV_FRONTEND || 'http://localhost:3000';
export const CREDENTIALS = ENV_CRED === 'true';