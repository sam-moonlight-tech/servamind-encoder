import type { AuthUser } from "@/types/domain.types";
import type { AuthProvider } from "../auth.provider";

const MOCK_USER: AuthUser = {
  id: "dev-user",
  email: "dev@example.com",
  username: "dev-user",
};

export function createMockAuthProvider(): AuthProvider {
  let currentUser: AuthUser | null = null;
  const listeners = new Set<(user: AuthUser | null) => void>();

  return {
    async initialize() {},

    getUser() {
      return currentUser;
    },

    getAuthHeaders() {
      return {};
    },

    async signIn() {
      currentUser = MOCK_USER;
      listeners.forEach((cb) => cb(currentUser));
      return MOCK_USER;
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
