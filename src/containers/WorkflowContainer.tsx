import { WorkflowCard } from "@/components/composed";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { DropZoneContainer } from "./DropZoneContainer";
import { ProcessingContainer } from "./ProcessingContainer";
import { DownloadContainer } from "./DownloadContainer";
import { ErrorContainer } from "./ErrorContainer";
import type { WorkflowStage } from "@/types/domain.types";

const stageComponents: Record<WorkflowStage, React.ComponentType> = {
  upload: DropZoneContainer,
  encoding: ProcessingContainer,
  download: DownloadContainer,
  error: ErrorContainer,
};

function WorkflowContainer() {
  const { stage } = useWorkflow();
  const StageComponent = stageComponents[stage];

  return (
    <WorkflowCard stage={stage}>
      <StageComponent />
    </WorkflowCard>
  );
}

export { WorkflowContainer };
