import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { PromptController } from "./prompt.controller";
import { PromptService } from "./prompt.service";
import { PromptRequestDto } from "./dtos/prompt-request.dto";
import { OpenAiRole } from "./enums/open-ai-role.enum";
import { HttpStatus, InternalServerErrorException } from "@nestjs/common";

const configServiceMock = jest.fn(() => ({
  get: jest.fn(),
}));

const promptServiceMock = jest.fn(() => ({
  promptRequest: jest.fn(),
}));

describe("PromptController", () => {
  let promptController: PromptController;
  let promptService: PromptService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PromptController],
      providers: [
        {
          provide: PromptService,
          useFactory: promptServiceMock,
        },
        {
          provide: ConfigService,
          useFactory: configServiceMock,
        },
      ],
    }).compile();

    promptController = moduleRef.get<PromptController>(PromptController);
    promptService = moduleRef.get<PromptService>(PromptService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it("controller should be defined", () => {
    expect(promptController).toBeDefined();
    expect(promptService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe("GET /prompt", () => {
    it("200 OK - Everything is ok, response is a string", async () => {
      jest.spyOn(promptService, "promptRequest").mockResolvedValueOnce("Hi, how are you today?");

      const response = await promptController.prompt(<PromptRequestDto>{
        role: OpenAiRole.user,
        text: "Hi!",
      });

      expect(response).toBeDefined();
      expect(response.timestamp).toBeDefined();
      expect(typeof response.text === "string").toStrictEqual(true);
      expect(response.text).toStrictEqual("Hi, how are you today?");
    });

    it("200 OK - Everything is ok, but response is null", async () => {
      jest.spyOn(promptService, "promptRequest").mockResolvedValueOnce(null);

      const response = await promptController.prompt(<PromptRequestDto>{
        role: OpenAiRole.user,
        text: "Hi!",
      });

      expect(response).toBeDefined();
      expect(response.timestamp).toBeDefined();
      expect(typeof response.text === "string").toStrictEqual(false);
      expect(response.text).toStrictEqual(null);
    });

    it("500 INTERNAL SERVER ERROR - promptRequest() throws an error", async () => {
      jest.spyOn(promptService, "promptRequest").mockRejectedValueOnce("A generic error occurred");

      try {
        await promptController.prompt(<PromptRequestDto>{
          role: OpenAiRole.user,
          text: "Hi!",
        });
      } catch (exception) {
        expect(exception).toBeDefined();
        expect(exception.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(exception.name).toStrictEqual(InternalServerErrorException.name);

        return;
      }

      fail();
    });
  });
});
