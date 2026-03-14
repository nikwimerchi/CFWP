import { IsNotEmpty, IsString, IsOptional, IsUUID } from "class-validator";

export class ChatDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID() // Supabase uses UUIDs for IDs
  public childId: string;

  @IsNotEmpty()
  @IsString()
  public content: string;
}

// Use this if you implement "Edit Message" functionality
export class EditChatDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public content?: string;
}