// Shared
export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiErrorBody {
  detail: string;
}

// Auth
export interface GoogleCallbackPayload {
  token: string;
}

export interface AuthUserResponse {
  user_id: string;
  email: string;
  name: string | null;
  plan_type: "free" | "premium";
  subscription_status: "active" | "canceled" | "past_due" | "none";
  beta_tier_active: boolean;
  beta_enrolled_at: string | null;
  terms_accepted_at: string | null;
  onboarding_seen: boolean;
  created_at: string;
}

export interface ProfileNameUpdatePayload {
  name: string;
}

export interface OnboardingSeenUpdate {
  seen: boolean;
}

// API Keys
export interface CreateApiKeyResponse {
  key_id: string;
  raw_key: string;
  key_prefix: string;
  created_at: string;
}

export interface ApiKeyItem {
  key_id: string;
  key_prefix: string;
  revoked: boolean;
  created_at: string;
  last_used_at: string | null;
}

export type ListApiKeysResponse = ApiKeyItem[];

// Encoding
export interface EncodeInitPayload {
  file_reference: string;
  idempotency_key: string;
  file_size_bytes: number;
  file_extension?: string;
  original_filename?: string;
  user_password: string;
}

export interface EncodeInitResponse {
  file_id: string;
  download_url: string;
  streaming_token: string;
}

export interface EncodeStreamResponse {
  status: string;
  file_id: string;
  original_size_bytes: number;
  encoded_size_bytes: number;
  file_size_bytes: number;
  savings_percent: number;
  original_sha256_hex: string;
  decoded_sha256_hex: string;
  roundtrip_hashes_match: boolean;
}

// Encode Cancel
export interface EncodeCancelPayload {
  file_reference: string;
  idempotency_key?: string;
}

export interface EncodeCancelResponse {
  encode_token_revoked: boolean;
  job_cancelled: boolean;
  quota_released_bytes: number | null;
  job_cancel_reason: string | null;
}

// Decoding
export interface DecodeInitPayload {
  file_reference: string;
  file_size_bytes: number;
  user_password: string;
}

export interface DecodeInitResponse {
  streaming_token: string;
  file_reference: string;
}

export interface DecodeStreamResponse {
  file_id: string;
  original_filename: string;
  file_size_bytes: number;
  download_url: string;
}

// Decode Cancel
export interface DecodeCancelPayload {
  file_reference: string;
}

export interface DecodeCancelResponse {
  decode_token_revoked: boolean;
}

// Usage
export interface UsageResponse {
  user_id: string;
  beta_tier_active: boolean;
  beta_expiry_date: string;
  usage_this_month_bytes: number;
  quota_limit_bytes: number | null;
  quota_used_percent: number;
  overage_bytes: number;
  overage_charges: number;
  total_lifetime_tb_encoded: number;
  estimated_savings_bytes: number;
  quota_resets_at: string;
}

// Stats
export interface PublicStatsResponse {
  platform_total_input_bytes: number;
  platform_total_output_bytes: number;
  platform_total_savings_bytes: number;
  platform_average_compression_ratio: number;
  platform_total_files_encoded: number;
}

export interface ExtensionStat {
  extension: string;
  count: number;
  percent_of_total: number;
}

export interface ExtensionsStatsResponse {
  total_files_encoded: number;
  extensions: ExtensionStat[];
}

// Email Auth
export interface EmailSendLinkPayload {
  email: string;
}

export interface EmailSendLinkResponse {
  success: boolean;
  message: string;
}

export interface EmailVerifyPayload {
  token: string;
}

// Stripe / Billing
export interface SetupIntentResponse {
  client_secret: string;
  stripe_customer_id: string;
}

export interface PaymentMethodRequiredErrorBody {
  error: "payment_method_required";
  message: string;
  add_payment_path: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  is_default: boolean;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  link_email: string;
  bank_name: string;
}

export interface ListPaymentMethodsResponse {
  payment_methods: PaymentMethod[];
  has_payment_method: boolean;
}

// Health
export interface AuthHealthResponse {
  status: string;
  service: string;
}

export interface BackendHealthResponse {
  status: string;
  service: string;
  active_jobs: number;
  encoded_files: number;
}
