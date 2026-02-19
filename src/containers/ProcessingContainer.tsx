import { useState } from "react";
import { ProcessingStageView } from "@/components/composed";
import { useCompressionStatus } from "@/hooks/data";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useFeatureFlags } from "@/hooks/utility";

function ProcessingContainer() {
  const { data: status } = useCompressionStatus();
  const { process, setStage } = useWorkflow();
  const { demoMode } = useFeatureFlags();
  const [percentageFallback, setPercentageFallback] = useState(0);

  const percentage = status?.compressionStatus ?? percentageFallback;

  return (
    <ProcessingStageView
      process={process}
      percentage={percentage}
      demoMode={demoMode}
      onDemoAdvance={() =>
        setPercentageFallback((p) => Math.min(p + 5, 100))
      }
      onDemoNext={() => setStage("download")}
      onDemoError={() => setStage("error")}
    />
  );
}

export { ProcessingContainer };
