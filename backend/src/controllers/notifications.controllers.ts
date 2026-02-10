import { Response } from "express";
import httpStatus from "http-status";
import * as notificationService from "../services/notifications.service";
import { RequestWithUser } from "../interfaces/auth.interface";

export const notifyPeople = async (req: RequestWithUser, res: Response) => {
  try {
    await notificationService.sendAlert();
    return res.status(httpStatus.CREATED).json({
      message:
        "Notification sent to all the parents who have kids with malnutrition issues.",
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const getNotifications = async (req: RequestWithUser, res: Response) => {
  try {
    // FIX: Using .id instead of ._id for Supabase/PostgreSQL
    const notifications = await notificationService.getNotifications(
      req.user.id
    );
    return res.status(httpStatus.OK).json({ notifications });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const readAllNotifications = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    // FIX: Using .id instead of ._id
    await notificationService.readAllNotifications(req.user.id);
    return res
      .status(httpStatus.OK)
      .json({ message: "All notifications are marked as read" }); // Fixed typo 'messaage'
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const deleteNotification = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const { id } = req.params;
    // FIX: Using .id instead of ._id
    await notificationService.deleteNotification(id, req.user.id);
    return res
      .status(httpStatus.OK)
      .json({ message: "Notification deleted successfully" }); // Fixed typo 'messaage'
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};