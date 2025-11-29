import { Schema, Document, model } from "mongoose";
import { IChat } from "../interfaces/chat.interface";

const chatsSchema: Schema = new Schema(
  {
    role: { type: String, required: true, enum: ["user", "assistant"] },
    content: { type: String, required: true },
    childId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const chatModel = model<IChat & Document>("Chats", chatsSchema);

export default chatModel;
