import type {
  FileReceipt,
  ProcessingReceipts,
  CompressionState,
  CompressionStatus,
  LoginPayload,
  UploadFilePayload,
} from "@/types/api.types";
import type { HttpClient } from "./client";

export interface EncoderService {
  loginUser(payload: LoginPayload): Promise<ProcessingReceipts>;
  uploadFile(payload: UploadFilePayload): Promise<FileReceipt>;
  getCompressionState(receipt: FileReceipt): Promise<CompressionState>;
  getCompressionStatus(receipt: FileReceipt): Promise<CompressionStatus>;
  startCompression(): Promise<void>;
  cancelCompression(): Promise<void>;
  pauseCompression(): Promise<void>;
  resumeCompression(): Promise<void>;
}

export function createEncoderService(client: HttpClient): EncoderService {
  return {
    loginUser(payload) {
      return client.post<ProcessingReceipts>("/loginUser", payload);
    },

    uploadFile(payload) {
      const formData = new FormData();
      formData.append("userID", payload.userID);
      formData.append("file", payload.file);
      formData.append("compress", String(payload.compress));
      formData.append("checksum", payload.checksum);
      formData.append("privateKey", payload.privateKey);
      return client.post<FileReceipt>("/uploadFile", formData);
    },

    getCompressionState(receipt) {
      return client.post<CompressionState>("/compressionState", receipt);
    },

    getCompressionStatus(receipt) {
      return client.post<CompressionStatus>("/compressionStatus", receipt);
    },

    startCompression() {
      return client.post("/startCompression");
    },

    cancelCompression() {
      return client.post("/cancelCompression");
    },

    pauseCompression() {
      return client.post("/pauseCompression");
    },

    resumeCompression() {
      return client.post("/resumeCompression");
    },
  };
}
