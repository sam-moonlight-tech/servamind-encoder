import type {
  EncodeInitPayload,
  EncodeInitResponse,
  EncodeStreamResponse,
  DecodeInitPayload,
  DecodeInitResponse,
  DecodeStreamResponse,
} from "@/types/api.types";
import type { HttpClient } from "./client";

export interface EncoderService {
  encodeInit(payload: EncodeInitPayload): Promise<EncodeInitResponse>;
  encodeStream(fileRef: string, data: ArrayBuffer, token: string): Promise<EncodeStreamResponse>;
  decodeInit(payload: DecodeInitPayload): Promise<DecodeInitResponse>;
  decodeStream(data: ArrayBuffer, token: string): Promise<DecodeStreamResponse>;
  download(fileId: string, filename?: string): Promise<Response>;
}

export function createEncoderService(
  authClient: HttpClient,
  backendClient: HttpClient
): EncoderService {
  return {
    encodeInit(payload) {
      return authClient.post<EncodeInitResponse>("/api/encode", payload);
    },

    encodeStream(fileRef, data, token) {
      return backendClient.postBinary<EncodeStreamResponse>(
        `/api/stream/${fileRef}`,
        data,
        { "X-Streaming-Token": token }
      );
    },

    decodeInit(payload) {
      return authClient.post<DecodeInitResponse>("/api/decode", payload);
    },

    decodeStream(data, token) {
      return backendClient.postBinary<DecodeStreamResponse>(
        "/api/decode",
        data,
        { "X-Streaming-Token": token }
      );
    },

    download(fileId, filename) {
      const path = filename
        ? `/download/${fileId}?filename=${encodeURIComponent(filename)}`
        : `/download/${fileId}`;
      return backendClient.getBlob(path);
    },
  };
}
