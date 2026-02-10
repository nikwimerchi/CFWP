import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { supabase } from '../db';
// FIX: Use the new User model
import { User } from '../models/users.model'; 
import { CreateUserDto, LoginDto } from '../dtos/users.dto';
import { HttpException } from '../exceptions/HttpException';
// Use SECRET_KEY or JWT_SECRET depending on your config export
import { SECRET_KEY } from '../config'; 

// =========================================================================
// 1. SIGNUP SERVICE
// =========================================================================
export async function signup(userData: CreateUserDto): Promise<User> {
  // 1. Check for duplicates using Supabase column names (snake_case)
  const { data: existingUser } = await supabase
    .from('users')
    .select('email, phone_number')
    .or(`email.eq.${userData.email},phone_number.eq.${userData.phoneNumber}`)
    .maybeSingle(); // maybeSingle() is safer than single() for lookups

  if (existingUser) {
    const field = existingUser.email === userData.email ? 'email' : 'phone number';
    throw new HttpException(409, `User with this ${field} already exists.`);
  }

  // 2. Security: Hash password & Generate verification token
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // 3. Create payload mapped to DB columns (snake_case)
  const dbPayload = {
    names: userData.names,
    email: userData.email,
    password: hashedPassword,
    phone_number: userData.phoneNumber,
    address: userData.address,
    role: userData.role || 'parent',
    verification_token: verificationToken,
    is_email_verified: false,
    is_verified: false
  };

  // 4. Insert into Supabase
  const { data: createdUser, error } = await supabase
    .from('users')
    .insert([dbPayload])
    .select()
    .single();

  if (error) throw new HttpException(500, error.message);

  // Return formatted User (excluding sensitive fields)
  const { password, verification_token, ...userResponse } = createdUser;
  return userResponse as unknown as User;
}

// =========================================================================
// 2. LOGIN SERVICE
// =========================================================================
export async function login(userData: LoginDto): Promise<{ cookie: string; findUser: User; token: string }> {
  // 1. Find the user
  const { data: findUser, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', userData.email)
    .single();

  if (error || !findUser) {
    throw new HttpException(401, 'Invalid credentials.');
  }

  // 2. Compare password
  const isPasswordMatching = await bcrypt.compare(userData.password, findUser.password);
  if (!isPasswordMatching) {
    throw new HttpException(401, 'Invalid credentials.');
  }

  // 3. Check verification status (using DB column name)
  if (!findUser.is_email_verified) {
    throw new HttpException(403, 'Email not verified.');
  }

  // 4. Generate JWT
  const tokenData = { id: findUser.id, email: findUser.email, role: findUser.role };
  const token = jwt.sign(tokenData, SECRET_KEY, { expiresIn: '1d' });

  // 5. Generate Cookie
  const cookie = `Authorization=${token}; HttpOnly; Max-Age=${60 * 60 * 24}; Path=/`;

  const { password, verification_token, ...userResponse } = findUser;
  return { cookie, findUser: userResponse as unknown as User, token };
}

// =========================================================================
// 3. VERIFY EMAIL SERVICE
// =========================================================================
export async function verifyEmail(verificationToken: string): Promise<void> {
  const { data: findUser, error } = await supabase
    .from('users')
    .update({ is_email_verified: true, verification_token: null })
    .eq('verification_token', verificationToken)
    .select()
    .single();

  if (error || !findUser) {
    throw new HttpException(404, 'Verification link is invalid or has expired.');
  }
}

// =========================================================================
// 4. LOGOUT SERVICE
// =========================================================================
export async function logout(userData: User): Promise<void> {
  // Check if user exists in DB
  const { data: findUser, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', userData.id)
    .single();

  if (error || !findUser) throw new HttpException(404, 'User not found');
}