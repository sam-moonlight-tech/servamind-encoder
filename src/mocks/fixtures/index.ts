import type {
  GoogleCallbackResponse,
  CreateApiKeyResponse,
  ListApiKeysResponse,
  EncodeInitResponse,
  EncodeStreamResponse,
  DecodeInitResponse,
  DecodeStreamResponse,
  UsageResponse,
  PublicStatsResponse,
  ExtensionsStatsResponse,
  AuthHealthResponse,
  BackendHealthResponse,
  EmailSendLinkResponse,
  SetupIntentResponse,
  ListPaymentMethodsResponse,
  PaymentMethod,
} from "@/types/api.types";

export const mockGoogleCallbackResponse: GoogleCallbackResponse = {
  user_id: "dev-user",
  email: "dev@example.com",
  plan_type: "free",
  subscription_status: "active",
  beta_tier_active: true,
  beta_enrolled_at: "2025-01-01T00:00:00Z",
  onboarding_seen: false,
  created_at: "2025-01-01T00:00:00Z",
};

export const mockEmailSendLinkResponse: EmailSendLinkResponse = {
  success: true,
  message: "Magic link sent successfully",
};

export const mockEmailVerifyResponse: GoogleCallbackResponse = {
  user_id: "dev-user-email",
  email: "dev@example.com",
  plan_type: "free",
  subscription_status: "active",
  beta_tier_active: true,
  beta_enrolled_at: "2025-01-01T00:00:00Z",
  onboarding_seen: false,
  created_at: "2025-01-01T00:00:00Z",
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
    revoked: false,
    created_at: "2025-01-15T10:30:00Z",
    last_used_at: "2025-02-01T08:00:00Z",
  },
];

export const mockEncodeInitResponse: EncodeInitResponse = {
  file_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  download_url: "/download/6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  streaming_token: "mock_streaming_token_encode",
};

export const mockEncodeStreamResponse: EncodeStreamResponse = {
  status: "complete",
  file_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  original_size_bytes: 1024,
  encoded_size_bytes: 480,
  file_size_bytes: 530,
};

export const mockDecodeInitResponse: DecodeInitResponse = {
  streaming_token: "mock_streaming_token_decode",
  file_reference: "7ca8c921-0ebe-22e2-91c5-11d15ge541d9",
};

export const mockDecodeStreamResponse: DecodeStreamResponse = {
  file_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  original_filename: "test-file.pdf",
  file_size_bytes: 1024,
  download_url: "/download/6ba7b810-9dad-11d1-80b4-00c04fd430c8",
};

export const mockUsageResponse: UsageResponse = {
  user_id: "dev-user",
  beta_tier_active: true,
  beta_expiry_date: "2026-06-01T00:00:00Z",
  usage_this_month_bytes: 1_099_511_627_676, // ~1 TB minus 100 bytes — any file triggers usage limit modal
  quota_limit_bytes: 1_099_511_627_776,     // 1 TB
  quota_used_percent: 99.99,
  overage_bytes: 0,
  overage_charges: 0,
  total_lifetime_tb_encoded: 0.9,
  estimated_savings_bytes: 483_183_820_800,
  quota_resets_at: "2026-04-01T00:00:00Z",
};

export const mockPublicStatsResponse: PublicStatsResponse = {
  platform_total_input_bytes: 10_737_418_240,
  platform_total_output_bytes: 5_368_709_120,
  platform_total_savings_bytes: 5_368_709_120,
  platform_average_compression_ratio: 50.0,
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

export const mockSetupIntentResponse: SetupIntentResponse = {
  client_secret: "seti_mock_secret_1234_secret_5678",
  stripe_customer_id: "cus_mock_12345",
};

export const mockPaymentMethod: PaymentMethod = {
  id: "pm_mock_visa_1",
  type: "card",
  is_default: true,
  brand: "visa",
  last4: "4242",
  exp_month: 12,
  exp_year: 2027,
  link_email: "",
  bank_name: "",
};

export const mockListPaymentMethodsResponse: ListPaymentMethodsResponse = {
  payment_methods: [mockPaymentMethod],
  has_payment_method: true,
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
