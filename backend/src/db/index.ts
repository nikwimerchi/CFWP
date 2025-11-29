import { connect, set, disconnect } from "mongoose";
import { DB_HOST, DB_PORT, DB_DATABASE, NODE_ENV } from "../config";

export const dbConnection = {
  url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

export const connectToDatabase = async () => {
  if (NODE_ENV !== "production") {
    set("debug", true);
  }

  await connect(dbConnection.url);
};
