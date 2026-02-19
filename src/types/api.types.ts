export interface GeneralError {
  code?: number;
  message?: string;
}

export interface FileReceipt {
  userID?: string;
  fileName?: string;
  conductorID?: string;
  fileID?: string;
}

export type ProcessingReceipts = FileReceipt[];

export interface CompressionStatus {
  compressionStatus?: number;
  currentActivity?: string;
}

export interface CompressionState {
  state?: "uploading" | "downloading" | "compressing" | "decompressing";
}

export interface SystemStats {
  files?: number;
  bytesSaved?: number;
}

export interface UploadFilePayload {
  userID: string;
  file: File;
  compress: boolean;
  checksum: string;
  privateKey: string;
}

export interface LoginPayload {
  username: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}
