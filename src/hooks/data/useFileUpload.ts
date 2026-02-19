import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { encoderService } from "@/services/api";
import { useSession } from "./useSession";
import type { FileReceipt } from "@/types/api.types";

interface FileUploadParams {
  file: File;
  checksum: string;
  compress: boolean;
  privateKey: string;
  onComplete?: () => void;
}

export function useFileUpload() {
  const queryClient = useQueryClient();
  const { data: fileReceipts } = useSession();

  return useMutation({
    mutationFn: async ({
      file,
      checksum,
      compress,
      privateKey,
      onComplete,
    }: FileUploadParams) => {
      const userID = fileReceipts?.[0]?.userID;
      if (!userID) {
        throw new Error("No user session found");
      }

      const data = await encoderService.uploadFile({
        userID,
        file,
        checksum,
        compress,
        privateKey,
      });

      onComplete?.();
      return data;
    },
    onSuccess: (fileReceipt) => {
      queryClient.setQueryData<FileReceipt[]>(
        queryKeys.fileReceipts,
        (existing) => (existing ? [...existing, fileReceipt] : [fileReceipt])
      );
    },
    retry: 0,
  });
}
