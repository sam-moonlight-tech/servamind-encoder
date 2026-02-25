import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ProcessType, FileResult } from "@/types/domain.types";
import { formatFileSize } from "@/services/file";

interface DownloadStageViewProps {
  process: ProcessType;
  fileResults: FileResult[];
  downloading: Set<string>;
  onDownload: (fileId: string, fileName: string) => void;
  onReset: () => void;
  className?: string;
}

function ServaFileIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-green-600 shrink-0"
    >
      <path d="M11.667 2.5H5.833A1.667 1.667 0 004.167 4.167v11.666A1.667 1.667 0 005.833 17.5h8.334a1.667 1.667 0 001.666-1.667V6.667L11.667 2.5z" />
      <path d="M11.667 2.5v4.167h4.166" />
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
    >
      <path d="M14 10v2.667A1.334 1.334 0 0112.667 14H3.333A1.334 1.334 0 012 12.667V10" />
      <path d="M4.667 6.667L8 10l3.333-3.333" />
      <path d="M8 10V2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-green-600"
    >
      <path d="M11.667 3.5L5.25 9.917 2.333 7" />
    </svg>
  );
}

function formatReduction(original: number, encoded: number): string {
  if (original === 0) return "0%";
  const percent = Math.round(((original - encoded) / original) * 100);
  return `-${percent}%`;
}

function DownloadStageView({
  process,
  fileResults,
  downloading,
  onDownload,
  onReset,
  className,
}: DownloadStageViewProps) {
  const totalOriginal = fileResults.reduce((sum, r) => sum + r.originalSize, 0);
  const totalEncoded = fileResults.reduce((sum, r) => sum + (r.encodedSize ?? 0), 0);
  const hasSizeData = fileResults.some((r) => r.encodedSize !== null);
  const totalSaved = totalOriginal - totalEncoded;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="border border-[#EAEAEA] rounded-[7px] overflow-hidden">
        {fileResults.map((result) => {
          const servaName = result.fileName.replace(/\.[^.]+$/, ".serva");
          const displayName = process === "compress" ? servaName : result.fileName;
          const isDownloading = downloading.has(result.fileId);

          return (
            <div
              key={result.fileId || result.fileName}
              className="flex items-center justify-between px-4 py-3 border-b border-[#EAEAEA] last:border-b-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <ServaFileIcon />
                <span className="text-sm font-medium text-serva-gray-600 truncate">
                  {displayName}
                </span>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="flex items-center gap-4 text-xs text-serva-gray-400">
                  <span>Original: {formatFileSize(result.originalSize)}</span>
                  {result.encodedSize !== null && (
                    <span>
                      Encoded: {formatFileSize(result.encodedSize)}{" "}
                      <span className="text-green-600 font-medium">
                        ({formatReduction(result.originalSize, result.encodedSize)})
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckIcon />
                  </span>
                  {result.fileId && (
                    <button
                      type="button"
                      onClick={() => onDownload(result.fileId, displayName)}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-serva-gray-600 border border-[#EAEAEA] rounded-md hover:bg-[#F5F5F5] active:bg-[#EAEAEA] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-wait"
                    >
                      <DownloadIcon />
                      {isDownloading ? "Downloading..." : "Download"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasSizeData && totalSaved > 0 && (
        <div className="bg-[#F9F9F9] border border-[#EAEAEA] rounded-[7px] px-4 py-3">
          <p className="text-sm text-serva-gray-400">
            You reduced your data size by {formatFileSize(totalSaved)} and can now reuse these files across every AI model with lower compute.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="secondary" onClick={onReset}>
          Encode Another File
        </Button>
      </div>
    </div>
  );
}

export { DownloadStageView, type DownloadStageViewProps };
