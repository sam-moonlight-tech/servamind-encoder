import { env } from "@/config/env";
import type { AuthProvider } from "./auth.provider";
import { createMockAuthProvider } from "./adapters/mock.adapter";
import { createCognitoAuthProvider } from "./adapters/cognito.adapter";

export function createAuthProvider(): AuthProvider {
  switch (env.authProvider) {
    case "cognito":
      return createCognitoAuthProvider();
    case "mock":
    default:
      return createMockAuthProvider();
  }
}

export type { AuthProvider } from "./auth.provider";
