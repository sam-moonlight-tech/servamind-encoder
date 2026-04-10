import { useCallback, useState } from "react";
import { zipSync } from "fflate";
import { DownloadStageView } from "@/components/composed";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { encoderService } from "@/services/api";
import { encodedBlobCache } from "@/hooks/data/useEncode";

function triggerBlobDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Delay revocation so the browser has time to start the download
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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

  const handleDownload = useCallback(async (fileId: string, fileName: string) => {
    const blob = await fetchFileBlob(fileId, fileName);
    triggerBlobDownload(blob, fileName);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    if (fileResults.length === 0) return;
    setIsDownloadingAll(true);
    try {
      // Single file: download directly
      if (fileResults.length === 1) {
        const result = fileResults[0];
        if (!result.fileId) return;
        const servaName = result.fileName.replace(/\.[^.]+$/, ".serva");
        const displayName = process === "compress" ? servaName : result.fileName;
        await handleDownload(result.fileId, displayName);
        return;
      }

      // Multiple files: always zip into a single download
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
