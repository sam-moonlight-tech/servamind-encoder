import type { AuthUser } from "@/types/domain.types";
import type { AuthProvider, SignInCredentials } from "../auth.provider";
import { authService } from "@/services/api";

const SESSION_TOKEN_KEY = "serva_session_token";
const USER_KEY = "serva_user";

export function createGoogleAuthProvider(): AuthProvider {
  let currentUser: AuthUser | null = null;
  const listeners = new Set<(user: AuthUser | null) => void>();

  function getStoredToken(): string | null {
    return sessionStorage.getItem(SESSION_TOKEN_KEY);
  }

  function storeToken(token: string) {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  }

  function storeUser(user: AuthUser) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  return {
    async initialize() {
      const token = getStoredToken();
      const storedUser = sessionStorage.getItem(USER_KEY);
      if (token && storedUser) {
        currentUser = JSON.parse(storedUser);
      }
    },

    getUser() {
      return currentUser;
    },

    getAuthHeaders(): Record<string, string> {
      const token = getStoredToken();
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
      return {};
    },

    async signIn(credentials?: SignInCredentials) {
      if (!credentials?.googleToken) {
        throw new Error("Google token is required for Google sign-in");
      }

      const response = await authService.googleCallback({
        token: credentials.googleToken,
      });

      storeToken(response.session_token);

      currentUser = {
        id: response.user_id,
        email: response.email,
        googleId: response.google_id,
        planType: response.plan_type,
        subscriptionStatus: response.subscription_status,
        betaTierActive: response.beta_tier_active,
        betaEnrolledAt: response.beta_enrolled_at,
        createdAt: response.created_at,
      };

      storeUser(currentUser);
      listeners.forEach((cb) => cb(currentUser));
      return currentUser;
    },

    async signOut() {
      try {
        await authService.logout();
      } catch {
        // Best-effort server logout
      }
      currentUser = null;
      clearSession();
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
