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

export interface GoogleCallbackResponse {
  user_id: string;
  email: string;
  plan_type: "free" | "premium";
  subscription_status: "active" | "canceled" | "past_due" | "none";
  beta_tier_active: boolean;
  beta_enrolled_at: string | null;
  created_at: string;
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
