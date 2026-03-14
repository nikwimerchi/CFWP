import { Response } from "express";
import { RegisterChildDto } from "../dtos/child.dto";
import { Child } from "../models/child.model"; 
import { User, TUserRole } from "../models/users.model"; 
import httpStatus from "http-status";
import * as childService from "../services/child.service";
import { RequestWithUser } from "../interfaces/auth.interface";

export const registerChild = async (req: RequestWithUser, res: Response) => {
  try {
    const chilData: RegisterChildDto = req.body;
    const user: User = req.user; // User now aligns with service expectation
    const registeredChild: Child = await childService.registerChild(
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
    const approvedChild: Child = await childService.approveChild(childId);

    return res
      .status(httpStatus.OK) // Better to use OK (200) for updates
      .json({ approvedChild, message: "Child Approved." });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const rejectChild = async (req: RequestWithUser, res: Response) => {
  try {
    const childId = req.params.id;
    const rejectedChild: Child = await childService.rejectChild(childId);

    return res
      .status(httpStatus.OK)
      .json({ rejectedChild, message: "Child Rejected." });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const deleteChild = async (req: RequestWithUser, res: Response) => {
  try {
    const childId = req.params.id;
    const deletedChild: Child = await childService.deleteChild(childId);

    return res
      .status(httpStatus.OK)
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
    const modifiedChild: Child = await childService.editChild(
      childId,
      childData,
      userRole
    );

    return res
      .status(httpStatus.OK)
      .json({ modifiedChild, message: "Child Updated." });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const findAllChildren = async (req: RequestWithUser, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    
    // Flattened address filter for Supabase/Postgres
    const filters: any = {};
    if (req.query.district) filters.district = req.query.district;
    if (req.query.sector) filters.sector = req.query.sector;
    if (req.query.province) filters.province = req.query.province;
    if (req.query.village) filters.village = req.query.village;
    if (req.query.cell) filters.cell = req.query.cell;

    const { children, total } = await childService.findAllChildren(
      filters,
      page,
      limit
    );
    return res.status(httpStatus.OK).json({ children, total, page });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const findSingleChild = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const child = await childService.findSingleChild(id);
    return res.status(httpStatus.OK).json({ child });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};