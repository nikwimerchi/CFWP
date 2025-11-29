import { Response } from "express";
import httpStatus from "http-status";
import * as advisorService from "../services/advisors.service";
import { RequestWithUser } from "../interfaces/auth.interface";
import { CreateAdvisorDto } from "../dtos/users.dto";
import { IUser } from "../interfaces/users.interface";

export const registerAdvisor = async (req: RequestWithUser, res: Response) => {
  try {
    const userData: CreateAdvisorDto = req.body;
    const advisor: IUser = await advisorService.registerAdvisor(userData);

    res.status(httpStatus.CREATED).json({
      advisor,
      message:
        "Advisor has been registered. Login details sent to " + userData.email,
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const approveAdvisor = async (req: RequestWithUser, res: Response) => {
  try {
    const id: string = req.params.id;
    await advisorService.approveAdvisor(id);

    res.status(httpStatus.CREATED).json({
      message: "Advisor approved!",
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const rejectAdvisor = async (req: RequestWithUser, res: Response) => {
  try {
    const id: string = req.params.id;
    await advisorService.rejectAdvisor(id);

    res.status(httpStatus.CREATED).json({
      message: "Advisor rejected!",
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const findAllAdvisors = async (req: RequestWithUser, res: Response) => {
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

    const { advisors, total } = await advisorService.findAllAdvisors(
      addressFilter,
      skip,
      limit
    );
    return res.status(httpStatus.CREATED).json({ advisors, total, page });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const findAdvisorChildren = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const filters = {};
    if (req.query.parentId) {
      filters["parentId"] = req.query.parentId;
    }
    const children = await advisorService.findAdvisorChildren(
      req.user,
      filters
    );
    return res.status(httpStatus.CREATED).json({ children });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const findAdvisorParent = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const parents = await advisorService.findAdvisorParent(req.user);
    return res.status(httpStatus.CREATED).json({ parents });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};
