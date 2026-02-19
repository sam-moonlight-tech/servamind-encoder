import type { AuthUser } from "@/types/domain.types";

export interface AuthProvider {
  initialize(): Promise<void>;
  getUser(): AuthUser | null;
  getAuthHeaders(): Record<string, string>;
  signIn(credentials?: { username: string; password: string }): Promise<AuthUser>;
  signOut(): Promise<void>;
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}
