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
  encodeInit(payload: EncodeInitPayload, signal?: AbortSignal): Promise<EncodeInitResponse>;
  encodeStream(fileRef: string, data: ArrayBuffer, token: string, signal?: AbortSignal): Promise<EncodeStreamResponse>;
  decodeInit(payload: DecodeInitPayload, signal?: AbortSignal): Promise<DecodeInitResponse>;
  decodeStream(data: ArrayBuffer, token: string, password: string, signal?: AbortSignal): Promise<DecodeStreamResponse>;
  download(fileId: string, filename?: string, signal?: AbortSignal): Promise<Response>;
}

export function createEncoderService(client: HttpClient): EncoderService {
  return {
    encodeInit(payload, signal) {
      return client.post<EncodeInitResponse>("/api/encode", payload, signal);
    },

    encodeStream(fileRef, data, token, signal) {
      return client.postBinary<EncodeStreamResponse>(
        `/api/stream/${fileRef}`,
        data,
        { "X-Streaming-Token": token },
        signal
      );
    },

    decodeInit(payload, signal) {
      return client.post<DecodeInitResponse>("/api/decode", payload, signal);
    },

    decodeStream(data, token, password, signal) {
      return client.postBinary<DecodeStreamResponse>(
        "/api/decode",
        data,
        {
          "X-Streaming-Token": token,
          "X-Decode-Password": password,
        },
        signal
      );
    },

    download(fileId, filename, signal) {
      const path = filename
        ? `/download/${fileId}?filename=${encodeURIComponent(filename)}`
        : `/download/${fileId}`;
      return client.getBlob(path, signal);
    },
  };
}
