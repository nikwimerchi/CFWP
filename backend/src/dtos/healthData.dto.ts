import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from "class-validator";

export class ChildHealthDataDto {
  @IsString()
  @IsNotEmpty()
  public childId: string;

  @IsNumber()
  public height: number;

  @IsNumber()
  public width: number;

  @IsNumber()
  public weight: number;

  @IsNumber()
  public month: number;

  @IsNumber()
  public year: number;

  @IsDateString() // Better validation for ISO date strings
  public date: string;
}

// Use this for PATCH requests to allow partial updates
export class EditChildHealthDataDto {
  @IsNumber()
  @IsOptional()
  public height?: number;

  @IsNumber()
  @IsOptional()
  public width?: number;

  @IsNumber()
  @IsOptional()
  public weight?: number;

  @IsNumber()
  @IsOptional()
  public month?: number;

  @IsNumber()
  @IsOptional()
  public year?: number;

  @IsDateString()
  @IsOptional()
  public date?: string;
}