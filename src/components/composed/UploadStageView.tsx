import { DropZone } from "./DropZone";
import { ComparisonDiagram } from "./ComparisonDiagram";
import { FileTable } from "./FileTable";
import { FileTableActionBar } from "./FileTableActionBar";
import { cn } from "@/lib/utils";
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
  if (uploading) {
    return (
      <div className={cn("space-y-0", className)}>
        {/* Encoding header */}
        <div className="flex items-center py-5 px-4">
          <div className="flex items-center gap-2 text-xl font-semibold tracking-[-0.6px] leading-[1.1] whitespace-nowrap">
            <span className="text-serva-gray-600">
              Encoding your files...
            </span>
            {encodingProgress && (
              <span className="text-serva-gray-400">
                ({encodingProgress.current}/{encodingProgress.total})
              </span>
            )}
          </div>
        </div>

        {/* File table with holo border */}
        <div className="px-4 pb-6">
          <FileTable files={fileTableItems} encoding />
        </div>
      </div>
    );
  }

  if (file) {
    return (
      <div className={cn("space-y-0", className)}>
        <FileTableActionBar
          fileCount={fileTableItems.length}
          processType={processType}
          canStart={canStart}
          onBack={onClear}
          onAddMore={onAddMore}
          onStart={onStart}
          className="py-6 px-6"
        />
        <div className="px-6 pb-6">
          <FileTable files={fileTableItems} onRemove={onRemove} />
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
