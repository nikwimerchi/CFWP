import { connect, set, disconnect } from "mongoose";
import { MONGO_URI, DB_HOST, DB_PORT, DB_DATABASE, NODE_ENV } from "../config";
import { logger } from '../utils/logger';

const ATLAS_URI = MONGO_URI;
const LOCAL_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

const connectionUrl = ATLAS_URI && ATLAS_URI.startsWith('mongodb') ? ATLAS_URI : LOCAL_URI;

export const dbConnection = {
  url: connectionUrl,
  options: {
  },
};

export const connectToDatabase = async () => {
  if (NODE_ENV !== "production") {
    set("debug", true);
  }

  logger.info(`Attempting to connect to database using URI: ${connectionUrl}`);

  try {
    await connect(dbConnection.url, dbConnection.options);
    logger.info('Database connection established successfully!');
  } catch (error) {
    logger.error(`Database connection failed! Error: ${error}`);
    process.exit(1);
  }
};