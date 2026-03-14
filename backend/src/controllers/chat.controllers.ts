import { Response } from "express";
import httpStatus from "http-status";
import * as chatServices from "../services/chat.services"; // Fixed path (plural services)
import { RequestWithUser } from "../interfaces/auth.interface";
import { ChatDto } from "../dtos/chat.dto"; // Fixed path (plural dto)

export const chat = async (req: RequestWithUser, res: Response) => {
  try {
    const data: ChatDto = req.body;
    
    // Calling the 'chatt' function from your chat.service.ts
    const chatResponse = await chatServices.chatt(data, req.user);
    
    return res.status(httpStatus.CREATED).json({ 
      chat: chatResponse,
      message: "Message sent successfully" 
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const getChats = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params; // This is the childId
    
    // Calling the 'getChatts' function from your chat.service.ts
    const chats = await chatServices.getChatts(id, req.user);
    
    return res.status(httpStatus.OK).json({ chats });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};