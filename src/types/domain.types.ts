export type WorkflowStage = "upload" | "processing" | "download" | "error";

export type ProcessType = "compress" | "decompress";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface FileTableItem {
  name: string;
  typeLabel: string;
  formattedSize: string;
  status: "ready" | "error";
  sizeError: string | null;
}

export interface FeatureFlags {
  enableGoogleDrive: boolean;
  showGoogleDriveUpload: boolean;
  showUploadMetrics: boolean;
  showCompressionMetrics: boolean;
  systemDown: boolean;
  demoMode: boolean;
}
