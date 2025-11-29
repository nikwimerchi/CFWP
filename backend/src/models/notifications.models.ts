import { Schema, Document, model } from "mongoose";
import { INotification } from "../interfaces/notifications.interface";

const notificationsSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    title: { type: String, required: true },
    userId: { type: String, required: true },
    isRead: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const notificationsModel = model<INotification & Document>(
  "Notifications",
  notificationsSchema
);

export default notificationsModel;
