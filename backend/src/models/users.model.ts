// backend/src/models/users.model.ts

import { model, Schema, Document } from "mongoose";
import { IUser } from "../interfaces/users.interface"; // Assuming you have this interface
import bcrypt from "bcryptjs"; // Used for hashing passwords

// Define the document interface combining IUser and Mongoose Document
export type UserDocument = IUser & Document; 

const userSchema: Schema = new Schema(
  {
    names: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
       lowercase: true,
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
    verificationToken: { // Token stored for email verification
      type: String,
    },
  },
  { timestamps: true }
);

// Mongoose pre('save') hook: HASHES THE PASSWORD BEFORE SAVING
userSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

const userModel = model<UserDocument>("Users", userSchema);

export default userModel;