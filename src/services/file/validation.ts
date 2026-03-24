import {
  MAX_FILE_SIZE,
  GIGABYTE,
  COMPRESSED_FILE_TYPE,
} from "@/config/constants";
import type { ProcessType } from "@/types/domain.types";

export function getFileExtension(file: File): string {
  const dotIndex = file.name.lastIndexOf(".");
  if (dotIndex === -1) return "";
  return file.name.slice(dotIndex + 1).toLowerCase();
}

export function getFileName(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex === -1) return name;
  return name.slice(0, dotIndex);
}

export function isCompressedFile(file: File): boolean {
  return getFileExtension(file) === COMPRESSED_FILE_TYPE;
}

export function validateFileSize(file: File): { valid: boolean; message?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: `File size exceeds maximum of ${Math.round(MAX_FILE_SIZE / GIGABYTE)} GB`,
    };
  }
  return { valid: true };
}

export function validateFileType(
  file: File,
  process: ProcessType
): { valid: boolean; message?: string } {
  const ext = getFileExtension(file);

  if (process === "compress") {
    if (ext === COMPRESSED_FILE_TYPE) {
      return { valid: false, message: ".serva files cannot be encoded" };
    }
  }

  if (process === "decompress" && ext !== COMPRESSED_FILE_TYPE) {
    return { valid: false, message: "Only .serva files can be decoded" };
  }

  return { valid: true };
}
