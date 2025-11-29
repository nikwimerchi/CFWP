import { Response } from "express";
import httpStatus from "http-status";
import * as parentsService from "../services/parents.service";
import { RequestWithUser } from "../interfaces/auth.interface";

export const findAllParents = async (req: RequestWithUser, res: Response) => {
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

    const { parents, total } = await parentsService.findAllParents(
      addressFilter,
      skip,
      limit
    );
    return res.status(httpStatus.CREATED).json({ parents, total, page });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const findMyChildren = async (req: RequestWithUser, res: Response) => {
  try {
    const children = await parentsService.findMyChildren(req.user._id);
    return res.status(httpStatus.CREATED).json({ children });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};
