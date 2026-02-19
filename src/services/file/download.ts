import { env } from "@/config/env";
import { COMPRESSED_FILE_TYPE } from "@/config/constants";
import type { FileReceipt } from "@/types/api.types";
import type { ProcessType } from "@/types/domain.types";
import { getFileName } from "./validation";

export function getDownloadLink(
  fileReceipt: FileReceipt | undefined,
  process: ProcessType
): string {
  if (!fileReceipt) return "";

  const { userID, fileID, fileName } = fileReceipt;
  if (!userID || !fileID || !fileName) return "";

  const baseUrl = env.apiBaseUrl.replace("/api/v3", "");
  const downloadFileName =
    process === "compress"
      ? `${getFileName(fileName)}.${COMPRESSED_FILE_TYPE}`
      : fileName;

  return `${baseUrl}/${userID}/${fileID}/${downloadFileName}`;
}
