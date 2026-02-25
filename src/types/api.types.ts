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
  google_id: string;
  plan_type: string;
  subscription_status: string;
  beta_tier_active: boolean;
  beta_enrolled_at: string;
  created_at: string;
  session_token: string;
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
  created_at: string;
  last_used_at: string | null;
}

export type ListApiKeysResponse = ApiKeyItem[];

// Encoding
export interface EncodeInitPayload {
  file_reference: string;
  idempotency_key: string;
  file_size_bytes: number;
  user_password: string;
}

export interface EncodeInitResponse {
  file_id: string;
  download_url: string;
  streaming_token: string;
}

export interface EncodeStreamResponse {
  status: string;
}

// Decoding
export interface DecodeInitPayload {
  file_reference: string;
  file_size_bytes: number;
  user_password: string;
}

export interface DecodeInitResponse {
  streaming_token: string;
}

export interface DecodeStreamResponse {
  status: string;
}

// Quota
export interface QuotaResponse {
  plan_type: string;
  total_bytes_this_month: number;
  quota_bytes: number;
  quota_remaining_bytes: number;
  percentage_used: number;
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
