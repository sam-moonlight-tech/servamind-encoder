import { ProgressBar } from "@/components/ui";
import { DropZone } from "./DropZone";
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
  isDragging: boolean;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onAddMore: () => void;
  onStart: () => void;
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
  isDragging,
  onFileSelect,
  onClear,
  onAddMore,
  onStart,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  className,
}: UploadStageViewProps) {
  if (uploading) {
    return (
      <div className={cn("space-y-4 p-8", className)}>
        <h3 className="text-lg font-semibold text-serva-gray-600">
          Uploading...
        </h3>
        <p className="text-serva-gray-400">
          Please wait while your file is uploaded.
        </p>
        <ProgressBar value={0} indeterminate />
        <p className="text-sm text-serva-gray-400 text-center italic">
          Uploading file to server...
        </p>
      </div>
    );
  }

  if (file) {
    return (
      <div className={cn("space-y-4", className)}>
        <FileTableActionBar
          fileCount={fileTableItems.length}
          processType={processType}
          canStart={canStart}
          onClear={onClear}
          onAddMore={onAddMore}
          onStart={onStart}
        />
        <FileTable files={fileTableItems} />
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <DropZone
        isDragging={isDragging}
        file={file}
        sizeError={sizeError}
        onFileSelect={onFileSelect}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      />
    </div>
  );
}

export { UploadStageView, type UploadStageViewProps };
