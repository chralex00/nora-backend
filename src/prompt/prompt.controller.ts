import { Body, Controller, Post, InternalServerErrorException, Logger, UseGuards } from "@nestjs/common";
import { PromptService } from "./prompt.service";
import { PromptRequestDto } from "./dtos/prompt-request.dto";
import { ApiKeyAuthGuard } from "./guards/api-key-auth.guard";

@Controller("prompt")
@UseGuards(ApiKeyAuthGuard)
export class PromptController {
  private readonly logger = new Logger(PromptController.name);

  constructor(private readonly promptService: PromptService) {}

  @Post()
  public async prompt(@Body() promptRequestDto: PromptRequestDto): Promise<{ text: string | null; timestamp: string }> {
    try {
      const responseMessage = await this.promptService.promptRequest(promptRequestDto);

      return {
        text: responseMessage,
        timestamp: new Date().toISOString(),
      };
    } catch (exception) {
      this.logger.error(`Exception occurred executing the /prompt API: ${exception}`);
      throw new InternalServerErrorException();
    }
  }
}
