import { ProcessingStageView } from "@/components/composed";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useFeatureFlags } from "@/hooks/utility";

function ProcessingContainer() {
  const { process, setStage } = useWorkflow();
  const { demoMode } = useFeatureFlags();

  return (
    <ProcessingStageView
      process={process}
      percentage={0}
      demoMode={demoMode}
      onDemoAdvance={() => {}}
      onDemoNext={() => setStage("download")}
      onDemoError={() => setStage("error")}
    />
  );
}

export { ProcessingContainer };
