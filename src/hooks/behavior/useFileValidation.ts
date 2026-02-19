import { useMemo } from "react";
import { isCompressedFile, validateFileSize } from "@/services/file";

interface FileValidationResult {
  canCompress: boolean;
  canDecompress: boolean;
  sizeError: string | null;
}

export function useFileValidation(
  file: File | undefined,
  hash: string | undefined
): FileValidationResult {
  return useMemo(() => {
    if (!file || !hash) {
      return { canCompress: false, canDecompress: false, sizeError: null };
    }

    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.valid) {
      return {
        canCompress: false,
        canDecompress: false,
        sizeError: sizeValidation.message ?? null,
      };
    }

    const compressed = isCompressedFile(file);
    return {
      canCompress: true,
      canDecompress: compressed,
      sizeError: null,
    };
  }, [file, hash]);
}
