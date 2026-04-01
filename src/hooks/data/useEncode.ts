import { useMutation } from "@tanstack/react-query";
import { encoderService } from "@/services/api";
import type { EncodeInitResponse } from "@/types/api.types";

interface EncodeParams {
  file: File;
  fileReference: string;
  idempotencyKey: string;
  userPassword: string;
  onInitComplete?: (data: EncodeInitResponse) => void;
  onStreamComplete?: () => void;
}

interface EncodeResult {
  init: EncodeInitResponse;
  encodedSize: number | null;
}

function getFileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : "";
}

export function useEncode() {
  return useMutation({
    mutationFn: async ({
      file,
      fileReference,
      idempotencyKey,
      userPassword,
      onInitComplete,
      onStreamComplete,
    }: EncodeParams): Promise<EncodeResult> => {
      const init = await encoderService.encodeInit({
        file_reference: fileReference,
        idempotency_key: idempotencyKey,
        file_size_bytes: file.size,
        file_extension: getFileExtension(file.name),
        original_filename: file.name,
        user_password: userPassword,
      });
      onInitComplete?.(init);

      const buffer = await file.arrayBuffer();
      const streamResult = await encoderService.encodeStream(fileReference, buffer, init.streaming_token);
      onStreamComplete?.();

      // Use the encoded size from the stream response
      const encodedSize = streamResult.encoded_size_bytes ?? null;

      // Pre-fetch and cache the encoded file for the download button
      try {
        const downloadResponse = await encoderService.download(init.file_id);
        const blob = await downloadResponse.blob();
        encodedBlobCache.set(init.file_id, blob);
      } catch {
        // Non-critical — user can still download manually
      }

      return { init, encodedSize };
    },
    retry: 0,
  });
}

// Cache downloaded blobs so the download button doesn't re-fetch
export const encodedBlobCache = new Map<string, Blob>();
