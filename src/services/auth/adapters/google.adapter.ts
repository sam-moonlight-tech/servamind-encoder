import type { AuthUser } from "@/types/domain.types";
import type { AuthProvider, SignInCredentials } from "../auth.provider";
import { authService } from "@/services/api";
import type { GoogleCallbackResponse } from "@/types/api.types";

function toAuthUser(response: GoogleCallbackResponse): AuthUser {
  return {
    id: response.user_id,
    email: response.email,
    name: response.name ?? null,
    planType: response.plan_type,
    subscriptionStatus: response.subscription_status,
    betaTierActive: response.beta_tier_active,
    betaEnrolledAt: response.beta_enrolled_at,
    onboardingSeen: response.onboarding_seen,
    createdAt: response.created_at,
  };
}

export function createGoogleAuthProvider(): AuthProvider {
  let currentUser: AuthUser | null = null;
  const listeners = new Set<(user: AuthUser | null) => void>();

  return {
    async initialize() {
      try {
        const response = await authService.getMe();
        currentUser = toAuthUser(response);
      } catch {
        currentUser = null;
      }
    },

    getUser() {
      return currentUser;
    },

    getAuthHeaders(): Record<string, string> {
      // Auth is handled via httpOnly session cookie (sent automatically with credentials: 'include')
      return {};
    },

    async signIn(credentials?: SignInCredentials) {
      if (!credentials?.googleToken && !credentials?.emailToken) {
        throw new Error("Google token or email token is required for sign-in");
      }

      const response = credentials.emailToken
        ? await authService.verifyEmailToken({ token: credentials.emailToken })
        : await authService.googleCallback({ token: credentials.googleToken! });

      currentUser = toAuthUser(response);
      listeners.forEach((cb) => cb(currentUser));
      return currentUser;
    },

    async refreshUser() {
      try {
        const response = await authService.getMe();
        currentUser = toAuthUser(response);
        listeners.forEach((cb) => cb(currentUser));
      } catch {
        // ignore
      }
    },

    async signOut() {
      try {
        await authService.logout();
      } catch {
        // Best-effort server logout
      }
      currentUser = null;
      listeners.forEach((cb) => cb(null));
    },

    onAuthStateChange(callback) {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
  };
}
