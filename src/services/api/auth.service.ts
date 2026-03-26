import type {
  GoogleCallbackPayload,
  GoogleCallbackResponse,
  CreateApiKeyResponse,
  ListApiKeysResponse,
  EmailSendLinkPayload,
  EmailSendLinkResponse,
  EmailVerifyPayload,
  OnboardingSeenUpdate,
  ProfileNameUpdatePayload,
} from "@/types/api.types";
import type { HttpClient } from "./client";

export interface AuthService {
  googleCallback(payload: GoogleCallbackPayload): Promise<GoogleCallbackResponse>;
  getMe(): Promise<GoogleCallbackResponse>;
  updateProfile(payload: ProfileNameUpdatePayload): Promise<GoogleCallbackResponse>;
  deleteAccount(): Promise<void>;
  sendEmailLink(payload: EmailSendLinkPayload): Promise<EmailSendLinkResponse>;
  verifyEmailToken(payload: EmailVerifyPayload): Promise<GoogleCallbackResponse>;
  logout(): Promise<void>;
  updateOnboardingSeen(payload: OnboardingSeenUpdate): Promise<GoogleCallbackResponse>;
  createApiKey(): Promise<CreateApiKeyResponse>;
  revokeApiKey(keyId: string): Promise<void>;
  listApiKeys(): Promise<ListApiKeysResponse>;
}

export function createAuthService(client: HttpClient): AuthService {
  return {
    googleCallback(payload) {
      return client.post<GoogleCallbackResponse>("/auth/google/callback", payload);
    },

    getMe() {
      return client.get<GoogleCallbackResponse>("/auth/me");
    },

    updateProfile(payload) {
      return client.patch<GoogleCallbackResponse>("/auth/me", payload);
    },

    deleteAccount() {
      return client.del<void>("/auth/me");
    },

    sendEmailLink(payload) {
      return client.post<EmailSendLinkResponse>("/auth/email/send-link", payload);
    },

    verifyEmailToken(payload) {
      return client.post<GoogleCallbackResponse>("/auth/email/verify", payload);
    },

    logout() {
      return client.post<void>("/auth/logout");
    },

    updateOnboardingSeen(payload) {
      return client.patch<GoogleCallbackResponse>("/auth/me/onboarding-seen", payload);
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
