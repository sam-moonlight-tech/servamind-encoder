export type WorkflowStage = "upload" | "encoding" | "download" | "error";

export type ProcessType = "compress" | "decompress";

export interface AuthUser {
  id: string;
  email: string;
  googleId: string;
  planType: string;
  subscriptionStatus: string;
  betaTierActive: boolean;
  betaEnrolledAt: string;
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
  status: "ready" | "uploading" | "complete" | "error";
  sizeError: string | null;
}

export interface FileResult {
  fileName: string;
  originalSize: number;
  encodedSize: number | null;
  fileId: string;
  downloadUrl: string;
}

export interface FeatureFlags {
  enableGoogleDrive: boolean;
  showGoogleDriveUpload: boolean;
  showUploadMetrics: boolean;
  showCompressionMetrics: boolean;
  systemDown: boolean;
  demoMode: boolean;
}
