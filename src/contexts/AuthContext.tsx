import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser, ApiKeyInfo } from "@/types/domain.types";
import type { SignInCredentials } from "@/services/auth";
import { createAuthProvider } from "@/services/auth";
import type { AuthProvider as AuthProviderInterface } from "@/services/auth";
import { setAuthHeadersFn, authService } from "@/services/api";

const API_KEY_STORAGE_KEY = "serva_api_key";
const API_KEY_INFO_STORAGE_KEY = "serva_api_key_info";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  apiKey: string | null;
  apiKeyInfo: ApiKeyInfo | null;
  signIn: (credentials?: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  createApiKey: () => Promise<ApiKeyInfo>;
  revokeApiKey: () => Promise<void>;
  setApiKey: (key: string | null) => void;
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
  const [apiKey, setApiKeyState] = useState<string | null>(
    () => localStorage.getItem(API_KEY_STORAGE_KEY)
  );
  const [apiKeyInfo, setApiKeyInfo] = useState<ApiKeyInfo | null>(() => {
    const stored = localStorage.getItem(API_KEY_INFO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

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
    async (credentials?: SignInCredentials) => {
      await provider.signIn(credentials);
    },
    [provider]
  );

  const signOut = useCallback(async () => {
    await provider.signOut();
    // API keys survive sign-out — they're used by CLI independently
  }, [provider]);

  const createApiKeyFn = useCallback(async (): Promise<ApiKeyInfo> => {
    const response = await authService.createApiKey();
    const info: ApiKeyInfo = {
      keyId: response.key_id,
      apiKey: response.raw_key,
      keyPrefix: response.key_prefix,
      createdAt: response.created_at,
    };
    setApiKeyState(response.raw_key);
    setApiKeyInfo(info);
    localStorage.setItem(API_KEY_STORAGE_KEY, response.raw_key);
    localStorage.setItem(API_KEY_INFO_STORAGE_KEY, JSON.stringify(info));
    return info;
  }, []);

  const revokeApiKeyFn = useCallback(async () => {
    if (!apiKeyInfo) return;
    await authService.revokeApiKey(apiKeyInfo.keyId);
    setApiKeyState(null);
    setApiKeyInfo(null);
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    localStorage.removeItem(API_KEY_INFO_STORAGE_KEY);
  }, [apiKeyInfo]);

  const setApiKey = useCallback((key: string | null) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      apiKey,
      apiKeyInfo,
      signIn,
      signOut,
      createApiKey: createApiKeyFn,
      revokeApiKey: revokeApiKeyFn,
      setApiKey,
    }),
    [user, isLoading, apiKey, apiKeyInfo, signIn, signOut, createApiKeyFn, revokeApiKeyFn, setApiKey]
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
