import { IsNumber, Max, IsOptional } from "class-validator";

export class MeasurementDto {
  @IsNumber()
  public age: number;

  @IsNumber()
  @Max(12, { message: "Invalid month" })
  public months: number;

  @IsNumber()
  public redHeight: number;

  @IsNumber()
  public yellowHeight: number;

  @IsNumber()
  public greenHeight: number;

  @IsNumber()
  public redWeight: number;

  @IsNumber()
  public yellowWeight: number;

  @IsNumber()
  public greenWeight: number;

  @IsNumber()
  public redWidth: number;

  @IsNumber()
  public yellowWidth: number;

  @IsNumber()
  public greenWidth: number;
}

// Use this for PATCH/PUT requests to allow partial updates
export class EditMeasurementDto {
  @IsNumber()
  @IsOptional()
  public age?: number;

  @IsNumber()
  @Max(12)
  @IsOptional()
  public months?: number;

  @IsNumber()
  @IsOptional()
  public redHeight?: number;

  @IsNumber()
  @IsOptional()
  public yellowHeight?: number;

  @IsNumber()
  @IsOptional()
  public greenHeight?: number;

  @IsNumber()
  @IsOptional()
  public redWeight?: number;

  @IsNumber()
  @IsOptional()
  public yellowWeight?: number;

  @IsNumber()
  @IsOptional()
  public greenWeight?: number;

  @IsNumber()
  @IsOptional()
  public redWidth?: number;

  @IsNumber()
  @IsOptional()
  public yellowWidth?: number;

  @IsNumber()
  @IsOptional()
  public greenWidth?: number;
}