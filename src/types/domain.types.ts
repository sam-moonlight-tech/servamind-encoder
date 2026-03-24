export type WorkflowStage = "upload" | "encoding" | "download" | "error";

export type ProcessType = "compress" | "decompress";

export interface AuthUser {
  id: string;
  email: string;
  planType: string;
  subscriptionStatus: string;
  betaTierActive: boolean;
  betaEnrolledAt: string | null;
  onboardingSeen: boolean;
  createdAt: string;
}

export interface ApiKeyInfo {
  keyId: string;
  apiKey: string;
  keyPrefix: string;
  createdAt: string;
}

export interface FileTableItem {
  name: string;
  typeLabel: string;
  formattedSize: string;
  status: "ready" | "uploading" | "encoding" | "encoded" | "complete" | "error" | "waiting";
  sizeError: string | null;
  encodingProgress?: number;
  encodedSize?: string;
  reductionPercent?: number;
  durationSeconds?: number;
}

export interface FileResult {
  fileName: string;
  originalSize: number;
  encodedSize: number | null;
  fileId: string;
  downloadUrl: string;
  durationMs: number | null;
}

export interface FeatureFlags {
  enableGoogleDrive: boolean;
  showGoogleDriveUpload: boolean;
  showUploadMetrics: boolean;
  showCompressionMetrics: boolean;
  systemDown: boolean;
  demoMode: boolean;
}
