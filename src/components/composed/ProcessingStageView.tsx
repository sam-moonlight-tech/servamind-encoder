import { Button, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ProcessType } from "@/types/domain.types";

interface ProcessingStageViewProps {
  process: ProcessType;
  percentage: number;
  demoMode: boolean;
  onDemoAdvance: () => void;
  onDemoNext: () => void;
  onDemoError: () => void;
  className?: string;
}

function getLoaderText(process: ProcessType, percentage: number): string {
  const prefix = process === "compress" ? "Compressing" : "Decompressing";
  if (percentage < 20) return `${prefix}: Initializing...`;
  if (percentage < 40) return `${prefix}: Analyzing file structure...`;
  if (percentage < 60) return `${prefix}: Processing data...`;
  if (percentage < 80) return `${prefix}: Optimizing output...`;
  if (percentage < 100) return `${prefix}: Finalizing...`;
  return `${prefix}: Complete!`;
}

function ProcessingStageView({
  process,
  percentage,
  demoMode,
  onDemoAdvance,
  onDemoNext,
  onDemoError,
  className,
}: ProcessingStageViewProps) {
  const title =
    process === "compress" ? "Compressing File" : "Decompressing File";
  const description =
    process === "compress"
      ? "Your file is being compressed using our AI-powered algorithm."
      : "Your file is being decompressed to its original format.";

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-serva-gray-600">{title}</h3>
      <p className="text-serva-gray-400">{description}</p>
      <ProgressBar value={percentage} />
      <p className="text-sm text-serva-gray-400 text-center italic">
        {getLoaderText(process, percentage)}
      </p>

      {demoMode && (
        <div className="flex flex-col sm:flex-row-reverse gap-2 justify-end pt-2 border-t border-serva-gray-300">
          <Button
            variant="secondary"
            size="sm"
            onClick={onDemoNext}
            disabled={percentage < 100}
          >
            Next Stage
          </Button>
          <Button variant="secondary" size="sm" onClick={onDemoAdvance}>
            +5% Progress
          </Button>
          <Button variant="danger" size="sm" onClick={onDemoError}>
            Simulate Error
          </Button>
        </div>
      )}
    </div>
  );
}

export { ProcessingStageView, type ProcessingStageViewProps };
