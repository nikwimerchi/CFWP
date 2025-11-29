import httpStatus from "http-status";
import { HttpException } from "../exceptions/HttpException";
import { calculateYearsAndMonths, isEmpty } from "../utils/util";
import { ChatDto } from "../dtos/chat.dto";
import { IUser } from "../interfaces/users.interface";
import { IChild } from "../interfaces/child.interface";
import childModel from "../models/child.model";
import OpenAI from "openai";
import chatModel from "../models/chat.models";
import { IChat } from "../interfaces/chat.interface";
import childHealthDataModel from "../models/childHealthData.model";

export const chatt = async (data: ChatDto, user: IUser): Promise<IChat> => {
  if (isEmpty(data))
    throw new HttpException(httpStatus.BAD_REQUEST, "Invalid data");

  const child: IChild = await childModel.findOne({
    _id: data.childId,
    parentId: user._id,
    status: "approved",
  });
  if (!child) {
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `Invalid child please try again with correct info`
    );
  }
  const { months, years } = calculateYearsAndMonths(child.dateOfBirth);

  const healthData = await childHealthDataModel.find({ childId: data.childId });
  if (healthData.length === 0)
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `Sorry, we currently don't have any health info for our AI Model to use, Please wait patiently for advisor to let us know health info of this child.`
    );

  try {
    const openai = new OpenAI({
      organization: process.env.OPEN_API_ORGANIZATION_ID,
      apiKey: process.env.OPEN_API_SECRET_KEY,
    });

    const generalInfo = `My kid's name is ${child.firstName}. He is ${years} years and ${months} old. NB: this conversation must focus on health advice otherwise reply by warning me. My question is:  ${data.content}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: generalInfo }],
      model: "gpt-3.5-turbo",
    });

    if (completion?.choices) {
      const response = completion.choices[0].message;
      await chatModel.create({
        ...data,
        role: "user",
        userId: user._id,
      });

      const chatt: IChat = await chatModel.create({
        ...data,
        role: "assistant",
        userId: user._id,
        content: response.content,
      });
      return chatt;
    } else {
      throw new HttpException(
        httpStatus.BAD_REQUEST,
        "Could not be able to communicate with our AI model, please try again later."
      );
    }
  } catch (error) {
    throw new HttpException(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong while communicating with our AI model. " +
        (error.message || JSON.stringify(error))
    );
  }
};

export const getChatts = async (
  childId: string,
  user: IUser
): Promise<IChat[]> => {
  const data = await chatModel.find({ userId: user._id, childId });
  return data;
};
