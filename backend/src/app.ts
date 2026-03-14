import * as dotenv from 'dotenv';
dotenv.config(); 

import express, { Express } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { logger } from "./utils/logger";
import { CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT } from "./config";
// Note: We are removing connectToDatabase if it was Mongo-specific
import routes from "./routes/v1"; 
import homeRoute from "./routes/v1/home.route";
import errorMiddleware from "./middlewares/error.middleware";

const app: Express = express();

/**
 * DATABASE INITIALIZATION
 * For Supabase, we don't usually "connect" in the traditional sense like MongoDB.
 * Instead, we ensure our environment variables for SUPABASE_URL and KEY are present.
 */
// If you created a check function for Supabase connectivity, call it here:
// checkSupabaseConnection(); 

app.use(morgan(LOG_FORMAT));
app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
app.use(hpp());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger Documentation
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // Updated to modern OpenAPI standard
    info: {
      title: "Children Welfare Portal API",
      version: "1.0.0",
      description: "Supabase-backed API for health monitoring and advisor management",
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1`,
        description: "Development Server",
      },
    ],
  },
  apis: ["swagger.yaml", "./src/routes/v1/*.ts"], // Path to your API docs
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/", homeRoute);
app.use("/api/v1", routes);

// Global Error Handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(`=================================`);
  logger.info(`======= ENV: ${NODE_ENV} =======`);
  logger.info(`🚀 App listening on the port ${PORT}`);
  logger.info(`=================================`);
});