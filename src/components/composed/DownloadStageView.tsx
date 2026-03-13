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

function SmallArrow() {
  return (
    <svg
      width="21"
      height="6"
      viewBox="0 0 21 6"
      fill="none"
      className="shrink-0"
    >
      <path d="M0 3h18M15 0.5l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1" className="text-serva-gray-200" />
    </svg>
  );
}

function ServaEncoderBadgeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0"
    >
      <rect width="14" height="14" rx="2.5" fill="white" fillOpacity="0.9" />
      <text
        x="7"
        y="10"
        textAnchor="middle"
        fill="#51a500"
        fontSize="6.5"
        fontFamily="monospace"
        fontWeight="bold"
      >
        S
      </text>
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
  const isDecoding = process === "decompress";

  const fileTableItems: FileTableItem[] = useMemo(() => {
    return fileResults.map((result) => {
      const wasDecoded = isDecoding || result.encodedSize === null;
      const servaName = result.fileName.replace(/\.[^.]+$/, ".serva");
      const displayName = wasDecoded ? result.fileName : servaName;

      return {
        name: displayName,
        typeLabel: wasDecoded ? "" : ".serva",
        formattedSize: formatFileSize(result.originalSize),
        status: (wasDecoded ? "complete" : "encoded") as FileTableItem["status"],
        sizeError: null,
        encodedSize:
          !wasDecoded && result.encodedSize !== null
            ? formatFileSize(result.encodedSize)
            : undefined,
        reductionPercent:
          !wasDecoded && result.encodedSize !== null
            ? formatReduction(result.originalSize, result.encodedSize)
            : undefined,
        durationSeconds:
          result.durationMs !== null ? result.durationMs / 1000 : undefined,
      };
    });
  }, [fileResults, isDecoding]);

  const handleDownloadByIndex = (index: number) => {
    const result = fileResults[index];
    if (!result) return;
    const wasDecoded = isDecoding || result.encodedSize === null;
    const servaName = result.fileName.replace(/\.[^.]+$/, ".serva");
    const displayName = wasDecoded ? result.fileName : servaName;
    onDownload(result.fileId, displayName);
  };

  return (
    <div className={cn("space-y-0", className)}>
      {/* Header */}
      <div className="flex items-center justify-between py-5 px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.1] whitespace-nowrap">
            {isDecoding ? "Decoding complete" : "Encoding complete"}
          </h1>
          <Button variant="secondary" size="md" onClick={onReset}>
            {isDecoding ? "Decode more files" : "Encode more files"}
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

      {/* What's next section — encoding only */}
      {!isDecoding && (
        <div className="flex flex-col items-center gap-12 py-10 px-6">
          <div className="flex flex-col items-center gap-6">
            <p className="text-xl font-semibold tracking-[-0.6px] leading-[1.1] whitespace-nowrap">
              <span className="text-serva-gray-400">What&apos;s next? </span>
              <span className="text-serva-gray-600">
                Train with your .serva files
              </span>
            </p>
            <p className="text-sm text-serva-gray-400 text-center tracking-[-0.42px] leading-[1.4] max-w-[371px]">
              Your files are now encoded in a deterministic format designed for
              model training and reuse.
            </p>
          </div>

          {/* Step cards */}
          <div className="flex items-stretch gap-4 justify-center">
            {/* Step 1 — dimmed */}
            <div className="flex w-[339px] opacity-50">
              <div className="bg-light-300 border border-light-200 rounded-[16px] overflow-clip p-8 flex flex-1 flex-col items-center gap-6">
                <p className="text-sm font-semibold text-serva-gray-600 tracking-[-0.42px] leading-[1.1] text-center w-full">
                  Step 1
                </p>
                <div className="flex items-center gap-2">
                  <span className="bg-white rounded-[8px] px-3 py-2 font-mono text-xs text-serva-gray-600 tracking-[1.2px] leading-[1.1]">
                    RAW DATA
                  </span>
                  <SmallArrow />
                  <span className="bg-serva-green rounded-[8px] px-3 py-2 font-mono text-xs text-light-300 tracking-[1.2px] leading-[1.1] flex items-center gap-2">
                    .SERVA
                    <ServaEncoderBadgeIcon />
                  </span>
                </div>
                <p className="text-sm text-serva-gray-400 text-center tracking-[-0.42px] leading-[1.4] w-[275px]">
                  Turn source files into a consistent, encoded format built for
                  model training.
                </p>
              </div>
            </div>

            {/* Step 2 — active */}
            <div className="flex w-[339px]">
              <div className="bg-white border border-light-200 rounded-[16px] overflow-clip p-8 flex flex-1 flex-col items-center gap-9">
                <div className="flex flex-col items-center gap-6 w-full">
                  <p className="text-sm font-semibold text-serva-gray-600 tracking-[-0.42px] leading-[1.1] text-center w-full">
                    Step 2
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-serva-green rounded-[8px] px-3 py-2 font-mono text-xs text-light-300 tracking-[1.2px] leading-[1.1] flex items-center gap-2">
                      .SERVA
                      <ServaEncoderBadgeIcon />
                    </span>
                    <SmallArrow />
                    <span className="bg-light-300 rounded-[8px] px-3 py-2 font-mono text-xs text-serva-gray-600 tracking-[1.2px] leading-[1.1]">
                      MODEL TRAINING
                    </span>
                  </div>
                  <p className="text-sm text-serva-gray-400 text-center tracking-[-0.42px] leading-[1.4] w-[275px]">
                    Use the same encoded file across experiments and models
                    without rebuilding preprocessing pipelines.
                  </p>
                </div>
                <Button size="md">
                  Train your Models
                  <ArrowRightIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { DownloadStageView, type DownloadStageViewProps };
