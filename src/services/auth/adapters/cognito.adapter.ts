import type { AuthProvider } from "../auth.provider";

export function createCognitoAuthProvider(): AuthProvider {
  // Placeholder for future AWS Cognito implementation
  throw new Error(
    "Cognito auth provider is not yet implemented. Use VITE_AUTH_PROVIDER=mock for development."
  );
}
