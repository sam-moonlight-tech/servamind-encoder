import { DownloadStageView } from "@/components/composed";
import { useSession } from "@/hooks/data";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { getDownloadLink } from "@/services/file";

function DownloadContainer() {
  const { data: fileReceipts } = useSession();
  const { process, reset } = useWorkflow();

  const downloadLink = getDownloadLink(fileReceipts?.[0], process);

  return (
    <DownloadStageView
      process={process}
      downloadLink={downloadLink}
      onReset={reset}
    />
  );
}

export { DownloadContainer };
