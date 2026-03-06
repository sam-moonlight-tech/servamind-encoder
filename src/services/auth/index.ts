import type { AuthProvider } from "./auth.provider";
import { env } from "@/config/env";
import { createGoogleAuthProvider } from "./adapters/google.adapter";
import { createMockAuthProvider } from "./adapters/mock.adapter";

export function createAuthProvider(): AuthProvider {
  if (env.authProvider === "mock") {
    return createMockAuthProvider();
  }
  return createGoogleAuthProvider();
}

export type { AuthProvider } from "./auth.provider";
export type { SignInCredentials } from "./auth.provider";
