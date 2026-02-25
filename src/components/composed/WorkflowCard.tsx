import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { WorkflowStage } from "@/types/domain.types";

interface WorkflowCardProps {
  stage: WorkflowStage;
  children: React.ReactNode;
  className?: string;
}

function WorkflowCard({ stage, children, className }: WorkflowCardProps) {
  if (stage === "upload") {
    return (
      <div className={cn("animate-fade-in", className)}>
        {children}
      </div>
    );
  }

  return (
    <Card
      variant={stage === "encoding" ? "holographic" : "default"}
      className={cn("animate-fade-in", className)}
    >
      {children}
    </Card>
  );
}

export { WorkflowCard, type WorkflowCardProps };
