import { env } from "@/config/env";
import { createHttpClient } from "./client";
import { createAuthService } from "./auth.service";
import { createEncoderService } from "./encoder.service";
import { createStatsService } from "./stats.service";
import { createHealthService } from "./health.service";
import { createBillingService } from "./billing.service";

let authHeadersFn: (() => Record<string, string>) | undefined;

export function setAuthHeadersFn(fn: () => Record<string, string>) {
  authHeadersFn = fn;
}

const apiClient = createHttpClient({
  baseUrl: env.apiUrl,
  getAuthHeaders: () => authHeadersFn?.() ?? {},
});

export const authService = createAuthService(apiClient);
export const encoderService = createEncoderService(apiClient);
export const statsService = createStatsService(apiClient);
export const healthService = createHealthService(apiClient);
export const billingService = createBillingService(apiClient);

export { ApiError } from "./errors";
export type { AuthService } from "./auth.service";
export type { EncoderService } from "./encoder.service";
export type { StatsService } from "./stats.service";
export type { HealthService } from "./health.service";
export type { BillingService } from "./billing.service";
export type { HttpClient } from "./client";
