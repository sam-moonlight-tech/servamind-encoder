import { useCallback, useState } from "react";
import { zipSync } from "fflate";
import { DownloadStageView } from "@/components/composed";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { encoderService } from "@/services/api";
import { encodedBlobCache } from "@/hooks/data/useEncode";
import { env } from "@/config/env";

function triggerBlobDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  // Delay cleanup so iOS Safari has time to initiate the download
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 5000);
}

/** Use a direct server URL — works with httpOnly session cookies and avoids iOS Safari blob download issues. */
function triggerServerDownload(fileId: string, fileName: string) {
  const a = document.createElement("a");
  a.href = `${env.apiUrl}/download/${fileId}?filename=${encodeURIComponent(fileName)}`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => document.body.removeChild(a), 5000);
}

async function fetchFileBlob(fileId: string, fileName: string): Promise<Blob> {
  let blob = encodedBlobCache.get(fileId);
  if (!blob) {
    const response = await encoderService.download(fileId, fileName);
    blob = await response.blob();
  }
  return blob;
}

function DownloadContainer() {
  const { process, fileResults, reset } = useWorkflow();
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handleDownload = useCallback((fileId: string, fileName: string) => {
    // If the blob was pre-cached during encode, use it directly
    const cached = encodedBlobCache.get(fileId);
    if (cached) {
      triggerBlobDownload(cached, fileName);
    } else {
      // Use a direct server link — more reliable on iOS Safari than blob URLs
      triggerServerDownload(fileId, fileName);
    }
  }, []);

  const handleDownloadAll = useCallback(async () => {
    if (fileResults.length === 0) return;
    setIsDownloadingAll(true);
    try {
      // Single file: download directly (synchronous — no blob needed)
      if (fileResults.length === 1) {
        const result = fileResults[0];
        if (!result.fileId) return;
        const servaName = result.fileName.replace(/\.[^.]+$/, ".serva");
        const displayName = process === "compress" ? servaName : result.fileName;
        handleDownload(result.fileId, displayName);
        return;
      }

      // Multiple files: zip into a single download
      const zipData: Record<string, Uint8Array> = {};

      for (const result of fileResults) {
        if (!result.fileId) continue;
        const servaName = result.fileName.replace(/\.[^.]+$/, ".serva");
        const displayName = process === "compress" ? servaName : result.fileName;
        const blob = await fetchFileBlob(result.fileId, displayName);
        const buffer = await blob.arrayBuffer();
        zipData[displayName] = new Uint8Array(buffer);
      }

      const zipped = zipSync(zipData);
      const zipBlob = new Blob([zipped as BlobPart], { type: "application/zip" });
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      triggerBlobDownload(zipBlob, `servamind-${timestamp}.zip`);
    } catch {
      // Network error or zip failure — user can retry individual downloads
    } finally {
      setIsDownloadingAll(false);
    }
  }, [fileResults, process, handleDownload]);

  return (
    <DownloadStageView
      process={process}
      fileResults={fileResults}
      onDownload={handleDownload}
      onDownloadAll={handleDownloadAll}
      isDownloadingAll={isDownloadingAll}
      onReset={reset}
    />
  );
}

export { DownloadContainer };
