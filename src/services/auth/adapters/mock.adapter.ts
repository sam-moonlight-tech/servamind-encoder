import type { AuthUser } from "@/types/domain.types";
import type { AuthProvider } from "../auth.provider";

const MOCK_USER: AuthUser = {
  id: "mock-user-001",
  email: "dev@servamind.com",
  name: null,
  planType: "free",
  subscriptionStatus: "active",
  betaTierActive: true,
  betaEnrolledAt: "2026-01-01T00:00:00Z",
  onboardingSeen: false,
  createdAt: "2026-01-01T00:00:00Z",
};

export function createMockAuthProvider(): AuthProvider {
  let currentUser: AuthUser | null = null;
  const listeners = new Set<(user: AuthUser | null) => void>();

  return {
    async initialize() {
      // Don't auto-authenticate — let the onboarding flow handle sign-in
    },

    getUser() {
      return currentUser;
    },

    getAuthHeaders() {
      if (currentUser) {
        return { Authorization: "Bearer mock-token" };
      }
      return {} as Record<string, string>;
    },

    async signIn() {
      currentUser = MOCK_USER;
      listeners.forEach((cb) => cb(currentUser));
      return currentUser;
    },

    async refreshUser() {
      // No-op for mock
    },

    async signOut() {
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
