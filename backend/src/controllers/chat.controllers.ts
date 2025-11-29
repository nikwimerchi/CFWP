import { Response } from "express";
import httpStatus from "http-status";
import * as chatServices from "../services/chat.services";
import { RequestWithUser } from "../interfaces/auth.interface";
import { ChatDto } from "../dtos/chat.dto";

export const chat = async (req: RequestWithUser, res: Response) => {
  try {
    const data: ChatDto = req.body;
    const chat = await chatServices.chatt(data, req.user);
    return res.status(httpStatus.CREATED).json({ chat });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const getChats = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const chats = await chatServices.getChatts(id, req.user);
    return res.status(httpStatus.OK).json({ chats });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};
