import type {
  GoogleCallbackPayload,
  GoogleCallbackResponse,
  CreateApiKeyResponse,
  ListApiKeysResponse,
} from "@/types/api.types";
import type { HttpClient } from "./client";

export interface AuthService {
  googleCallback(payload: GoogleCallbackPayload): Promise<GoogleCallbackResponse>;
  logout(): Promise<void>;
  createApiKey(): Promise<CreateApiKeyResponse>;
  revokeApiKey(keyId: string): Promise<void>;
  listApiKeys(): Promise<ListApiKeysResponse>;
}

export function createAuthService(client: HttpClient): AuthService {
  return {
    googleCallback(payload) {
      return client.post<GoogleCallbackResponse>("/auth/google/callback", payload);
    },

    logout() {
      return client.post<void>("/auth/logout");
    },

    createApiKey() {
      return client.post<CreateApiKeyResponse>("/keys");
    },

    revokeApiKey(keyId) {
      return client.del<void>(`/keys/${keyId}`);
    },

    listApiKeys() {
      return client.get<ListApiKeysResponse>("/keys");
    },
  };
}
