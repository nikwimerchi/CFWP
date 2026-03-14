import { IsEnum, IsNotEmpty, IsNumber, IsString, IsOptional, Max, IsObject } from "class-validator";

enum sexEnum {
  male = "male",
  female = "female",
}

export class RegisterChildDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsEnum(sexEnum)
  public sex: string;

  @IsString()
  @IsOptional() 
  public middleName?: string;

  @IsNumber()
  @Max(5, { message: "Child's age must be less than or equal to 5" })
  public age: number;

  @IsString()
  @IsNotEmpty()
  public dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  public parentId: string;

  @IsObject()
  @IsOptional()
  public address?: {
    district: string;
    province: string;
    cell: string;
    sector: string;
    village: string;
  };
}

/**
 * FIX: Export ChildDto to resolve TS2304 in the service
 * This ensures the 'editChild' method has a valid type definition.
 */
export class ChildDto extends RegisterChildDto {}

// Use this for PATCH requests if needed
export class EditChildDto {
  @IsString()
  @IsOptional()
  public firstName?: string;

  @IsString()
  @IsOptional()
  public lastName?: string;

  @IsEnum(sexEnum)
  @IsOptional()
  public sex?: string;

  @IsString()
  @IsOptional()
  public middleName?: string;

  @IsNumber()
  @Max(5)
  @IsOptional()
  public age?: number;

  @IsString()
  @IsOptional()
  public dateOfBirth?: string;
}