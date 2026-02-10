import { Response } from "express";
import httpStatus from "http-status";
import * as advisorService from "../services/advisors.service";
import { RequestWithUser } from "../interfaces/auth.interface";
import { CreateAdvisorDto } from "../dtos/users.dto";
// FIX: Only import the new User model. Ensure IUser is NOT imported here.
import { User } from "../models/users.model"; 

export const registerAdvisor = async (req: RequestWithUser, res: Response) => {
  try {
    const userData: CreateAdvisorDto = req.body;
    // FIX: Using User model resolves the incompatible 'email' property error
    const advisor: User = await advisorService.registerAdvisor(userData);

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

    res.status(httpStatus.OK).json({
      message: "Advisor approved!",
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const rejectAdvisor = async (req: RequestWithUser, res: Response) => {
  try {
    const id: string = req.params.id;
    // FIX: Ensure 'rejectAdvisor' is exported from advisor.service.ts
    await advisorService.rejectAdvisor(id);

    res.status(httpStatus.OK).json({
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
    
    const filters: any = {};
    if (req.query.district) filters.district = req.query.district;
    if (req.query.sector) filters.sector = req.query.sector;
    if (req.query.province) filters.province = req.query.province;
    if (req.query.village) filters.village = req.query.village;
    if (req.query.cell) filters.cell = req.query.cell;

    const { advisors, total } = await advisorService.findAllAdvisors(
      filters,
      page,
      limit
    );
    
    return res.status(httpStatus.OK).json({ advisors, total, page });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const findAdvisorChildren = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const filters: any = {};
    if (req.query.parentId) {
      filters.parent_id = req.query.parentId; 
    }
    
    // FIX: Ensure the service signature accepts User instead of IUser
    const children = await advisorService.findAdvisorChildren(
      req.user as User,
      filters
    );
    return res.status(httpStatus.OK).json({ children });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const findAdvisorParent = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    // FIX: Ensure the service signature accepts User instead of IUser
    const parents = await advisorService.findAdvisorParent(req.user as User);
    return res.status(httpStatus.OK).json({ parents });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};