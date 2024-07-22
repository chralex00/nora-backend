import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OpenAI } from "openai";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private openAiClient: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openAiClient = new OpenAI({
      apiKey: this.configService.get<string>("OPEN_AI_API_KEY"),
    });
  }

  public async openAiHealthCheck(): Promise<void> {
    try {
      await this.openAiClient.models.list();
    } catch (exception) {
      this.logger.error(`Exception occurred executing the openAiHealthCheck() method: ${exception}`);
      throw exception;
    }
  }
}
