import type { AuthHealthResponse, BackendHealthResponse } from "@/types/api.types";
import type { HttpClient } from "./client";

export interface HealthService {
  getAuthHealth(): Promise<AuthHealthResponse>;
  getBackendHealth(): Promise<BackendHealthResponse>;
}

export function createHealthService(client: HttpClient): HealthService {
  return {
    getAuthHealth() {
      return client.get<AuthHealthResponse>("/health");
    },

    getBackendHealth() {
      return client.get<BackendHealthResponse>("/backend/health");
    },
  };
}
