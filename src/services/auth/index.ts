import type { AuthProvider } from "./auth.provider";
import { createGoogleAuthProvider } from "./adapters/google.adapter";

export function createAuthProvider(): AuthProvider {
  return createGoogleAuthProvider();
}

export type { AuthProvider } from "./auth.provider";
export type { SignInCredentials } from "./auth.provider";
