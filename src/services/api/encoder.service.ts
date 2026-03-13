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
  decodeStream(data: ArrayBuffer, token: string, password: string): Promise<DecodeStreamResponse>;
  download(fileId: string, filename?: string): Promise<Response>;
}

export function createEncoderService(client: HttpClient): EncoderService {
  return {
    encodeInit(payload) {
      return client.post<EncodeInitResponse>("/api/encode", payload);
    },

    encodeStream(fileRef, data, token) {
      return client.postBinary<EncodeStreamResponse>(
        `/api/stream/${fileRef}`,
        data,
        { "X-Streaming-Token": token }
      );
    },

    decodeInit(payload) {
      return client.post<DecodeInitResponse>("/api/decode", payload);
    },

    decodeStream(data, token, password) {
      return client.postBinary<DecodeStreamResponse>(
        "/api/decode",
        data,
        {
          "X-Streaming-Token": token,
          "X-Decode-Password": password,
        }
      );
    },

    download(fileId, filename) {
      const path = filename
        ? `/download/${fileId}?filename=${encodeURIComponent(filename)}`
        : `/download/${fileId}`;
      return client.getBlob(path);
    },
  };
}
