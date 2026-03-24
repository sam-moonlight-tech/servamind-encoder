import { http, HttpResponse, delay } from "msw";
import { env } from "@/config/env";
import {
  mockGoogleCallbackResponse,
  mockEmailSendLinkResponse,
  mockEmailVerifyResponse,
  mockCreateApiKeyResponse,
  mockListApiKeysResponse,
  mockEncodeInitResponse,
  mockEncodeStreamResponse,
  mockDecodeInitResponse,
  mockUsageResponse,
  mockPublicStatsResponse,
  mockExtensionsStatsResponse,
  mockAuthHealthResponse,
  mockBackendHealthResponse,
  mockSetupIntentResponse,
  mockListPaymentMethodsResponse,
} from "./fixtures";

const baseUrl = env.apiUrl;

// Counter to simulate per-file failures (every 2nd encode init fails)
let encodeInitCount = 0;

export const handlers = [
  // Auth
  http.post(`${baseUrl}/auth/google/callback`, () => {
    return HttpResponse.json(mockGoogleCallbackResponse);
  }),

  http.get(`${baseUrl}/auth/me`, () => {
    return HttpResponse.json(mockGoogleCallbackResponse);
  }),

  http.post(`${baseUrl}/auth/email/send-link`, async () => {
    await delay(500);
    return HttpResponse.json(mockEmailSendLinkResponse);
  }),

  http.post(`${baseUrl}/auth/email/verify`, async () => {
    await delay(300);
    return HttpResponse.json(mockEmailVerifyResponse);
  }),

  http.patch(`${baseUrl}/auth/me/onboarding-seen`, () => {
    return HttpResponse.json({
      ...mockGoogleCallbackResponse,
      onboarding_seen: true,
    });
  }),

  http.post(`${baseUrl}/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // API Keys
  http.post(`${baseUrl}/keys`, () => {
    return HttpResponse.json(mockCreateApiKeyResponse);
  }),

  http.get(`${baseUrl}/keys`, () => {
    return HttpResponse.json(mockListApiKeysResponse);
  }),

  http.delete(`${baseUrl}/keys/:keyId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Encoding — every 2nd request fails to test per-file error handling
  http.post(`${baseUrl}/api/encode`, async () => {
    await delay(500);
    encodeInitCount++;
    if (encodeInitCount % 2 === 0) {
      return HttpResponse.json({ detail: "Encoding failed" }, { status: 500 });
    }
    return HttpResponse.json(mockEncodeInitResponse);
  }),

  http.post(`${baseUrl}/api/stream/:fileRef`, async () => {
    await delay(1500);
    return HttpResponse.json(mockEncodeStreamResponse);
  }),

  // Decoding
  http.post(`${baseUrl}/api/decode`, () => {
    return HttpResponse.json(mockDecodeInitResponse);
  }),

  // Download
  http.get(`${baseUrl}/download/:fileId`, async () => {
    await delay(300);
    const encodedBlob = new Uint8Array(530);
    crypto.getRandomValues(encodedBlob);
    return new HttpResponse(encodedBlob, {
      headers: { "Content-Type": "application/octet-stream" },
    });
  }),

  // Usage
  http.get(`${baseUrl}/api/usage`, () => {
    return HttpResponse.json(mockUsageResponse);
  }),

  // Stats
  http.get(`${baseUrl}/api/stats/public`, () => {
    return HttpResponse.json(mockPublicStatsResponse);
  }),

  http.get(`${baseUrl}/api/stats/extensions`, () => {
    return HttpResponse.json(mockExtensionsStatsResponse);
  }),

  // Stripe / Billing
  http.post(`${baseUrl}/api/stripe/create-setup-intent`, async () => {
    await delay(300);
    return HttpResponse.json(mockSetupIntentResponse);
  }),

  http.get(`${baseUrl}/api/stripe/payment-methods`, () => {
    return HttpResponse.json(mockListPaymentMethodsResponse);
  }),

  // Health
  http.get(`${baseUrl}/health`, () => {
    return HttpResponse.json(mockAuthHealthResponse);
  }),

  http.get(`${baseUrl}/backend/health`, () => {
    return HttpResponse.json(mockBackendHealthResponse);
  }),
];
