import httpStatus from "http-status";
import { supabase } from "../db";
import {
  ChangePasswordDto,
  CreateUserDto,
  EditUserDto,
} from "../dtos/users.dto";
import { HttpException } from "../exceptions/HttpException";
import { User } from "../models/users.model"; 
import { isEmpty } from "../utils/util";
import { compare, hash } from "bcryptjs";

// Helper to map DB snake_case to UI camelCase
const mapUser = (data: any): User => ({
  ...data,
  phoneNumber: data.phone_number,
  isEmailVerified: data.is_email_verified,
  isVerified: data.is_verified,
});

/**
 * Fetch all users
 */
export const findAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new HttpException(500, error.message);
  return (data || []).map(mapUser);
};

/**
 * Create a new user manually
 */
export const createUser = async (userData: CreateUserDto): Promise<User> => {
  if (isEmpty(userData))
    throw new HttpException(httpStatus.BAD_REQUEST, "userData is empty");

  const { data: findUser } = await supabase
    .from('users')
    .select('email')
    .eq('email', userData.email)
    .maybeSingle();

  if (findUser)
    throw new HttpException(httpStatus.BAD_REQUEST, `Email ${userData.email} exists`);

  const hashedPassword = await hash(userData.password, 10);

  // Map camelCase DTO to snake_case DB columns
  const dbPayload = {
    names: userData.names,
    email: userData.email,
    password: hashedPassword,
    phone_number: userData.phoneNumber,
    address: userData.address,
    role: userData.role,
    is_email_verified: userData.isEmailVerified,
    is_verified: userData.isVerified,
  };

  const { data: createUserData, error } = await supabase
    .from('users')
    .insert([dbPayload])
    .select()
    .single();

  if (error) throw new HttpException(500, error.message);
  return mapUser(createUserData);
};

/**
 * Edit user profile
 */
export const editUserData = async (userData: EditUserDto, userId: string): Promise<void> => {
  if (isEmpty(userData))
    throw new HttpException(httpStatus.BAD_REQUEST, "userData is empty");

  // Map incoming updates to DB columns
  const updatePayload: any = { ...userData };
  if (userData.phoneNumber) updatePayload.phone_number = userData.phoneNumber;
  if (userData.isVerified !== undefined) updatePayload.is_verified = userData.isVerified;

  const { error } = await supabase
    .from('users')
    .update(updatePayload)
    .eq('id', userId);

  if (error) throw new HttpException(httpStatus.BAD_REQUEST, "Update failed");
};

/**
 * Change Password
 */
export const changePwd = async (password: ChangePasswordDto, userId: string): Promise<User> => {
  const { data: findUser, error: findError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (findError || !findUser) throw new HttpException(404, "User not found");

  const isPasswordMatching = await compare(password.currentPassword, findUser.password);
  if (!isPasswordMatching) throw new HttpException(409, "Wrong current password");

  const hashedPassword = await hash(password.newPassword, 10);

  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update({ password: hashedPassword })
    .eq('id', userId)
    .select()
    .single();

  if (updateError) throw new HttpException(500, "Update failed");
  return mapUser(updatedUser);
};