import { BACKEND_PUBLIC_URL, FRONTEND_PUBLIC_URL } from "../config";

export const userEmailVerificationTemplate = (
  names: string,
  verificationToken: string
): string => {
  return `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email verification</title>
    </head>
    <body>
        <p>
            Dear <strong>${names}</strong>, thank you for using child welfare system.
            Below is the link below to verify your email address.
        </p>
        <h1
        style="
            border-radius: 10px;
            padding: 1.5rem;
            text-align: center;
            background-color: blue;
            color: white;
            margin: 10px 0px;
        "
        >
            <a
                style="color: white; display: block; text-align: center; padding: 2rem"
                href="${
                  BACKEND_PUBLIC_URL +
                  "/api/v1/auth/verify/" +
                  verificationToken
                }"
                >Click here to verify your email Now!</a
            >
        </h1>
        <p>
            <strong>NB: if you did not initiate this action, please ignore this email. Your
            account is safe with us.</strong>
        </p>
    </body>
    </html>
 `;
};

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login Credentials</title>
    </head>
    <body>
        <p>
        Dear <b>${names}</b>, <br />
        We are pleased to inform you that your login details as a
        <b>Village Health Advisor</b> for <a href="${FRONTEND_PUBLIC_URL}">Children welfare portal</a> have
        been successfully created. Please find your login credentials below:
        </p>
        <h1
        style="
            border-radius: 10px;
            padding: 2rem;
            background-color: blue;
            color: white;
            margin: 10px 0px;
        "
        >
        <p>Email: <b>${email}</b></p>
        <p>Password: <b>${password}</b></p>
        </h1>
        <p>
        For security reasons, we recommend that you change your password after
        logging in for the first time.
        </p>
        <p>Best Regards!</p>
    </body>
    </html>
  `;
};
