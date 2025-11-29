import mongoose, { Schema, Document, model } from "mongoose";
import { IChildHealthData } from "../interfaces/child.interface";

const childHealthSchema: Schema = new Schema(
  {
    childId: { type: String, required: true },
    date: { type: String, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    width: { type: Number, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    healthCondition: { type: String, enum: ["red", "yellow", "green"] },
    conditionValue: { type: Number, required: true },
    registeredBy: {
      userId: { type: String, required: true },
      role: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const childHealthDataModel = model<IChildHealthData & Document>(
  "ChildHealthData",
  childHealthSchema
);

export default childHealthDataModel;
