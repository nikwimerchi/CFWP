import { Response } from "express";
import httpStatus from "http-status";
import * as parentsService from "../services/parents.service";
import { RequestWithUser } from "../interfaces/auth.interface";

export const findAllParents = async (req: RequestWithUser, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    
    // Create a filter object that matches your Supabase table structure
    const filters: any = {};

    // Map query params to filter keys
    if (req.query.district) filters.district = req.query.district as string;
    if (req.query.sector) filters.sector = req.query.sector as string;
    if (req.query.province) filters.province = req.query.province as string;
    if (req.query.village) filters.village = req.query.village as string;
    if (req.query.cell) filters.cell = req.query.cell as string;

    const { parents, total } = await parentsService.findAllParents(
      filters,
      page,
      limit
    );

    return res.status(httpStatus.OK).json({ parents, total, page });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const findMyChildren = async (req: RequestWithUser, res: Response) => {
  try {

    const children = await parentsService.findMyChildren(req.user.id);
    
    return res.status(httpStatus.OK).json({ children });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};