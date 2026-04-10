import type {
  EncodeInitPayload,
  EncodeInitResponse,
  EncodeStreamResponse,
  EncodeCancelPayload,
  EncodeCancelResponse,
  DecodeInitPayload,
  DecodeInitResponse,
  DecodeStreamResponse,
  DecodeCancelPayload,
  DecodeCancelResponse,
} from "@/types/api.types";
import type { HttpClient } from "./client";

export interface EncoderService {
  encodeInit(payload: EncodeInitPayload, signal?: AbortSignal): Promise<EncodeInitResponse>;
  encodeStream(fileRef: string, data: ArrayBuffer, token: string, signal?: AbortSignal): Promise<EncodeStreamResponse>;
  encodeCancel(payload: EncodeCancelPayload): Promise<EncodeCancelResponse>;
  decodeInit(payload: DecodeInitPayload, signal?: AbortSignal): Promise<DecodeInitResponse>;
  decodeStream(data: ArrayBuffer, token: string, password: string, signal?: AbortSignal): Promise<DecodeStreamResponse>;
  decodeCancel(payload: DecodeCancelPayload): Promise<DecodeCancelResponse>;
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

    encodeCancel(payload) {
      return client.post<EncodeCancelResponse>("/api/encode/cancel", payload);
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

    decodeCancel(payload) {
      return client.post<DecodeCancelResponse>("/api/decode/cancel", payload);
    },

    download(fileId, filename, signal) {
      const path = filename
        ? `/download/${fileId}?filename=${encodeURIComponent(filename)}`
        : `/download/${fileId}`;
      return client.getBlob(path, signal);
    },
  };
}
