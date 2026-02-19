import { ApiError } from "./errors";

interface HttpClientConfig {
  baseUrl: string;
  getAuthHeaders?: () => Record<string, string>;
}

export function createHttpClient(config: HttpClientConfig) {
  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const authHeaders = config.getAuthHeaders?.() ?? {};

    const response = await fetch(`${config.baseUrl}${path}`, {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let body: { message?: string; code?: number } | undefined;
      try {
        body = await response.json();
      } catch {
        // Response body not JSON
      }
      throw ApiError.fromResponse(response, body);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json();
    }

    return response.text() as unknown as T;
  }

  function get<T>(path: string): Promise<T> {
    return request<T>(path, { method: "GET" });
  }

  function post<T>(path: string, body?: unknown): Promise<T> {
    const isFormData = body instanceof FormData;
    return request<T>(path, {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  }

  return { get, post, request };
}

export type HttpClient = ReturnType<typeof createHttpClient>;
