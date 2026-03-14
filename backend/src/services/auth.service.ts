// backend/src/services/auth.service.ts

import userModel, { UserDocument } from '../models/users.model'; // Import your Mongoose model
import { IUser } from '../interfaces/users.interface';
import { CreateUserDto, LoginDto } from '../dtos/users.dto';
import { HttpException } from '../exceptions/HttpException'; // Assume you have this custom exception class
import crypto from 'crypto'; // For generating secure verification tokens
import bcrypt from 'bcryptjs'; // For password comparison in login
import jwt from 'jsonwebtoken'; // For generating JWT tokens

// Assuming you have an email service utility:
// import { sendVerificationEmail } from '../utils/emailService'; 

// =========================================================================
// 1. SIGNUP SERVICE
// =========================================================================

export async function signup(userData: CreateUserDto): Promise<IUser> {
    
    // 1. Check for duplicates
    const findUserByEmail = await userModel.findOne({ email: userData.email });
    if (findUserByEmail) {
        throw new HttpException(409, `User with email ${userData.email} already exists.`);
    }

    const findUserByPhone = await userModel.findOne({ phoneNumber: userData.phoneNumber });
    if (findUserByPhone) {
        throw new HttpException(409, `User with phone number ${userData.phoneNumber} already exists.`);
    }

    // 2. Generate the unique verification token
    const verificationToken = crypto.randomBytes(32).toString('hex'); 

    // 3. Create the new user payload (password hashing is done by the Mongoose pre-save hook)
    const newUserPayload = { 
        ...userData, 
        verificationToken: verificationToken, // Save the token
        isEmailVerified: false, 
        role: userData.role || 'parent' // Ensure a default role if not provided
    };
    
    const createdUser: UserDocument = await userModel.create(newUserPayload); 

    // 4. (TODO) Send the verification email (Implement this utility separately)
    // await sendVerificationEmail(createdUser.email, verificationToken); 

    // Return the user object without sensitive data
    const userResponse: IUser = createdUser.toObject();
    delete userResponse.password; 
    delete userResponse.verificationToken;

    return userResponse;
}

// =========================================================================
// 2. LOGIN SERVICE
// =========================================================================

export async function login(userData: LoginDto): Promise<{ cookie: string; findUser: IUser; token: string }> {
    
    // 1. Find the user
    const findUser: UserDocument | null = await userModel.findOne({ email: userData.email });
    if (!findUser) {
        throw new HttpException(401, 'Invalid credentials.');
    }

    // 2. Compare the password hash
    const isPasswordMatching = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) {
        throw new HttpException(401, 'Invalid credentials.');
    }
    
    // 3. SECURITY CHECK: Ensure email is verified
    if (!findUser.isEmailVerified) {
         throw new HttpException(403, 'Email not verified. Please check your inbox for the verification link.');
    }

    // 4. Generate JWT
    const tokenData = {
        _id: findUser._id,
        email: findUser.email,
        role: findUser.role,
    };
    
    const secret = process.env.JWT_SECRET || 'YOUR_FALLBACK_SECRET_MUST_BE_SECURE'; 
    const token = jwt.sign(tokenData, secret, { expiresIn: '1d' });

    // 5. Generate Cookie (Replace with your actual cookie generation logic)
    const cookie = `Authorization=${token}; HttpOnly; Max-Age=${60 * 60 * 24}; Path=/`; // 1 day expiry

    // 6. Prepare user response (remove password hash)
    const userResponse: IUser = findUser.toObject();
    delete userResponse.password; 
    delete userResponse.verificationToken;

    return { cookie, findUser: userResponse, token };
}

// =========================================================================
// 3. VERIFY EMAIL SERVICE
// =========================================================================

export async function verifyEmail(verificationToken: string): Promise<void> {
    
    // 1. Find the user by the token
    const findUser: UserDocument | null = await userModel.findOne({ verificationToken });

    if (!findUser) {
        throw new HttpException(404, 'Verification link is invalid or has expired.');
    }

    // 2. Update the user document
    findUser.isEmailVerified = true;
    findUser.verificationToken = undefined; // Clear the used token for security

    // 3. Save the updated document to MongoDB
    await findUser.save();
}

// =========================================================================
// 4. LOGOUT SERVICE (Simple token clearing)
// =========================================================================

export async function logout(userData: IUser): Promise<IUser> {
    // In a stateless JWT system, logout is often handled client-side by deleting the token.
    // If you use a blacklist/revocation list on the server, that logic would go here.
    
    const findUser: UserDocument | null = await userModel.findById(userData._id);
    if (!findUser) {
        throw new HttpException(404, 'User not found');
    }

    // Prepare response
    const userResponse: IUser = findUser.toObject();
    delete userResponse.password; 
    delete userResponse.verificationToken;

    return userResponse;
}