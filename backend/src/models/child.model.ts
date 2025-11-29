import mongoose, { Schema, Document, model } from "mongoose";
import { IChild } from "../interfaces/child.interface";

const childSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    age: { type: Number, required: true },
    sex: { type: String, required: true, enum: ["male", "female"] },
    dateOfBirth: { type: String, required: false },
    address: {
      district: { type: String, required: true },
      province: { type: String, required: true },
      cell: { type: String, required: true },
      sector: { type: String, required: true },
      village: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    parentId: { type: String, required: true },
    registeredBy: {
      userId: { type: String, required: true },
      role: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const childModel = model<IChild & Document>("Child", childSchema);

export default childModel;
