import { useCallback, useState } from "react";
import { DownloadStageView } from "@/components/composed";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { encoderService } from "@/services/api";
import { encodedBlobCache } from "@/hooks/data/useEncode";

function DownloadContainer() {
  const { process, fileResults, reset } = useWorkflow();
  const [downloading, setDownloading] = useState<Set<string>>(new Set());

  const handleDownload = useCallback(async (fileId: string, fileName: string) => {
    setDownloading((prev) => new Set(prev).add(fileId));
    try {
      // Use cached blob if available, otherwise fetch
      let blob = encodedBlobCache.get(fileId);
      if (!blob) {
        const response = await encoderService.download(fileId, fileName);
        blob = await response.blob();
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading((prev) => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
    }
  }, []);

  return (
    <DownloadStageView
      process={process}
      fileResults={fileResults}
      downloading={downloading}
      onDownload={handleDownload}
      onReset={reset}
    />
  );
}

export { DownloadContainer };
