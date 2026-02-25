import type {
  PublicStatsResponse,
  ExtensionsStatsResponse,
  QuotaResponse,
} from "@/types/api.types";
import type { HttpClient } from "./client";

export interface StatsService {
  getPublicStats(): Promise<PublicStatsResponse>;
  getExtensionStats(): Promise<ExtensionsStatsResponse>;
  getQuota(): Promise<QuotaResponse>;
}

export function createStatsService(
  authClient: HttpClient,
  backendClient: HttpClient
): StatsService {
  return {
    getPublicStats() {
      return backendClient.get<PublicStatsResponse>("/api/stats/public");
    },

    getExtensionStats() {
      return backendClient.get<ExtensionsStatsResponse>("/api/stats/extensions");
    },

    getQuota() {
      return authClient.get<QuotaResponse>("/quota");
    },
  };
}
