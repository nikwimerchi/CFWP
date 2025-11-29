import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChildHealthDataDto {
  @IsString()
  @IsNotEmpty()
  childId: string;

  @IsNumber()
  height: number;

  @IsNumber()
  width: number;

  @IsNumber()
  month: number;

  @IsNumber()
  year: number;

  @IsString()
  date: string;

  @IsNumber()
  weight: number;
}
