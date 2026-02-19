import { ErrorStageView } from "@/components/composed";
import { useWorkflow } from "@/contexts/WorkflowContext";

function ErrorContainer() {
  const { reset } = useWorkflow();
  return <ErrorStageView onReset={reset} />;
}

export { ErrorContainer };
