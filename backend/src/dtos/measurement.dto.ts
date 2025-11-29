import { IsNumber, Max } from "class-validator";

export class MeasurementDto {
  @IsNumber()
  age: number;

  @IsNumber()
  @Max(12, { message: "Invalid month" })
  months: number;

  @IsNumber()
  redHeight: number;

  @IsNumber()
  yellowHeight: number;

  @IsNumber()
  greenHeight: number;

  @IsNumber()
  redWeight: number;

  @IsNumber()
  yellowWeight: number;

  @IsNumber()
  greenWeight: number;

  @IsNumber()
  redWidth: number;

  @IsNumber()
  yellowWidth: number;

  @IsNumber()
  greenWidth: number;
}
