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
        user_password: userPassword,
      });
      onInitComplete?.(init);

      const buffer = await file.arrayBuffer();
      await encoderService.encodeStream(fileReference, buffer, init.streaming_token);
      onStreamComplete?.();

      // Fetch the encoded file to get its size
      let encodedSize: number | null = null;
      try {
        const downloadResponse = await encoderService.download(init.file_id);
        const blob = await downloadResponse.blob();
        encodedSize = blob.size;
        // Cache the blob so we don't need to re-download
        encodedBlobCache.set(init.file_id, blob);
      } catch {
        // Non-critical — size just won't be shown
      }

      return { init, encodedSize };
    },
    retry: 0,
  });
}

// Cache downloaded blobs so the download button doesn't re-fetch
export const encodedBlobCache = new Map<string, Blob>();
