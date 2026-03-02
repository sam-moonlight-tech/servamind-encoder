import { useMemo } from "react";
import { Button } from "@/components/ui";
import { FileTable } from "./FileTable";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/services/file";
import type { ProcessType, FileResult, FileTableItem } from "@/types/domain.types";

interface DownloadStageViewProps {
  process: ProcessType;
  fileResults: FileResult[];
  onDownload: (fileId: string, fileName: string) => void;
  onDownloadAll: () => void;
  onReset: () => void;
  className?: string;
}

function DocumentIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M9.333 2H5.333A1.333 1.333 0 004 3.333v9.334A1.333 1.333 0 005.333 14h5.334A1.333 1.333 0 0012 12.667V4.667L9.333 2z" />
      <path d="M9.333 2v2.667H12" />
      <path d="M6 6h4M6 8h4M6 10h2" />
    </svg>
  );
}

function DownloadIcon() {
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
      <path d="M14 10v2.667A1.334 1.334 0 0112.667 14H3.333A1.334 1.334 0 012 12.667V10" />
      <path d="M4.667 6.667L8 10l3.333-3.333" />
      <path d="M8 10V2" />
    </svg>
  );
}

function ArrowRightIcon() {
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
      <path d="M3.333 8h9.334M8.667 4l4 4-4 4" />
    </svg>
  );
}

function formatReduction(original: number, encoded: number): number {
  if (original === 0) return 0;
  return Math.round(((original - encoded) / original) * 100);
}

function DownloadStageView({
  process,
  fileResults,
  onDownload,
  onDownloadAll,
  onReset,
  className,
}: DownloadStageViewProps) {
  const fileTableItems: FileTableItem[] = useMemo(() => {
    return fileResults.map((result) => {
      const servaName = result.fileName.replace(/\.[^.]+$/, ".serva");
      const displayName = process === "compress" ? servaName : result.fileName;

      return {
        name: displayName,
        typeLabel: ".serva",
        formattedSize: formatFileSize(result.originalSize),
        status: "encoded" as const,
        sizeError: null,
        encodedSize:
          result.encodedSize !== null
            ? formatFileSize(result.encodedSize)
            : undefined,
        reductionPercent:
          result.encodedSize !== null
            ? formatReduction(result.originalSize, result.encodedSize)
            : undefined,
        durationSeconds:
          result.durationMs !== null ? result.durationMs / 1000 : undefined,
      };
    });
  }, [fileResults, process]);

  const handleDownloadByIndex = (index: number) => {
    const result = fileResults[index];
    if (!result) return;
    const servaName = result.fileName.replace(/\.[^.]+$/, ".serva");
    const displayName = process === "compress" ? servaName : result.fileName;
    onDownload(result.fileId, displayName);
  };

  return (
    <div className={cn("space-y-0", className)}>
      {/* Header */}
      <div className="flex items-center justify-between py-5 px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.1] whitespace-nowrap">
            Encoding complete
          </h1>
          <Button variant="secondary" size="md" onClick={onReset}>
            Encode more files
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="secondary" size="md">
            Download report
            <DocumentIcon />
          </Button>
          <Button size="md" onClick={onDownloadAll}>
            Download all
            <DownloadIcon />
          </Button>
        </div>
      </div>

      {/* File list */}
      <div className="px-4 pb-6">
        <FileTable
          files={fileTableItems}
          onDownload={handleDownloadByIndex}
        />
      </div>

      {/* What's next section */}
      <div className="flex flex-col items-center gap-6 py-10 px-6">
        <p className="text-xl font-semibold tracking-[-0.6px] leading-[1.1] whitespace-nowrap">
          <span className="text-serva-gray-400">What&apos;s next? </span>
          <span className="text-serva-gray-600">
            Train with your .serva files
          </span>
        </p>
        <p className="text-sm text-serva-gray-400 text-center tracking-[-0.42px] leading-[1.4] max-w-[371px]">
          Your files are now encoded in a deterministic format designed for model
          training and reuse.
        </p>
        <Button size="md">
          Get Started
          <ArrowRightIcon />
        </Button>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-4 px-6 pb-8">
        <div className="border border-light-200 rounded-[12px] p-6 flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-semibold text-serva-gray-600 tracking-[-0.42px]">
            Raw data &rarr; .serva
          </p>
          <p className="text-sm text-serva-gray-400 tracking-[-0.42px] leading-[1.4]">
            Turn source files into a consistent, encoded format built for model
            training.
          </p>
        </div>
        <div className="border border-light-200 rounded-[12px] p-6 flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-semibold text-serva-gray-600 tracking-[-0.42px]">
            .serva &rarr; Model training
          </p>
          <p className="text-sm text-serva-gray-400 tracking-[-0.42px] leading-[1.4]">
            Use the same encoded file across experiments and models without
            rebuilding preprocessing pipelines.
          </p>
        </div>
      </div>
    </div>
  );
}

export { DownloadStageView, type DownloadStageViewProps };
