import { useCallback, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui";
import { FileTable } from "./FileTable";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/services/file";
import { useWorkflow } from "@/contexts/WorkflowContext";
import type { ProcessType, FileResult, FileTableItem } from "@/types/domain.types";

interface DownloadStageViewProps {
  process: ProcessType;
  fileResults: FileResult[];
  onDownload: (fileId: string, fileName: string) => void;
  onDownloadAll: () => void;
  isDownloadingAll?: boolean;
  onReset: () => void;
  className?: string;
}

function GoogleDocsIcon() {
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
      <rect x="3" y="2" width="10" height="12" rx="1.5" />
      <path d="M5.5 5h5M5.5 8h5M5.5 11h2.5" />
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
      <path d="M4 13h8" />
      <path d="M5.5 7L8 9.5 10.5 7" />
      <path d="M8 9.5V2.5" />
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
      <path d="M13.0737 3.52225V1.85255H11.7421C10.4946 0.702526 8.8297 0 7 0C5.1703 0 3.50541 0.702526 2.25795 1.85255H0.926277V3.52225C0.338031 4.54717 0 5.73449 0 7C0 8.26551 0.338031 9.45283 0.926277 10.4777V14H13.0737V10.4777C13.662 9.45283 14 8.26551 14 7C14 5.73449 13.662 4.54717 13.0737 3.52225ZM12.1114 3.79292V10.2083C11.9959 10.3911 11.8696 10.5656 11.736 10.7352L7.77591 2.81612H11.3451C11.6326 3.11445 11.8888 3.44166 12.1114 3.79292ZM7 0.962365C8.15363 0.962365 9.23389 1.28837 10.1517 1.85255H3.84826C4.76611 1.28837 5.84516 0.962365 7 0.962365ZM1.88864 3.79292C2.10998 3.44045 2.36742 3.11325 2.65492 2.81612H6.22409L2.26396 10.7352C2.13043 10.5656 2.00412 10.3911 1.88864 10.2083V3.79292ZM2.96529 11.4834L7 3.41519L11.0347 11.4834C9.96529 12.4482 8.55181 13.0376 7 13.0376C5.44819 13.0376 4.03592 12.447 2.96529 11.4834Z" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

function formatReduction(original: number, encoded: number): number {
  if (original === 0) return 0;
  const reduction = ((original - encoded) / original) * 100;
  return Math.max(0, Math.round(reduction));
}

function DownloadStageView({
  process,
  fileResults,
  onDownload,
  onDownloadAll,
  isDownloadingAll = false,
  onReset,
  className,
}: DownloadStageViewProps) {
  const isDecoding = process === "decompress";
  const { isScrolled } = useWorkflow();

  useEffect(() => {
    if (isDecoding) return;
    const hasHighCompression = fileResults.some(
      (r) =>
        r.encodedSize !== null &&
        r.originalSize > 0 &&
        (r.originalSize - r.encodedSize) / r.originalSize > 0.9
    );
    if (!hasHighCompression) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 2 : 3;
    const duration = isMobile ? 1500 : 2000;
    const end = Date.now() + duration;
    const colors = ["#c2ea53", "#bdfee3", "#a9b7fc", "#fccaec", "#ffd8a9", "#feffe3", "#ff8fab", "#74c7ec", "#f9c74f", "#90e0ef", "#b5e48c", "#d0a2f7"];
    (function frame() {
      confetti({ particleCount, angle: 60, spread: 50, origin: { x: 0 }, colors });
      confetti({ particleCount, angle: 120, spread: 50, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate total space saved across all files (bytes)
  const totalSavedBytes = useMemo(() => {
    return fileResults.reduce((sum, result) => {
      if (result.encodedSize !== null && result.originalSize > result.encodedSize) {
        return sum + (result.originalSize - result.encodedSize);
      }
      return sum;
    }, 0);
  }, [fileResults]);

  const fileTableItems: FileTableItem[] = useMemo(() => {
    return fileResults.map((result) => {
      if (result.error) {
        return {
          name: result.fileName,
          typeLabel: "",
          formattedSize: formatFileSize(result.originalSize),
          status: "error" as FileTableItem["status"],
          sizeError: result.error,
        };
      }

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
    if (!result || result.error) return;
    const wasDecoded = isDecoding || result.encodedSize === null;
    const servaName = result.fileName.replace(/\.[^.]+$/, ".serva");
    const displayName = wasDecoded ? result.fileName : servaName;
    onDownload(result.fileId, displayName);
  };

  const handleDownloadReport = useCallback(() => {
    const headers = [
      "File Name",
      "Original Size (bytes)",
      "Encoded Size (bytes)",
      "Reduction (%)",
      "Duration (s)",
      ...(isDecoding
        ? []
        : ["Original SHA-256", "Decoded SHA-256", "Roundtrip Match"]),
    ];
    const rows = fileResults.map((r) => {
      const reduction = r.encodedSize !== null && r.originalSize > 0
        ? Math.round(((r.originalSize - r.encodedSize) / r.originalSize) * 100)
        : "";
      const duration = r.durationMs !== null ? (r.durationMs / 1000).toFixed(1) : "";
      const row: (string | number)[] = [
        r.fileName,
        r.originalSize,
        r.encodedSize ?? "",
        reduction,
        duration,
      ];
      if (!isDecoding) {
        row.push(
          r.originalSha256Hex ?? "",
          r.decodedSha256Hex ?? "",
          r.roundtripHashesMatch == null ? "" : r.roundtripHashesMatch ? "true" : "false",
        );
      }
      return row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    a.download = `servamind-report-${timestamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [fileResults, isDecoding]);

  return (
    <div className={cn("space-y-0", className)}>
      {/* Header */}
      <div className={cn("flex items-center justify-between py-5 px-4 sticky top-0 bg-white z-10", isScrolled && "border-b border-light-200")}>
        <div className="flex items-center justify-between md:justify-start gap-2 flex-1 md:flex-initial">
          <h1 className="text-lg md:text-xl font-semibold text-serva-gray-600 leading-[1.1] whitespace-nowrap">
            {isDecoding ? "Decoding complete" : "Encoding complete"}
          </h1>
          <Button variant="secondary" size="md" onClick={onReset}>
            <span className="hidden md:inline">{isDecoding ? "Decode more files" : "Encode more files"}</span>
            <span className="md:hidden">{isDecoding ? "Decode more" : "Encode more"}</span>
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!isDecoding && (
            <Button variant="secondary" size="md" onClick={handleDownloadReport} className="whitespace-nowrap">
              Download report
              <GoogleDocsIcon />
            </Button>
          )}
          <Button size="md" onClick={onDownloadAll} disabled={isDownloadingAll} className="whitespace-nowrap">
            {isDownloadingAll ? "Downloading…" : "Download all"}
            {isDownloadingAll
              ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              : <DownloadIcon />
            }
          </Button>
        </div>
      </div>

      {/* File list */}
      <div className="px-4 pb-6">
        <FileTable
          files={fileTableItems}
          onDownload={handleDownloadByIndex}
          className="max-h-[60vh] md:max-h-[448px] overflow-y-auto scrollbar-visible"
        />
      </div>

      {/* Space savings banner — encoding only */}
      {!isDecoding && totalSavedBytes > 0 && (
        <div className="px-4 pb-6">
          <div
            className="border border-light-200 rounded-[8px] p-4 flex items-center justify-center"
            style={{
              backgroundImage:
                "linear-gradient(130deg, rgba(194,234,83,0.1) 0%, rgba(189,255,227,0.1) 20%, rgba(169,183,252,0.1) 40%, rgba(252,202,236,0.1) 60%, rgba(255,216,169,0.1) 80%, rgba(254,255,211,0.1) 100%)",
            }}
          >
            <p className="text-sm text-serva-gray-600 tracking-[-0.42px] leading-[1.1] text-center">
              Your .serva files are saving you{" "}
              <span className="font-semibold">
                {formatFileSize(totalSavedBytes)}
              </span>{" "}
              of space!
            </p>
          </div>
        </div>
      )}

      {/* Mobile: download buttons below banner */}
      <div className="flex md:hidden flex-col sm:flex-row gap-3 sm:gap-4 px-4 pb-6">
        {!isDecoding && (
          <Button variant="secondary" size="md" onClick={handleDownloadReport} className="w-full sm:flex-1 justify-center whitespace-nowrap">
            Download report
            <GoogleDocsIcon />
          </Button>
        )}
        <Button size="md" onClick={onDownloadAll} className="w-full sm:flex-1 justify-center whitespace-nowrap">
          Download all
          <DownloadIcon />
        </Button>
      </div>

      {/* What's next section — encoding only */}
      {!isDecoding && (
        <div className="flex flex-col items-center gap-12 py-10 px-6">
          <div className="flex flex-col items-center gap-[20px]">
            <p className="text-lg md:text-xl font-semibold leading-[1.2] text-center">
              <span className="text-serva-gray-400 block md:inline">What&apos;s next? </span>
              <span className="text-serva-gray-600 block md:inline">
                Train with your .serva files
              </span>
            </p>
            <p className="text-sm text-serva-gray-400 text-center tracking-[-0.42px] leading-[1.4] max-w-[371px]">
              Your files are now encoded in a universal format designed for
              model training and reuse.
            </p>
          </div>

          {/* Step cards */}
          <div className="flex flex-col md:flex-row items-stretch gap-4 justify-center px-4 md:px-0">
            {/* Step 1 — dimmed */}
            <div className="flex w-full md:w-[339px] opacity-50">
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
            <div className="flex w-full md:w-[339px]">
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
                    <span className="bg-light-300 rounded-[8px] px-3 py-2 font-mono text-xs text-serva-gray-600 tracking-[1.2px] leading-[1.1] whitespace-nowrap">
                      MODEL TRAINING
                    </span>
                  </div>
                  <p className="text-sm text-serva-gray-400 text-center tracking-[-0.42px] leading-[1.4] w-[275px]">
                    Use the same encoded file across experiments and models
                    without rebuilding preprocessing pipelines.
                  </p>
                </div>
                <a
                  href="https://servamind.mintlify.app/tutorials/training/resnet-from-servas-tutorial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <Button size="md">
                    Train your models
                    <ArrowRightIcon />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { DownloadStageView, type DownloadStageViewProps };
