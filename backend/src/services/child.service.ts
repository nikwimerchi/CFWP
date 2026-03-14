import httpStatus from "http-status";
import { supabase } from "../db";
import { HttpException } from "../exceptions/HttpException";
import { isEmpty } from "../utils/util";
// FIX: Added ChildDto to imports
import { RegisterChildDto, ChildDto } from "../dtos/child.dto";
import { Child } from "../models/child.model"; 
import { User } from "../models/users.model"; 
import { sendNotification } from "./notifications.service";

// Compatibility interface for joins
export interface IChildWithParent extends Child {
  parent?: User;
}

/**
 * Register a new child
 */
export const registerChild = async (childData: RegisterChildDto, user: User): Promise<Child> => {
  if (isEmpty(childData)) throw new HttpException(httpStatus.BAD_REQUEST, "Child data is empty");

  // Matches your SQL: firstname, lastname, parentid
  const { data: findChild } = await supabase
    .from('children')
    .select('*')
    .eq('firstname', childData.firstName)
    .eq('lastname', childData.lastName)
    .eq('parentid', childData.parentId)
    .maybeSingle();

  if (findChild) throw new HttpException(httpStatus.CONFLICT, `Child ${childData.firstName} already exists`);

  const dbPayload = {
    firstname: childData.firstName,
    lastname: childData.lastName,
    middlename: childData.middleName || null,
    dateofbirth: childData.dateOfBirth,
    gender: childData.sex, // FIX: Using .sex from your DTO to map to SQL .gender
    parentid: childData.parentId,
    status: user.role === "advisor" ? "approved" : "pending",
    address: user.address,
    registeredby: { userId: user.id, role: user.role },
  };

  const { data: saveChildData, error: saveError } = await supabase
    .from('children')
    .insert([dbPayload])
    .select()
    .single();

  if (saveError) throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, saveError.message);
  return saveChildData as unknown as Child;
};

/**
 * Edit Child Data
 */
export const editChild = async (
  childId: string, 
  childData: ChildDto,
  userRole: string 
): Promise<Child> => {
  const statusUpdate = userRole === "advisor" ? "approved" : "pending";

  const { data: updatedChild, error } = await supabase
    .from('children')
    .update({
      firstname: childData.firstName,
      lastname: childData.lastName,
      middlename: childData.middleName,
      gender: childData.sex, // FIX: Mapping .sex to .gender
      dateofbirth: childData.dateOfBirth,
      address: childData.address,
      parentid: childData.parentId,
      status: statusUpdate 
    })
    .eq('id', childId)
    .select()
    .single();

  if (error) throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  return updatedChild as unknown as Child;
};

/**
 * Approve Child
 */
export const approveChild = async (childId: string): Promise<Child> => {
  const { data: findChild, error } = await supabase
    .from('children')
    .update({ status: 'approved' })
    .eq('id', childId)
    .select()
    .single();

  if (error || !findChild) throw new HttpException(httpStatus.BAD_REQUEST, `Child not found`);
  return findChild as unknown as Child;
};

/**
 * Reject Child
 */
export const rejectChild = async (childId: string): Promise<Child> => {
  const { data: findChild, error } = await supabase
    .from('children')
    .update({ status: 'rejected' })
    .eq('id', childId)
    .select()
    .single();

  if (error || !findChild) throw new HttpException(httpStatus.BAD_REQUEST, `Child not found`);
  return findChild as unknown as Child;
};

/**
 * Find All Children (Paginated)
 */
export const findAllChildren = async (
  filter: any, 
  page: number, 
  limit: number
): Promise<{ children: Child[]; total: number }> => {
  const skip = (page - 1) * limit;
  const { data: children, count, error } = await supabase
    .from('children')
    .select('*', { count: 'exact' })
    .match(filter)
    .range(skip, skip + limit - 1)
    .order('firstname', { ascending: true });

  if (error) throw new HttpException(500, error.message);
  return { children: (children || []) as unknown as Child[], total: count || 0 };
};

/**
 * Delete Child
 */
export const deleteChild = async (childId: string): Promise<Child> => {
  const { data: deletedChild, error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId)
    .select()
    .single();

  if (error || !deletedChild) throw new HttpException(httpStatus.BAD_REQUEST, `Child not found`);
  return deletedChild as unknown as Child;
};

/**
 * Find Single Child with Parent
 */
export const findSingleChild = async (id: string): Promise<IChildWithParent> => {
  const { data: child, error } = await supabase
    .from('children')
    .select(`*, parent:users(*)`) 
    .eq('id', id)
    .single();

  if (error || !child) throw new HttpException(httpStatus.BAD_REQUEST, "Child not found");
  return child as unknown as IChildWithParent;
};