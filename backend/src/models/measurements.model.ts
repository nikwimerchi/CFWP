import { model, Schema, Document } from "mongoose";
import { IMeasurement } from "../interfaces/measurements.interface";

const userSchema: Schema = new Schema(
  {
    age: { type: Number, required: true },
    months: { type: Number, required: true },

    redHeight: { type: Number, required: true },
    yellowHeight: { type: Number, required: true },
    greenHeight: { type: Number, required: true },

    redWeight: { type: Number, required: true },
    yellowWeight: { type: Number, required: true },
    greenWeight: { type: Number, required: true },

    redWidth: { type: Number, required: true },
    yellowWidth: { type: Number, required: true },
    greenWidth: { type: Number, required: true },
  },
  { timestamps: true }
);

const measurementsModel = model<IMeasurement & Document>(
  "Measurements",
  userSchema
);

export default measurementsModel;
