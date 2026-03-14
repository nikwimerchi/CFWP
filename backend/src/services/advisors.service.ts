import { hash } from "bcryptjs";
import httpStatus from "http-status";
import { supabase } from "../db";
import { CreateAdvisorDto } from "../dtos/users.dto";
// FIX: Use the new User model to resolve email property conflicts
import { User } from "../models/users.model"; 
import { HttpException } from "../exceptions/HttpException";
import { logger } from "../utils/logger";
import { generatePassword, sendEmail, isEmpty } from "../utils/util";
import { advisorLoginDetailsEmailTemplate } from "../utils/emailTemplates";
import { IChildWithParent } from "../interfaces/child.interface";

/**
 * Register a new Health Advisor
 */
export async function registerAdvisor(userData: CreateAdvisorDto): Promise<User> {
  if (isEmpty(userData)) throw new HttpException(httpStatus.BAD_REQUEST, "Advisor data is empty");

  const { data: findUser } = await supabase
    .from('users')
    .select('email')
    .eq('email', userData.email)
    .maybeSingle();

  if (findUser) throw new HttpException(httpStatus.CONFLICT, `This email ${userData.email} already exists`);

  const password = generatePassword(8);
  const hashedPassword = await hash(password, 10);

  const email = await sendEmail(
    "CWFP Health Advisor Login Credentials",
    userData.email,
    advisorLoginDetailsEmailTemplate(userData.names, password, userData.email)
  );

  if (!email.sent) {
    logger.error("Failed to send verification email to: " + userData.email);
    throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, `Email delivery failed`);
  }

  // Map to snake_case DB columns if necessary (e.g., phone_number, is_verified)
  const { data: createUserData, error } = await supabase
    .from('users')
    .insert([{
      ...userData,
      password: hashedPassword,
      role: "advisor",
      is_email_verified: true,
      is_verified: true,
    }])
    .select()
    .single();

  if (error) throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  
  const { password: _, ...userResponse } = createUserData;
  return userResponse as unknown as User;
}

/**
 * Update Advisor Status (Approve)
 */
export const approveAdvisor = async (id: string): Promise<User> => {
  const { data: findAdvisor, error } = await supabase
    .from('users')
    .update({ is_verified: true })
    .eq('id', id)
    .select()
    .single();

  if (error || !findAdvisor) throw new HttpException(httpStatus.BAD_REQUEST, `Advisor not found`);
  return findAdvisor as unknown as User;
};

/**
 * FIX: Added missing rejectAdvisor function
 */
export const rejectAdvisor = async (id: string): Promise<User> => {
  const { data: findAdvisor, error } = await supabase
    .from('users')
    .update({ is_verified: false }) // Logic for rejection (usually setting verified to false or updating a status column)
    .eq('id', id)
    .select()
    .single();

  if (error || !findAdvisor) throw new HttpException(httpStatus.BAD_REQUEST, `Advisor not found`);
  return findAdvisor as unknown as User;
};

/**
 * Find All Advisors (Paginated)
 */
export const findAllAdvisors = async (
  filter: object,
  skip: number,
  limit: number
): Promise<{ advisors: User[]; total: number }> => {
  const { data: advisors, count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('role', 'advisor')
    .match(filter)
    .range(skip, skip + limit - 1);

  if (error) throw new HttpException(500, error.message);

  const sanitizedAdvisors = advisors.map(({ password, ...rest }) => rest as unknown as User);
  return { advisors: sanitizedAdvisors, total: count || 0 };
};

/**
 * Find Children assigned to an Advisor's location
 */
export const findAdvisorChildren = async (
  advisor: User, // Use the new User type here
  filters: object
): Promise<IChildWithParent[]> => {
  const { data: children, error } = await supabase
    .from('children')
    .select('*, parent:users!parentId(*)')
    .contains('address', {
      province: advisor.address.province,
      district: advisor.address.district,
      sector: advisor.address.sector,
      cell: advisor.address.cell,
      village: advisor.address.village,
    })
    .match(filters);

  if (error) throw new HttpException(500, error.message);

  return children.map(child => {
    if (child.parent) delete child.parent.password;
    return child;
  }) as unknown as IChildWithParent[];
};

/**
 * Find Parents in Advisor's location
 */
export const findAdvisorParent = async (advisor: User): Promise<User[]> => {
  const { data: parents, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'parent')
    .contains('address', {
      province: advisor.address.province,
      district: advisor.address.district,
      sector: advisor.address.sector,
      cell: advisor.address.cell,
      village: advisor.address.village,
    });

  if (error) throw new HttpException(500, error.message);

  return parents.map(({ password, ...rest }) => rest as unknown as User);
};