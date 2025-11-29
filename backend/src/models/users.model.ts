import { model, Schema, Document } from "mongoose";
import { IUser } from "../interfaces/users.interface";

const userSchema: Schema = new Schema(
  {
    names: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      district: { type: String, required: true },
      province: { type: String, required: true },
      sector: { type: String, required: true },
      cell: { type: String, required: true },
      village: { type: String, required: true },
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "advisor", "parent"],
      default: "parent",
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = model<IUser & Document>("Users", userSchema);

export default userModel;
