import { DropZone } from "./DropZone";
import { ComparisonDiagram } from "./ComparisonDiagram";
import { FileTable } from "./FileTable";
import { FileTableActionBar } from "./FileTableActionBar";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/contexts/WorkflowContext";
import type { FileTableItem, ProcessType } from "@/types/domain.types";

interface UploadStageViewProps {
  file?: File;
  sizeError: string | null;
  fileTableItems: FileTableItem[];
  processType: ProcessType;
  canStart: boolean;
  uploading: boolean;
  encodingProgress?: { current: number; total: number };
  isDragging: boolean;
  onFileSelect: (files: File[]) => void;
  onClear: () => void;
  onAddMore: () => void;
  onStart: () => void;
  onRemove: (index: number) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  className?: string;
}

function UploadStageView({
  file,
  sizeError,
  fileTableItems,
  processType,
  canStart,
  uploading,
  encodingProgress,
  isDragging,
  onFileSelect,
  onClear,
  onAddMore,
  onStart,
  onRemove,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  className,
}: UploadStageViewProps) {
  const { isScrolled } = useWorkflow();

  if (uploading) {
    return (
      <div className={cn("space-y-0", className)}>
        {/* Encoding header */}
        <div className={cn("flex items-center py-5 px-4 sticky top-0 bg-white z-10", isScrolled && "border-b border-light-200")}>
          <div className="flex items-center gap-2 text-xl font-semibold leading-[1.1] whitespace-nowrap">
            <span className="text-serva-gray-600">
              {processType === "decompress" ? "Decoding" : "Encoding"} files...
            </span>
            {encodingProgress && (
              <span className="text-serva-gray-400">
                ({encodingProgress.current} / {encodingProgress.total})
              </span>
            )}
          </div>
        </div>

        {/* File table with holo border */}
        <div className="px-4 pb-6">
          <FileTable files={fileTableItems} encoding processLabel={processType === "decompress" ? "Decoding" : "Encoding"} onRemove={onRemove} className="max-h-[448px]" />
        </div>
      </div>
    );
  }

  if (file) {
    const startLabel = processType === "compress" ? "Start encoding" : "Start decoding";
    return (
      <div className={cn("space-y-0", className)}>
        <div className={cn("sticky top-0 bg-white z-10", isScrolled && "border-b border-light-200")}>
          <FileTableActionBar
            fileCount={fileTableItems.length}
            processType={processType}
            canStart={canStart}
            onBack={onClear}
            onAddMore={onAddMore}
            onStart={onStart}
            className="py-6 px-4 md:px-6"
          />
        </div>
        <div className="px-4 md:px-6 pb-20 md:pb-6">
          <FileTable files={fileTableItems} onRemove={onRemove} className="max-h-[448px] overflow-y-auto" />
        </div>
        {/* Mobile fixed bottom action bar */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-light-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-30">
          <Button size="md" onClick={onStart} disabled={!canStart} className="w-full justify-center">
            {startLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <DropZone
        isDragging={isDragging}
        file={file}
        sizeError={sizeError}
        processType={processType}
        onFileSelect={onFileSelect}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      />
      {processType === "compress" && <ComparisonDiagram />}
    </div>
  );
}

export { UploadStageView, type UploadStageViewProps };
