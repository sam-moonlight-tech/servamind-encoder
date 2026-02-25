import { http, HttpResponse } from "msw";
import { env } from "@/config/env";
import {
  mockGoogleCallbackResponse,
  mockCreateApiKeyResponse,
  mockListApiKeysResponse,
  mockEncodeInitResponse,
  mockEncodeStreamResponse,
  mockDecodeInitResponse,
  mockQuotaResponse,
  mockPublicStatsResponse,
  mockExtensionsStatsResponse,
  mockAuthHealthResponse,
  mockBackendHealthResponse,
} from "./fixtures";

const authUrl = env.authApiUrl;
const backendUrl = env.backendApiUrl;

export const handlers = [
  // Auth
  http.post(`${authUrl}/auth/google/callback`, () => {
    return HttpResponse.json(mockGoogleCallbackResponse);
  }),

  http.post(`${authUrl}/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // API Keys
  http.post(`${authUrl}/keys`, () => {
    return HttpResponse.json(mockCreateApiKeyResponse);
  }),

  http.get(`${authUrl}/keys`, () => {
    return HttpResponse.json(mockListApiKeysResponse);
  }),

  http.delete(`${authUrl}/keys/:keyId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Encoding (init → auth, stream → backend)
  http.post(`${authUrl}/api/encode`, () => {
    return HttpResponse.json(mockEncodeInitResponse);
  }),

  http.post(`${backendUrl}/api/stream/:fileRef`, () => {
    return HttpResponse.json(mockEncodeStreamResponse);
  }),

  // Decoding (init → auth, stream → backend)
  http.post(`${authUrl}/api/decode`, () => {
    return HttpResponse.json(mockDecodeInitResponse);
  }),

  // Download
  http.get(`${backendUrl}/download/:fileId`, () => {
    return new HttpResponse(new Uint8Array([0x00, 0x01, 0x02]), {
      headers: { "Content-Type": "application/octet-stream" },
    });
  }),

  // Quota
  http.get(`${authUrl}/quota`, () => {
    return HttpResponse.json(mockQuotaResponse);
  }),

  // Stats
  http.get(`${backendUrl}/api/stats/public`, () => {
    return HttpResponse.json(mockPublicStatsResponse);
  }),

  http.get(`${backendUrl}/api/stats/extensions`, () => {
    return HttpResponse.json(mockExtensionsStatsResponse);
  }),

  // Health
  http.get(`${authUrl}/health`, () => {
    return HttpResponse.json(mockAuthHealthResponse);
  }),

  http.get(`${backendUrl}/health`, () => {
    return HttpResponse.json(mockBackendHealthResponse);
  }),
];
