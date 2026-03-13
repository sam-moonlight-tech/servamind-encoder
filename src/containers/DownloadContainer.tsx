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
  URL.revokeObjectURL(url);
}

function DownloadContainer() {
  const { process, fileResults, reset, setProcess } = useWorkflow();

  const handleDownload = useCallback(async (fileId: string, fileName: string) => {
    let blob = encodedBlobCache.get(fileId);
    if (!blob) {
      const response = await encoderService.download(fileId, fileName);
      blob = await response.blob();
    }
    triggerBlobDownload(blob, fileName);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    for (const result of fileResults) {
      if (!result.fileId) continue;
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
      onReset={() => {
        const currentProcess = process;
        reset();
        setProcess(currentProcess);
      }}
    />
  );
}

export { DownloadContainer };
