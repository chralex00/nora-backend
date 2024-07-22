import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OpenAI } from "openai";
import { OpenAiModel } from "./enums/open-ai-model.enum";
import { PromptRequestDto } from "./dtos/prompt-request.dto";

@Injectable()
export class PromptService {
  private readonly logger = new Logger(PromptService.name);
  private openAiClient: OpenAI;
  private openAiModel: OpenAiModel;

  constructor(private readonly configService: ConfigService) {
    this.openAiClient = new OpenAI({
      apiKey: this.configService.get<string>("OPEN_AI_API_KEY"),
    });
    this.openAiModel = this.configService.get<OpenAiModel>("OPEN_AI_MODEL");
  }

  public async promptRequest(promptRequestDto: PromptRequestDto): Promise<string | null> {
    try {
      const completionResponse = await this.openAiClient.chat.completions.create({
        messages: [
          {
            role: promptRequestDto.role as any,
            content: promptRequestDto.text,
          },
        ],
        model: this.openAiModel,
      });

      return completionResponse.choices?.[0]?.message?.content ?? null;
    } catch (exception) {
      this.logger.error(`Exception occurred executing the promptRequest() method: ${exception}`);
      throw exception;
    }
  }
}
