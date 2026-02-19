import { MAX_FILE_SIZE, COMPRESSED_FILE_TYPE } from "@/config/constants";

export function getFileExtension(file: File): string {
  const dotIndex = file.name.lastIndexOf(".");
  if (dotIndex === -1) return "";
  return file.name.slice(dotIndex + 1);
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
      message: `File size exceeds maximum of ${MAX_FILE_SIZE / (1024 ** 3)}GB`,
    };
  }
  return { valid: true };
}
