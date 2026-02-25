import type { AuthHealthResponse, BackendHealthResponse } from "@/types/api.types";
import type { HttpClient } from "./client";

export interface HealthService {
  getAuthHealth(): Promise<AuthHealthResponse>;
  getBackendHealth(): Promise<BackendHealthResponse>;
}

export function createHealthService(
  authClient: HttpClient,
  backendClient: HttpClient
): HealthService {
  return {
    getAuthHealth() {
      return authClient.get<AuthHealthResponse>("/health");
    },

    getBackendHealth() {
      return backendClient.get<BackendHealthResponse>("/health");
    },
  };
}
