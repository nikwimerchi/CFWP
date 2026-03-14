import * as dotenv from 'dotenv';
dotenv.config(); // <--- CRITICAL: Load .env variables immediately

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
import { connectToDatabase } from "./db";
import routes from "./routes/v1";
import homeRoute from "./routes/v1/home.route";
import errorMiddleware from "./middlewares/error.middleware";

const app: Express = express();

// Connect to DB (This now runs AFTER dotenv has loaded the MONGO_URI)
connectToDatabase();

app.use(morgan(LOG_FORMAT));
app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
app.use(hpp());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "REST API",
      version: "1.0.0",
      description: "Example docs",
    },
  },
  apis: ["swagger.yaml"],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// home route
app.use("/", homeRoute);
// v1 api routes
app.use("/api/v1", routes);

// error handler middleware
app.use(errorMiddleware);

const prt = PORT || 8080;
// We should use the PORT constant directly, as it should be defined after dotenv
app.listen(PORT, () => { 
  logger.info(`=================================`);
  logger.info(`======= ENV: ${NODE_ENV} =======`);
  logger.info(`🚀 App listening on the port ${PORT}`); // Changed prt to PORT
  logger.info(`=================================`);
});