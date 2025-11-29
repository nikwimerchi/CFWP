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
    const notifications = await notificationService.getNotifications(
      req.user._id
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
    await notificationService.readAllNotifications(req.user._id);
    return res
      .status(httpStatus.OK)
      .json({ messaage: "All notifications are marked as read" });
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
    await notificationService.deleteNotification(id, req.user._id);
    return res
      .status(httpStatus.OK)
      .json({ messaage: "Notification deleted successfull" });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};
