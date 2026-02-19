import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ProcessType } from "@/types/domain.types";

interface FileTableActionBarProps {
  fileCount: number;
  processType: ProcessType;
  canStart: boolean;
  onClear: () => void;
  onAddMore: () => void;
  onStart: () => void;
  className?: string;
}

function FileTableActionBar({
  fileCount,
  processType,
  canStart,
  onClear,
  onAddMore,
  onStart,
  className,
}: FileTableActionBarProps) {
  const verb = processType === "compress" ? "encode" : "decode";
  const startLabel = processType === "compress" ? "Start Encoding" : "Start Decoding";

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        <span className="text-sm text-serva-gray-600">
          {fileCount} {fileCount === 1 ? "file" : "files"} ready to {verb}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-serva-gray-400 hover:text-serva-gray-600 underline cursor-pointer"
        >
          Clear
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onAddMore}>
          Add More Files
        </Button>
        <Button size="sm" onClick={onStart} disabled={!canStart}>
          {startLabel}
        </Button>
      </div>
    </div>
  );
}

export { FileTableActionBar, type FileTableActionBarProps };
