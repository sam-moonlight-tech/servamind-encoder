import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser } from "@/types/domain.types";
import { createAuthProvider } from "@/services/auth";
import type { AuthProvider as AuthProviderInterface } from "@/services/auth";
import { setAuthHeadersFn } from "@/services/api";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials?: {
    username: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

let authProviderInstance: AuthProviderInterface | null = null;

function getAuthProvider() {
  if (!authProviderInstance) {
    authProviderInstance = createAuthProvider();
  }
  return authProviderInstance;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const provider = useMemo(() => getAuthProvider(), []);

  useEffect(() => {
    setAuthHeadersFn(() => provider.getAuthHeaders());

    provider.initialize().then(() => {
      setUser(provider.getUser());
      setIsLoading(false);
    });

    const unsub = provider.onAuthStateChange(setUser);
    return unsub;
  }, [provider]);

  const signIn = useCallback(
    async (credentials?: { username: string; password: string }) => {
      await provider.signIn(credentials);
    },
    [provider]
  );

  const signOut = useCallback(async () => {
    await provider.signOut();
  }, [provider]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signOut,
    }),
    [user, isLoading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
