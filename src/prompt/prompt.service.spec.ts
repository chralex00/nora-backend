import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { PromptService } from "./prompt.service";
import { PromptRequestDto } from "./dtos/prompt-request.dto";
import { OpenAiRole } from "./enums/open-ai-role.enum";

const configServiceMock = jest.fn(() => ({
  get: jest.fn(() => "test_api_key"),
}));

describe("PromptService", () => {
  let promptService: PromptService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PromptService,
        {
          provide: ConfigService,
          useFactory: configServiceMock,
        },
      ],
    }).compile();

    promptService = moduleRef.get<PromptService>(PromptService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it("promptService and configSerive should be defined", () => {
    expect(promptService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe("promptRequest()", () => {
    it("should not throw any error, returned message is a string", async () => {
      promptService["openAiClient"] = {
        chat: {
          completions: {
            create: () => ({
              choices: [
                {
                  message: {
                    content: "Hi, how are you today?",
                  },
                },
              ],
            }),
          },
        },
      } as any;

      const text = await promptService.promptRequest(<PromptRequestDto>{
        role: OpenAiRole.user,
        text: "Hi!",
      });

      expect(text).toBeDefined();
      expect(typeof text === "string").toStrictEqual(true);
      expect(text).toStrictEqual("Hi, how are you today?");
    });

    it("should not throw any error, returned message is null", async () => {
      promptService["openAiClient"] = {
        chat: {
          completions: {
            create: () => ({
              choices: [
                {
                  message: null
                },
              ],
            }),
          },
        },
      } as any;

      const text = await promptService.promptRequest(<PromptRequestDto>{
        role: OpenAiRole.user,
        text: "Hi!",
      });

      expect(text).toBeDefined();
      expect(typeof text === "string").toStrictEqual(false);
      expect(text).toStrictEqual(null);
    });

    it("should not throw any error, returned choices is null", async () => {
      promptService["openAiClient"] = {
        chat: {
          completions: {
            create: () => ({
              choices: null,
            }),
          },
        },
      } as any;

      const text = await promptService.promptRequest(<PromptRequestDto>{
        role: OpenAiRole.user,
        text: "Hi!",
      });

      expect(text).toBeDefined();
      expect(typeof text === "string").toStrictEqual(false);
      expect(text).toStrictEqual(null);
    });

    it("should throw an error", async () => {
      promptService["openAiClient"] = {
        chat: {
          completions: {
            create: () => {
              throw new Error();
            },
          },
        },
      } as any;

      try {
        await promptService.promptRequest(<PromptRequestDto>{
          role: OpenAiRole.user,
          text: "Hi!",
        });
      } catch (exception) {
        expect(exception).toBeDefined();
        return;
      }

      fail();
    });
  });
});
