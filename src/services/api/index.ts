import { env } from "@/config/env";
import { createHttpClient } from "./client";
import { createEncoderService } from "./encoder.service";
import { createStatsService } from "./stats.service";

let authHeadersFn: (() => Record<string, string>) | undefined;

export function setAuthHeadersFn(fn: () => Record<string, string>) {
  authHeadersFn = fn;
}

const httpClient = createHttpClient({
  baseUrl: env.apiBaseUrl,
  getAuthHeaders: () => authHeadersFn?.() ?? {},
});

export const encoderService = createEncoderService(httpClient);
export const statsService = createStatsService(httpClient);

export { ApiError } from "./errors";
export type { EncoderService } from "./encoder.service";
export type { StatsService } from "./stats.service";
export type { HttpClient } from "./client";
