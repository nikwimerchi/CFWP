import { IsEnum, IsNotEmpty, IsNumber, IsString, Max } from "class-validator";

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
  public middleName: string;

  @IsNumber()
  @Max(5, { message: "Child's age must be less than or equal to 5" })
  public age: number;

  @IsString()
  @IsNotEmpty()
  public dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  public parentId: string;
}
