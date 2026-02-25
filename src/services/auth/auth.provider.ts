import type { AuthUser } from "@/types/domain.types";

export interface SignInCredentials {
  googleToken?: string;
  username?: string;
  password?: string;
}

export interface AuthProvider {
  initialize(): Promise<void>;
  getUser(): AuthUser | null;
  getAuthHeaders(): Record<string, string>;
  signIn(credentials?: SignInCredentials): Promise<AuthUser>;
  signOut(): Promise<void>;
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}
