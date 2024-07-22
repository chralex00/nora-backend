import { Controller, Get, InternalServerErrorException, Logger, UseGuards } from "@nestjs/common";
import { name, version } from "../package.json";
import { AppService } from "./app.service";
import { ApiKeyAuthGuard } from "./prompt/guards/api-key-auth.guard";

@Controller("healthcheck")
@UseGuards(ApiKeyAuthGuard)
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  public async status(): Promise<{ service: string; version: string; status: string; message: string }> {
    try {
      let status: "up" | "down" = "up";
      let message = "";

      try {
        await this.appService.openAiHealthCheck();
      } catch (exception) {
        this.logger.error(`Exception occurred executing the /healthcheck API: ${exception}`);
        status = "down";
        message = `Error message from OpenAI API: ${exception}`;
      }

      return {
        service: name,
        version,
        status,
        message,
      };
    } catch (exception) {
      this.logger.error(`Exception occurred executing the /healthcheck API: ${exception}`);
      throw new InternalServerErrorException();
    }
  }
}
