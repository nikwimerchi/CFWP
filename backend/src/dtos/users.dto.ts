import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { TUserRole } from "../interfaces/users.interface";

enum roleEnum {
  advisor = "advisor",
  parent = "parent",
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
  public names: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  public phoneNumber: string;
}

export class ChangePasswordDto {
  @IsString()
  public currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: "Password must be 5 characters minimum." })
  public newPassword: string;
}
