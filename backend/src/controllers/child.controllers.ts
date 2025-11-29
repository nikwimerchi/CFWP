import { Response } from "express";
import { RegisterChildDto } from "../dtos/child.dto";
import { IChild } from "../interfaces/child.interface";
import httpStatus from "http-status";
import * as childService from "../services/child.service";
import { RequestWithUser } from "../interfaces/auth.interface";
import { TUserRole } from "../interfaces/users.interface";

export const registerChild = async (req: RequestWithUser, res: Response) => {
  try {
    const chilData: RegisterChildDto = req.body;
    const user = req.user;
    const registeredChild: IChild = await childService.registerChild(
      chilData,
      user
    );

    return res
      .status(httpStatus.CREATED)
      .json({ registeredChild, message: "Child registered." });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const approveChild = async (req: RequestWithUser, res: Response) => {
  try {
    const childId = req.params.id;
    const approvedChild: IChild = await childService.approveChild(childId);

    return res
      .status(httpStatus.CREATED)
      .json({ approvedChild, message: "Child Approved." });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const rejectChild = async (req: RequestWithUser, res: Response) => {
  try {
    const childId = req.params.id;
    const approvedChild: IChild = await childService.rejectChild(childId);

    return res
      .status(httpStatus.CREATED)
      .json({ approvedChild, message: "Child Rejected." });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const deleteChild = async (req: RequestWithUser, res: Response) => {
  try {
    const childId = req.params.id;
    const deletedChild: IChild = await childService.deleteChild(childId);

    return res
      .status(httpStatus.CREATED)
      .json({ deletedChild, message: "Child Deleted." });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const editChild = async (req: RequestWithUser, res: Response) => {
  try {
    const childId = req.params.id;
    const childData: RegisterChildDto = req.body;
    const userRole: TUserRole = req.user.role;
    const modifiedChild: IChild = await childService.editChild(
      childId,
      childData,
      userRole
    );

    return res
      .status(httpStatus.CREATED)
      .json({ modifiedChild, message: "Child Updated." });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const findAllChildren = async (req: RequestWithUser, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const addressFilter: {
      "address.province"?: string;
      "address.district"?: string;
      "address.sector"?: string;
      "address.cell"?: string;
      "address.village"?: string;
    } = {};

    if (req.query.district)
      addressFilter["address.district"] = req.query.district as string;
    if (req.query.sector)
      addressFilter["address.sector"] = req.query.sector as string;
    if (req.query.province)
      addressFilter["address.province"] = req.query.province as string;
    if (req.query.village)
      addressFilter["address.village"] = req.query.village as string;
    if (req.query.cell)
      addressFilter["address.cell"] = req.query.cell as string;

    const { children, total } = await childService.findAllChildren(
      addressFilter,
      skip,
      limit
    );
    return res.status(httpStatus.CREATED).json({ children, total, page });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const findSingleChild = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const child = await childService.findSingleChild(id);
    return res.status(httpStatus.CREATED).json({ child });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};
