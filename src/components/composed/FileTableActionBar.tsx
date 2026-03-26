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
        <h1 className="text-lg md:text-xl font-semibold text-serva-gray-600 leading-[1.1] whitespace-nowrap">
          {fileCount} {fileCount === 1 ? "file" : "files"} ready to {verb}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Mobile: icon-only add button */}
        <button
          type="button"
          onClick={onAddMore}
          className="flex md:hidden items-center justify-center size-10 rounded-[12px] border border-light-200 bg-white text-serva-gray-600 cursor-pointer hover:bg-light-300 transition-colors"
          aria-label="Add more files"
        >
          <PlusIcon />
        </button>
        {/* Desktop: full add button */}
        <Button variant="secondary" size="md" onClick={onAddMore} className="hidden md:flex">
          Add more files
          <PlusIcon />
        </Button>
        {/* Desktop: start button (hidden on mobile, moved to bottom bar) */}
        <Button size="md" onClick={onStart} disabled={!canStart} className="hidden md:flex">
          {startLabel}
        </Button>
      </div>
    </div>
  );
}

export { FileTableActionBar, type FileTableActionBarProps };
