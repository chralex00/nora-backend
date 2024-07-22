import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
    private apiKeyValue: string;
    private apiKeyHeaderName: string;

    constructor (private readonly configService: ConfigService) {
        this.apiKeyHeaderName = this.configService.get<string>("AUTH_API_KEY_HEADER_NAME");
        this.apiKeyValue = this.configService.get<string>("AUTH_API_KEY_VALUE");
    }

    public canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKeyFromRequest = request.headers[this.apiKeyHeaderName] ?? null;
        return this.apiKeyValue === apiKeyFromRequest;
    }
}