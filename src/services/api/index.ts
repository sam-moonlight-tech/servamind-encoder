import { env } from "@/config/env";
import { createHttpClient } from "./client";
import { createAuthService } from "./auth.service";
import { createEncoderService } from "./encoder.service";
import { createStatsService } from "./stats.service";
import { createHealthService } from "./health.service";

let authHeadersFn: (() => Record<string, string>) | undefined;

export function setAuthHeadersFn(fn: () => Record<string, string>) {
  authHeadersFn = fn;
}

const authClient = createHttpClient({
  baseUrl: env.authApiUrl,
  getAuthHeaders: () => authHeadersFn?.() ?? {},
});

const backendClient = createHttpClient({
  baseUrl: env.backendApiUrl,
  getAuthHeaders: () => authHeadersFn?.() ?? {},
});

export const authService = createAuthService(authClient);
export const encoderService = createEncoderService(authClient, backendClient);
export const statsService = createStatsService(authClient, backendClient);
export const healthService = createHealthService(authClient, backendClient);

export { ApiError } from "./errors";
export type { AuthService } from "./auth.service";
export type { EncoderService } from "./encoder.service";
export type { StatsService } from "./stats.service";
export type { HealthService } from "./health.service";
export type { HttpClient } from "./client";
