import * as Joi from "joi";
import { OpenAiModel } from "./prompt/enums/open-ai-model.enum";

export const envSchema = Joi.object({
  LISTENING_PORT: Joi.number().min(1024).max(65535).required(),
  AUTH_API_KEY_HEADER_NAME: Joi.string().min(1).max(64).required(),
  AUTH_API_KEY_VALUE: Joi.string().min(32).max(256).required(),
  OPEN_AI_API_KEY: Joi.string().min(1).max(1024).required(),
  OPEN_AI_MODEL: Joi.string()
    .valid(...Object.keys(OpenAiModel))
    .required(),
  DOCKER_CONTAINER_NAME: Joi.string().optional(),
  DOCKER_IMAGE_NAME: Joi.string().optional(),
  DOCKER_PORT: Joi.number().min(1024).max(65535).optional(),
});

export const printEnvVariables = (): void => {
  const envVariableNames = ["LISTENING_PORT", "AUTH_API_KEY_HEADER_NAME", "AUTH_API_KEY_VALUE", "OPEN_AI_API_KEY", "OPEN_AI_MODEL", "DOCKER_CONTAINER_NAME", "DOCKER_IMAGE_NAME", "DOCKER_PORT"];

  const serviceEnvVariables: any = {};

  for (const name of envVariableNames) {
    if (process.env[name] && process.env[name].length) {
      serviceEnvVariables[name] = process.env[name];
    }
  }

  console.log("SERVICE STARTED WITH THE FOLLOWING ENV VARIABLES");
  console.log(serviceEnvVariables);
  console.log("\n");
};
