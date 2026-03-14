import { FRONTEND_PUBLIC_URL } from "../config";

/**
 * User Email Verification Template
 */
export const userEmailVerificationTemplate = (
  names: string,
  verificationToken: string
): string => {
  const verificationLink = `${FRONTEND_PUBLIC_URL}/verify/${verificationToken}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Verify Your Email</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0000FF;">Welcome to the Children Welfare System</h2>
        <p>Dear <strong>${names}</strong>,</p>
        <p>Thank you for registering. Please confirm your email address to activate your account and gain access to the portal.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #0000FF; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
               Verify Email Now
            </a>
        </div>
        <p style="font-size: 0.9rem; color: #666;">
            <strong>NB:</strong> If you did not sign up for this account, you can safely ignore this email.
        </p>
    </body>
    </html>
  `;
};

/**
 * FIX: Added Advisor Login Details Template
 * This resolves the TS2305 error in advisors.service.ts
 */
export const advisorLoginDetailsEmailTemplate = (
  names: string,
  password: string,
  email: string
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Advisor Login Credentials</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0000FF;">CWFP Health Advisor Account</h2>
        <p>Dear <strong>${names}</strong>,</p>
        <p>Your account as a Health Advisor has been created. Use the credentials below to log in to the system:</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; border-left: 5px solid #0000FF; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
        </div>

        <p>Please change your password immediately after your first login.</p>
        <p style="font-size: 0.9rem; color: #666;">
            Access the portal here: <a href="${FRONTEND_PUBLIC_URL}/login" style="color: #0000FF;">${FRONTEND_PUBLIC_URL}/login</a>
        </p>
    </body>
    </html>
  `;
};