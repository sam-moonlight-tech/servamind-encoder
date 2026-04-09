import type {
  GoogleCallbackPayload,
  AuthUserResponse,
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
  googleCallback(payload: GoogleCallbackPayload): Promise<AuthUserResponse>;
  getMe(): Promise<AuthUserResponse>;
  updateProfile(payload: ProfileNameUpdatePayload): Promise<AuthUserResponse>;
  deleteAccount(): Promise<void>;
  sendEmailLink(payload: EmailSendLinkPayload): Promise<EmailSendLinkResponse>;
  verifyEmailToken(payload: EmailVerifyPayload): Promise<AuthUserResponse>;
  logout(): Promise<void>;
  acceptTerms(): Promise<AuthUserResponse>;
  updateOnboardingSeen(payload: OnboardingSeenUpdate): Promise<AuthUserResponse>;
  createApiKey(): Promise<CreateApiKeyResponse>;
  revokeApiKey(keyId: string): Promise<void>;
  listApiKeys(): Promise<ListApiKeysResponse>;
}

export function createAuthService(client: HttpClient): AuthService {
  return {
    googleCallback(payload) {
      return client.post<AuthUserResponse>("/auth/google/callback", payload);
    },

    getMe() {
      return client.get<AuthUserResponse>("/auth/me");
    },

    updateProfile(payload) {
      return client.patch<AuthUserResponse>("/auth/me", payload);
    },

    deleteAccount() {
      return client.del<void>("/auth/me");
    },

    sendEmailLink(payload) {
      return client.post<EmailSendLinkResponse>("/auth/email/send-link", payload);
    },

    verifyEmailToken(payload) {
      return client.post<AuthUserResponse>("/auth/email/verify", payload);
    },

    logout() {
      return client.post<void>("/auth/logout");
    },

    acceptTerms() {
      return client.post<AuthUserResponse>("/auth/me/accept-terms");
    },

    updateOnboardingSeen(payload) {
      return client.patch<AuthUserResponse>("/auth/me/onboarding-seen", payload);
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
