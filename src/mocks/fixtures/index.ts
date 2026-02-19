import type {
  FileReceipt,
  ProcessingReceipts,
  CompressionState,
  CompressionStatus,
  SystemStats,
} from "@/types/api.types";

export const mockFileReceipt: FileReceipt = {
  userID: "dev-user",
  fileName: "example.pdf",
  conductorID: "550e8400-e29b-41d4-a716-446655440000",
  fileID: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
};

export const mockProcessingReceipts: ProcessingReceipts = [mockFileReceipt];

export const mockCompressionState: CompressionState = {
  state: "compressing",
};

export const mockCompressionStatus: CompressionStatus = {
  compressionStatus: 45,
  currentActivity: "processing",
};

export const mockSystemStats: SystemStats = {
  files: 12847,
  bytesSaved: 5_368_709_120,
};
