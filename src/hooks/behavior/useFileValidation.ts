import { useMemo } from "react";
import {
  isCompressedFile,
  validateFileSize,
  validateFileType,
} from "@/services/file";
import type { ProcessType } from "@/types/domain.types";

interface FileValidationResult {
  canCompress: boolean;
  canDecompress: boolean;
  sizeError: string | null;
}

export function useFileValidation(
  file: File | undefined,
  process: ProcessType = "compress"
): FileValidationResult {
  return useMemo(() => {
    if (!file) {
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

    const typeValidation = validateFileType(file, process);
    if (!typeValidation.valid) {
      const compressed = isCompressedFile(file);
      return {
        canCompress: !compressed,
        canDecompress: compressed,
        sizeError: typeValidation.message ?? null,
      };
    }

    const compressed = isCompressedFile(file);
    return {
      canCompress: !compressed,
      canDecompress: compressed,
      sizeError: null,
    };
  }, [file, process]);
}
