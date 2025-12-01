import { connect, set, disconnect } from "mongoose";
// IMPORTANT: Use MONGO_URI from your config. If it doesn't exist, we assume DB_HOST, etc., are used.
import { MONGO_URI, DB_HOST, DB_PORT, DB_DATABASE, NODE_ENV } from "../config"; 
import { logger } from '../utils/logger'; // Adding logger for connection status

// We will prioritize the full MONGO_URI if it exists (for Atlas)
// Otherwise, we fall back to the local connection structure
const ATLAS_URI = MONGO_URI; 
const LOCAL_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// Choose the connection URL
const connectionUrl = ATLAS_URI && ATLAS_URI.startsWith('mongodb') ? ATLAS_URI : LOCAL_URI;

export const dbConnection = {
  url: connectionUrl, // Use the selected URL
  options: {
    // Removed deprecated options (useNewUrlParser and useUnifiedTopology)
    // as they are the default behavior in modern Mongoose and cause TS errors.
    // Mongoose options can be placed here
  },
};

export const connectToDatabase = async () => {
  if (NODE_ENV !== "production") {
    set("debug", true);
  }
  
  logger.info(`Attempting to connect to database using URI: ${connectionUrl}`);

  try {
    // connect() now accepts an optional options object that aligns with ConnectOptions type
    await connect(dbConnection.url, dbConnection.options); 
    logger.info('Database connection established successfully!');
  } catch (error) {
    logger.error(`Database connection failed! Error: ${error}`);
    // If connection fails, log and exit
    process.exit(1);
  }
};