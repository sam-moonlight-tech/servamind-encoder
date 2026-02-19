import type { SystemStats } from "@/types/api.types";
import type { HttpClient } from "./client";

export interface StatsService {
  getSystemStats(): Promise<SystemStats>;
}

export function createStatsService(client: HttpClient): StatsService {
  return {
    getSystemStats() {
      return client.post<SystemStats>("/systemStats");
    },
  };
}
