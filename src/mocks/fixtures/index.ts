import type {
  GoogleCallbackResponse,
  CreateApiKeyResponse,
  ListApiKeysResponse,
  EncodeInitResponse,
  EncodeStreamResponse,
  DecodeInitResponse,
  DecodeStreamResponse,
  QuotaResponse,
  PublicStatsResponse,
  ExtensionsStatsResponse,
  AuthHealthResponse,
  BackendHealthResponse,
} from "@/types/api.types";

export const mockGoogleCallbackResponse: GoogleCallbackResponse = {
  user_id: "dev-user",
  email: "dev@example.com",
  google_id: "google-dev-123",
  plan_type: "beta",
  subscription_status: "active",
  beta_tier_active: true,
  beta_enrolled_at: "2025-01-01T00:00:00Z",
  created_at: "2025-01-01T00:00:00Z",
  session_token: "mock_session_token_dev",
};

export const mockCreateApiKeyResponse: CreateApiKeyResponse = {
  key_id: "key_abc123",
  raw_key: "sk_dev_mock_api_key_for_testing",
  key_prefix: "sk_dev_",
  created_at: "2025-01-15T10:30:00Z",
};

export const mockListApiKeysResponse: ListApiKeysResponse = [
  {
    key_id: "key_abc123",
    key_prefix: "sk_dev_",
    created_at: "2025-01-15T10:30:00Z",
    last_used_at: "2025-02-01T08:00:00Z",
  },
];

export const mockEncodeInitResponse: EncodeInitResponse = {
  file_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  download_url: "https://api.servaencoder.com/download/6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  streaming_token: "mock_streaming_token_encode",
};

export const mockEncodeStreamResponse: EncodeStreamResponse = {
  status: "complete",
};

export const mockDecodeInitResponse: DecodeInitResponse = {
  streaming_token: "mock_streaming_token_decode",
};

export const mockDecodeStreamResponse: DecodeStreamResponse = {
  status: "complete",
};

export const mockQuotaResponse: QuotaResponse = {
  plan_type: "beta",
  total_bytes_this_month: 1_073_741_824,
  quota_bytes: 5_368_709_120,
  quota_remaining_bytes: 4_294_967_296,
  percentage_used: 20,
};

export const mockPublicStatsResponse: PublicStatsResponse = {
  platform_total_input_bytes: 10_737_418_240,
  platform_total_output_bytes: 5_368_709_120,
  platform_total_savings_bytes: 5_368_709_120,
  platform_average_compression_ratio: 0.5,
  platform_total_files_encoded: 12847,
};

export const mockExtensionsStatsResponse: ExtensionsStatsResponse = {
  total_files_encoded: 12847,
  extensions: [
    { extension: "pdf", count: 5200, percent_of_total: 40.5 },
    { extension: "csv", count: 3100, percent_of_total: 24.1 },
    { extension: "json", count: 2400, percent_of_total: 18.7 },
    { extension: "txt", count: 2147, percent_of_total: 16.7 },
  ],
};

export const mockAuthHealthResponse: AuthHealthResponse = {
  status: "healthy",
  service: "serva-auth",
};

export const mockBackendHealthResponse: BackendHealthResponse = {
  status: "healthy",
  service: "serva-encoder",
  active_jobs: 3,
  encoded_files: 12847,
};
