import { IsNotEmpty, IsNumber, IsString, Max } from "class-validator";

export class ChatDto {
  @IsNotEmpty()
  @IsString()
  childId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
