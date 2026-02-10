import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  MinLength,
} from "class-validator";
import { TUserRole } from "../models/users.model";

enum roleEnum {
  advisor = "advisor",
  parent = "parent",
  admin = "admin" // Added admin if needed
}

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: "Password must be 5 characters minimum." })
  public password: string;

  @IsString()
  @IsNotEmpty()
  public names: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  public phoneNumber: string;

  @IsEnum(roleEnum)
  public role: TUserRole;

  @IsObject()
  public address: {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  };

  // FIX TS2339: Added for users.service.ts mapping
  @IsBoolean()
  @IsOptional()
  public isVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  public isEmailVerified?: boolean;
}

export class CreateAdvisorDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public names: string;

  @IsObject()
  public address: {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  };
}

export class LoginDto {
  @IsEmail()
  public email: string;
  @IsString()
  public password: string;
}

export class EditUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public names?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @IsOptional()
  public phoneNumber?: string;

  // FIX TS2339: Explicitly add isVerified for the service to use
  @IsBoolean()
  @IsOptional()
  public isVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  public isEmailVerified?: boolean;
}

export class ChangePasswordDto {
  @IsString()
  public currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: "Password must be 5 characters minimum." })
  public newPassword: string;
}