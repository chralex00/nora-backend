import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { name, version } from "../package.json";

const configServiceMock = jest.fn(() => ({
  get: jest.fn(),
}));

const appServiceMock = jest.fn(() => ({
  openAiHealthCheck: jest.fn(),
}));

describe("AppController", () => {
  let appController: AppController;
  let appService: AppService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useFactory: appServiceMock,
        },
        {
          provide: ConfigService,
          useFactory: configServiceMock,
        },
      ],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it("appController, appService and configSerivce should be defined", () => {
    expect(appController).toBeDefined();
    expect(appService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe("GET /healthcheck/status", () => {
    it("200 OK - Everything is ok", async () => {
      jest.spyOn(appService, "openAiHealthCheck").mockResolvedValueOnce(undefined);

      const response = await appController.status();

      expect(response).toBeDefined();
      expect(response.service).toStrictEqual(name);
      expect(response.version).toStrictEqual(version);
      expect(response.message).toStrictEqual("");
      expect(response.status).toStrictEqual("up");
    });

    it("200 OK - Error from OpenAI", async () => {
      jest.spyOn(appService, "openAiHealthCheck").mockRejectedValueOnce("A generic error occurred");

      const response = await appController.status();

      expect(response).toBeDefined();
      expect(response.service).toStrictEqual(name);
      expect(response.version).toStrictEqual(version);
      expect(response.message.includes("A generic error occurred")).toStrictEqual(true);
      expect(response.status).toStrictEqual("down");
    });

    it("500 INTERNAL SERVER ERROR - Logger is not defined", async () => {
      jest.spyOn(appService, "openAiHealthCheck").mockRejectedValueOnce("A generic error occurred");
      appController["logger" as any] = undefined;

      try {
        await appController.status();
      } catch (exception) {
        expect(exception).toBeDefined();
        return;
      }

      fail();
    });
  });
});
