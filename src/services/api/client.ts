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
      let body: { detail?: string } | undefined;
      try {
        body = await response.json();
      } catch {
        // Response body not JSON
      }
      throw ApiError.fromResponse(response, body);
    }

    if (response.status === 204) {
      return undefined as T;
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

  function postBinary<T>(
    path: string,
    body: ArrayBuffer,
    headers?: Record<string, string>
  ): Promise<T> {
    return request<T>(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        ...headers,
      },
      body,
    });
  }

  async function getBlob(path: string): Promise<Response> {
    const authHeaders = config.getAuthHeaders?.() ?? {};

    const response = await fetch(`${config.baseUrl}${path}`, {
      method: "GET",
      headers: { ...authHeaders },
    });

    if (!response.ok) {
      let body: { detail?: string } | undefined;
      try {
        body = await response.json();
      } catch {
        // Response body not JSON
      }
      throw ApiError.fromResponse(response, body);
    }

    return response;
  }

  function del<T>(path: string): Promise<T> {
    return request<T>(path, { method: "DELETE" });
  }

  return { get, post, postBinary, getBlob, del, request };
}

export type HttpClient = ReturnType<typeof createHttpClient>;
