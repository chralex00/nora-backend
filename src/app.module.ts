import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env-schema-validation";
import { AppController } from "./app.controller";
import { PromptModule } from "./prompt/prompt.module";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    PromptModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
