import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { OpenAiRole } from "../enums/open-ai-role.enum";

export class PromptRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @IsEnum(OpenAiRole)
  public role: OpenAiRole;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  public text: string;
}
