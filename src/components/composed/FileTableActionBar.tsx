import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ProcessType } from "@/types/domain.types";

interface FileTableActionBarProps {
  fileCount: number;
  processType: ProcessType;
  canStart: boolean;
  onBack: () => void;
  onAddMore: () => void;
  onStart: () => void;
  className?: string;
}

function BackArrowIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-serva-gray-600 shrink-0"
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M4 8h8M8 4v8" />
    </svg>
  );
}

function FileTableActionBar({
  fileCount,
  processType,
  canStart,
  onBack,
  onAddMore,
  onStart,
  className,
}: FileTableActionBarProps) {
  const verb = processType === "compress" ? "encode" : "decode";
  const startLabel =
    processType === "compress" ? "Start encoding" : "Start decoding";

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer hover:opacity-70"
        >
          <BackArrowIcon />
        </button>
        <h1 className="text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.1] whitespace-nowrap">
          {fileCount} {fileCount === 1 ? "file" : "files"} ready to {verb}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="secondary" size="md" onClick={onAddMore}>
          Add more files
          <PlusIcon />
        </Button>
        <Button size="md" onClick={onStart} disabled={!canStart}>
          {startLabel}
        </Button>
      </div>
    </div>
  );
}

export { FileTableActionBar, type FileTableActionBarProps };
