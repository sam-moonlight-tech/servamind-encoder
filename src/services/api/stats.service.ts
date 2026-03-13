import type {
  PublicStatsResponse,
  ExtensionsStatsResponse,
  UsageResponse,
} from "@/types/api.types";
import type { HttpClient } from "./client";

export interface StatsService {
  getPublicStats(): Promise<PublicStatsResponse>;
  getExtensionStats(): Promise<ExtensionsStatsResponse>;
  getUsage(): Promise<UsageResponse>;
}

export function createStatsService(client: HttpClient): StatsService {
  return {
    getPublicStats() {
      return client.get<PublicStatsResponse>("/api/stats/public");
    },

    getExtensionStats() {
      return client.get<ExtensionsStatsResponse>("/api/stats/extensions");
    },

    getUsage() {
      return client.get<UsageResponse>("/api/usage/");
    },
  };
}
