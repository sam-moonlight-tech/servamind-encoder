import { useCallback } from "react";
import { zipSync, strToU8 } from "fflate";
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

/**
 * iOS Safari blocks programmatic multi-file downloads.
 * Detect iOS so we can zip files into a single download instead.
 */
function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS|Chrome/.test(ua);
  return isIOS && isSafari;
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

  const handleDownload = useCallback(async (fileId: string, fileName: string) => {
    const blob = await fetchFileBlob(fileId, fileName);
    triggerBlobDownload(blob, fileName);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    if (fileResults.length === 0) return;

    // On iOS Safari, zip all files into a single download
    if (isIOSSafari() && fileResults.length > 1) {
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
      const zipBlob = new Blob([zipped], { type: "application/zip" });
      const dateSuffix = new Date().toISOString().slice(0, 10);
      triggerBlobDownload(zipBlob, `servamind-${dateSuffix}.zip`);
      return;
    }

    // Default: sequential downloads with delay
    for (let i = 0; i < fileResults.length; i++) {
      const result = fileResults[i];
      if (!result.fileId) continue;
      // Small delay between downloads so browsers don't block them as popups
      if (i > 0) await new Promise((r) => setTimeout(r, 500));
      const servaName = result.fileName.replace(/\.[^.]+$/, ".serva");
      const displayName = process === "compress" ? servaName : result.fileName;
      await handleDownload(result.fileId, displayName);
    }
  }, [fileResults, process, handleDownload]);

  return (
    <DownloadStageView
      process={process}
      fileResults={fileResults}
      onDownload={handleDownload}
      onDownloadAll={handleDownloadAll}
      onReset={reset}
    />
  );
}

export { DownloadContainer };
