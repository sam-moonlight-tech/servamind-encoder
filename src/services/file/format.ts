import { KILOBYTE, MEGABYTE, GIGABYTE } from "@/config/constants";
import { getFileExtension } from "./validation";

export function getFileTypeLabel(file: File): string {
  const ext = getFileExtension(file);
  return ext ? ext.toUpperCase() : "Unknown";
}

export function formatFileSize(bytes: number): string {
  if (bytes >= GIGABYTE) {
    return `${(bytes / GIGABYTE).toFixed(2)} GB`;
  }
  if (bytes >= MEGABYTE) {
    return `${(bytes / MEGABYTE).toFixed(2)} MB`;
  }
  return `${(bytes / KILOBYTE).toFixed(2)} KB`;
}
