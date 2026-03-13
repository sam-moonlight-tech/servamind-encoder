import { useMutation } from "@tanstack/react-query";
import { encoderService } from "@/services/api";
import type { DecodeInitResponse } from "@/types/api.types";

interface DecodeParams {
  file: File;
  fileReference: string;
  userPassword: string;
  onInitComplete?: (data: DecodeInitResponse) => void;
  onStreamComplete?: () => void;
}

interface DecodeResult {
  init: DecodeInitResponse;
}

export function useDecode() {
  return useMutation({
    mutationFn: async ({
      file,
      fileReference,
      userPassword,
      onInitComplete,
      onStreamComplete,
    }: DecodeParams): Promise<DecodeResult> => {
      const init = await encoderService.decodeInit({
        file_reference: fileReference,
        file_size_bytes: file.size,
        user_password: userPassword,
      });
      onInitComplete?.(init);

      const buffer = await file.arrayBuffer();
      await encoderService.decodeStream(buffer, init.streaming_token, userPassword);
      onStreamComplete?.();

      return { init };
    },
    retry: 0,
  });
}
