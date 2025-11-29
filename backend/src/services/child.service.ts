import httpStatus from "http-status";
import { HttpException } from "../exceptions/HttpException";
import { isEmpty } from "../utils/util";
import { RegisterChildDto } from "../dtos/child.dto";
import { IChild, IChildWithParent } from "../interfaces/child.interface";
import childModel from "../models/child.model";
import { IUser, TUserRole } from "../interfaces/users.interface";
import userModel from "../models/users.model";
import { sendNotification } from "./notifications.service";

export const registerChild = async (
  childData: RegisterChildDto,
  user: IUser
): Promise<IChild> => {
  if (isEmpty(childData))
    throw new HttpException(httpStatus.BAD_REQUEST, "child data is empty");
  const findChild: IChild = await childModel.findOne({
    firstName: childData.firstName,
    lastName: childData.lastName,
    parentId: childData.parentId,
  });
  if (findChild)
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `This Child ${childData.firstName} already exist`
    );

  const saveChildData: IChild = await childModel.create({
    ...childData,
    status: user.role === "advisor" ? "approved" : "pending",
    address: user.address,
    registeredBy: { userId: user._id, role: user.role },
  });

  if (user.role === "parent") {
    //find advisor
    const advisor = await userModel.findOne({
      role: "advisor",
      "address.province": user.address.province,
      "address.district": user.address.district,
      "address.sector": user.address.sector,
      "address.cell": user.address.cell,
      "address.village": user.address.village,
    });

    if (advisor) {
      await sendNotification(
        advisor._id,
        "New child registered for your review",
        `${childData.firstName} ${childData.lastName} ${childData.lastName} was registered into the system by ${user.names}. Please go ahead a review the info.`
      );
    }
  } else {
    await sendNotification(
      childData.parentId,
      "New child registered",
      `Your child: ${childData.firstName} ${childData.lastName} ${childData.lastName} was registered into the system by ${user.names}.`
    );
  }

  return saveChildData;
};

export const approveChild = async (childId: string): Promise<IChild> => {
  if (isEmpty(childId))
    throw new HttpException(httpStatus.BAD_REQUEST, "child data is empty");
  const findChild: IChild = await childModel.findOneAndUpdate(
    { _id: childId },
    {
      status: "approved",
    }
  );
  if (!findChild)
    throw new HttpException(httpStatus.BAD_REQUEST, `This Child not found`);

  await sendNotification(
    findChild.parentId,
    "Child information approved",
    `Your child: ${findChild.firstName} ${findChild.lastName} ${findChild.lastName} has been approved by the health advisor.`
  );

  return findChild;
};

export const rejectChild = async (childId: string): Promise<IChild> => {
  if (isEmpty(childId))
    throw new HttpException(httpStatus.BAD_REQUEST, "child data is empty");
  const findChild: IChild = await childModel.findOneAndUpdate(
    { _id: childId },
    {
      status: "rejected",
    }
  );
  if (!findChild)
    throw new HttpException(httpStatus.BAD_REQUEST, `This Child not found`);

  await sendNotification(
    findChild.parentId,
    "Child information rejected",
    `Your child: ${findChild.firstName} ${findChild.lastName} ${findChild.lastName} has been rejected by the health advisor.`
  );

  return findChild;
};

export const deleteChild = async (childId: string): Promise<IChild> => {
  if (isEmpty(childId))
    throw new HttpException(httpStatus.BAD_REQUEST, "child data is empty");
  const findChild: IChild = await childModel.findOneAndDelete({
    _id: childId,
    $or: [{ status: "pending" }, { status: "rejected" }],
  });
  if (!findChild)
    throw new HttpException(httpStatus.BAD_REQUEST, `This Child not found`);

  return findChild;
};

export const editChild = async (
  childId: string,
  chilData: RegisterChildDto,
  userRole: TUserRole
): Promise<IChild> => {
  if (!childId)
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `child with id ${childId} not found`
    );

  const findChild: IChild = await childModel.findOneAndUpdate(
    userRole === "admin"
      ? { _id: childId }
      : { _id: childId, status: "pending" },
    chilData
  );
  if (!findChild)
    throw new HttpException(httpStatus.BAD_REQUEST, "Child not found");

  return findChild;
};

export const findAllChildren = async (
  filter: object,
  skip: number,
  limit: number
): Promise<{ children: IChild[]; total: number }> => {
  //all
  const allChildren: IChild[] = await childModel.find({});

  //specific
  const children: IChild[] = await childModel
    .find(filter)
    .skip(skip)
    .limit(limit);

  return { children, total: allChildren.length };
};

export const findSingleChild = async (
  id: string
): Promise<IChildWithParent> => {
  const child = await childModel.findOne({ _id: id });

  if (!child)
    throw new HttpException(httpStatus.BAD_REQUEST, "Child not found");

  const parent = await userModel.findOne({ _id: child.parentId });

  if (!child)
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      "Unable to find child's parents"
    );

  //@ts-ignore
  const childResponse: IChildWithParent = { ...child._doc, parent };

  return childResponse;
};
