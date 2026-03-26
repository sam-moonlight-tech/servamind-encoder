import { useCallback } from "react";
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

function DownloadContainer() {
  const { process, fileResults, reset } = useWorkflow();

  const handleDownload = useCallback(async (fileId: string, fileName: string) => {
    let blob = encodedBlobCache.get(fileId);
    if (!blob) {
      const response = await encoderService.download(fileId, fileName);
      blob = await response.blob();
    }
    triggerBlobDownload(blob, fileName);
  }, []);

  const handleDownloadAll = useCallback(async () => {
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
