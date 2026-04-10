import { http, HttpResponse, delay } from "msw";
import { env } from "@/config/env";
import {
  mockAuthUserResponse,
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

// Mutable mock user state (persists across requests within a session)
const mockUser = { ...mockAuthUserResponse };

export const handlers = [
  // Auth
  http.post(`${baseUrl}/auth/google/callback`, () => {
    return HttpResponse.json(mockUser);
  }),

  http.get(`${baseUrl}/auth/me`, () => {
    return HttpResponse.json(mockUser);
  }),

  http.post(`${baseUrl}/auth/email/send-link`, async () => {
    await delay(500);
    return HttpResponse.json(mockEmailSendLinkResponse);
  }),

  http.post(`${baseUrl}/auth/email/verify`, async () => {
    await delay(300);
    return HttpResponse.json(mockEmailVerifyResponse);
  }),

  http.patch(`${baseUrl}/auth/me`, async ({ request }) => {
    const body = await request.json() as { name?: string };
    if (body.name !== undefined) mockUser.name = body.name;
    return HttpResponse.json(mockUser);
  }),

  http.delete(`${baseUrl}/auth/me`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${baseUrl}/auth/me/accept-terms`, () => {
    // Idempotent — only set the first time.
    if (mockUser.terms_accepted_at == null) {
      mockUser.terms_accepted_at = new Date().toISOString();
    }
    return HttpResponse.json(mockUser);
  }),

  http.patch(`${baseUrl}/auth/me/onboarding-seen`, () => {
    mockUser.onboarding_seen = true;
    return HttpResponse.json(mockUser);
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

  // Encoding — returns 402 when no payment method, otherwise every 2nd request fails
  http.post(`${baseUrl}/api/encode`, async () => {
    await delay(500);
    if (!mockListPaymentMethodsResponse.has_payment_method) {
      return HttpResponse.json(
        { detail: "Payment method required", code: "payment_method_required" },
        { status: 402 },
      );
    }
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

  // Encode Cancel
  http.post(`${baseUrl}/api/encode/cancel`, async () => {
    await delay(200);
    return HttpResponse.json({
      encode_token_revoked: true,
      job_cancelled: true,
      quota_released_bytes: 1024,
      job_cancel_reason: null,
    });
  }),

  // Decoding
  http.post(`${baseUrl}/api/decode`, () => {
    return HttpResponse.json(mockDecodeInitResponse);
  }),

  // Decode Cancel
  http.post(`${baseUrl}/api/decode/cancel`, async () => {
    await delay(200);
    return HttpResponse.json({
      decode_token_revoked: true,
    });
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

  http.post(`${baseUrl}/api/stripe/payment-methods/default`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${baseUrl}/api/stripe/payment-methods/:paymentMethodId`, () => {
    mockListPaymentMethodsResponse.payment_methods = [];
    mockListPaymentMethodsResponse.has_payment_method = false;
    return new HttpResponse(null, { status: 204 });
  }),

  // Health
  http.get(`${baseUrl}/health`, () => {
    return HttpResponse.json(mockAuthHealthResponse);
  }),

  http.get(`${baseUrl}/backend/health`, () => {
    return HttpResponse.json(mockBackendHealthResponse);
  }),
];
