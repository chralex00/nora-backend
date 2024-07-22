import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { AppService } from "./app.service";

const configServiceMock = jest.fn(() => ({
  get: jest.fn(() => "test_api_key"),
}));

describe("AppService", () => {
  let appService: AppService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ConfigService,
          useFactory: configServiceMock,
        },
      ],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it("appService and configSerive should be defined", () => {
    expect(appService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe("openAiHealthCheck()", () => {
    it("should not throw any error", async () => {
      appService["openAiClient"] = {
        models: {
          list: () => [],
        },
      } as any;

      try {
        await appService.openAiHealthCheck();
      } catch (exception) {
        fail();
      }
    });

    it("should throw an error", async () => {
      appService["openAiClient"] = {
        models: {
          list: () => {
            throw new Error();
          },
        },
      } as any;

      try {
        await appService.openAiHealthCheck();
      } catch (exception) {
        expect(exception).toBeDefined();
        return;
      }

      fail();
    });
  });
});
