import notificationsModel from "../models/notifications.models";
import { INotification } from "../interfaces/notifications.interface";
import { IChild, IChildHealthData } from "../interfaces/child.interface";
import childHealthDataModel from "../models/childHealthData.model";
import { HttpException } from "../exceptions/HttpException";
import httpStatus from "http-status";
import OpenAI from "openai";
import userModel from "../models/users.model";
import childModel from "../models/child.model";
import { sendEmail } from "../utils/util";

export const sendAlert = async () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const childrenHealthData: IChildHealthData[] =
    await childHealthDataModel.find({
      $or: [{ healthCondition: "red" }, { healthCondition: "yellow" }],
      year,
      month,
    });

  if (childrenHealthData.length === 0)
    throw new HttpException(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Currently, there is no unhealthy children found in the system"
    );

  console.log({ healthData: childrenHealthData.length });

  //for the sake of saving the tokens, we send same message to all parents
  try {
    const openai = new OpenAI({
      organization: process.env.OPEN_API_ORGANIZATION_ID,
      apiKey: process.env.OPEN_API_SECRET_KEY,
    });

    const generalInfo = `I need a random list of 10 ingredients to prepare nutritious meals for malnourished children.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: generalInfo }],
      model: "gpt-3.5-turbo",
    });

    if (completion?.choices) {
      const response = completion.choices[0].message;
      for (let i = 0; i < childrenHealthData.length; i++) {
        const child: IChild = await childModel.findOne({
          //@ts-ignore
          _id: childrenHealthData[i]._doc.childId,
        });

        if (child) {
          const parent = await userModel.findOne({
            _id: child.parentId,
          });
          if (parent) {
            const title = `Essential Foods to Combat Malnutrition  for ${child.firstName} ${child.middleName} ${child.lastName} `;
            await sendNotification(parent._id, title, response.content);
            await sendEmail(title, parent.email as any, response.content);
          }
        }
      }
    } else {
      throw new HttpException(
        httpStatus.BAD_REQUEST,
        "Could not be able to communicate with our AI model, please try again later."
      );
    }
  } catch (error) {
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      "Something went wrong, " + error.message
    );
  }
};

export const sendNotification = async (
  userId: string,
  title: string,
  message: string
) => {
  try {
    await notificationsModel.create({ title, userId, content: message });
  } catch (error) {
    console.log({ error });
  }
};

export const readAllNotifications = async (userId: string) => {
  await notificationsModel.updateMany({ userId }, { isRead: true });
};

export const deleteNotification = async (id: string, userId: string) => {
  await notificationsModel.deleteOne({ _id: id, userId });
};

export const getNotifications = async (
  userId: string
): Promise<INotification[]> => {
  const notifications: INotification[] = await notificationsModel.find({
    userId,
  });

  return notifications;
};
