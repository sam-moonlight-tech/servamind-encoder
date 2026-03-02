import { cn } from "@/lib/utils";
import type { FileTableItem } from "@/types/domain.types";

interface FileTableProps {
  files: FileTableItem[];
  encoding?: boolean;
  onRemove?: (index: number) => void;
  onDownload?: (index: number) => void;
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
      className="text-serva-gray-400 shrink-0"
    >
      <path d="M9.333 2H5.333A1.333 1.333 0 004 3.333v9.334A1.333 1.333 0 005.333 14h5.334A1.333 1.333 0 0012 12.667V4.667L9.333 2z" />
      <path d="M9.333 2v2.667H12" />
    </svg>
  );
}

function ServaIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <rect width="16" height="16" rx="3" fill="#630066" />
      <text
        x="8"
        y="11"
        textAnchor="middle"
        fill="white"
        fontSize="7"
        fontFamily="monospace"
        fontWeight="bold"
      >
        S
      </text>
    </svg>
  );
}

function CheckIcon() {
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
      className="text-serva-green shrink-0"
    >
      <path d="M3.5 8.5l3 3 6-6" />
    </svg>
  );
}

function XMarkIcon() {
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
      className="text-serva-gray-300 shrink-0"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
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

function HoloProgressBar({ value }: { value: number }) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className="w-[120px] h-[4px] bg-light-200 rounded-[12px] overflow-hidden shrink-0">
      <div
        className="h-full rounded-[12px]"
        style={{
          width: `${clampedValue}%`,
          backgroundImage:
            "linear-gradient(90deg, var(--color-holo-green) 0%, var(--color-holo-seafoam) 20%, var(--color-holo-blue) 40%, var(--color-holo-pink) 60%, var(--color-holo-orange) 80%, var(--color-holo-yellow) 100%)",
        }}
      />
    </div>
  );
}

function FileRow({
  file,
  index,
  onRemove,
  onDownload,
}: {
  file: FileTableItem;
  index: number;
  onRemove?: (index: number) => void;
  onDownload?: (index: number) => void;
}) {
  const isEncoded = file.status === "encoded";
  const isEncoding = file.status === "encoding";
  const isReady = file.status === "ready";
  const isError = file.status === "error";
  const hasDownload = isEncoded && onDownload;

  return (
    <div
      className={cn(
        "flex items-center justify-between h-[56px] py-5 bg-white border-b border-light-200 last:border-b-0",
        hasDownload ? "pl-8 pr-[10px]" : "px-8"
      )}
    >
      {/* Left side: icon + name + sizes */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {isEncoded ? <ServaIcon /> : <DocumentIcon />}
          <span className="text-sm text-serva-gray-600 leading-[1.1] tracking-[-0.42px] truncate w-[250px]">
            {file.name}
          </span>
        </div>

        {isEncoded ? (
          <div className="flex items-center gap-4 text-sm leading-[1.1] tracking-[-0.42px] whitespace-nowrap">
            <span className="text-serva-gray-400">
              Original: {file.formattedSize}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-serva-gray-400">
                Encoded: {file.encodedSize}
              </span>
              {file.reductionPercent != null && (
                <span className="text-serva-gray-200">
                  (-{file.reductionPercent}%)
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-sm text-serva-gray-400 leading-[1.1] tracking-[-0.42px] whitespace-nowrap">
            Original: {file.formattedSize}
          </span>
        )}
      </div>

      {/* Right side: status */}
      <div className="flex items-center gap-4 justify-end">
        {isEncoded && (
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span className="text-sm text-serva-gray-400 leading-[1.1] tracking-[-0.42px] whitespace-nowrap">
              {file.durationSeconds != null
                ? `${file.durationSeconds.toFixed(1)}s`
                : ""}
            </span>
          </div>
        )}

        {hasDownload && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(index);
            }}
            className="flex items-center gap-2 h-[36px] px-3 bg-light-300 rounded-[4px] text-sm font-semibold text-serva-gray-600 cursor-pointer hover:bg-light-200 transition-colors"
          >
            Download
            <DownloadIcon />
          </button>
        )}

        {isEncoding && (
          <div className="flex items-center gap-2">
            <HoloProgressBar value={file.encodingProgress ?? 0} />
            <span className="text-sm text-serva-gray-400 leading-[1.1] tracking-[-0.42px] whitespace-nowrap">
              {file.encodingProgress ?? 0}%
            </span>
          </div>
        )}

        {(isReady || file.status === "uploading") && (
          <>
            <span className="text-sm text-serva-gray-400 leading-[1.1] tracking-[-0.42px] whitespace-nowrap">
              Ready
            </span>
            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="cursor-pointer hover:opacity-70"
              >
                <XMarkIcon />
              </button>
            )}
          </>
        )}

        {isError && (
          <>
            <span className="text-sm text-red-500 leading-[1.1] tracking-[-0.42px] whitespace-nowrap">
              {file.sizeError ?? "Error"}
            </span>
            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="cursor-pointer hover:opacity-70"
              >
                <XMarkIcon />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FileTable({ files, encoding, onRemove, onDownload, className }: FileTableProps) {
  return (
    <div
      className={cn(
        "border rounded-[16px] overflow-clip",
        encoding ? "border-holo-green" : "border-light-200",
        className
      )}
    >
      {files.map((file, i) => (
        <FileRow
          key={`${file.name}-${i}`}
          file={file}
          index={i}
          onRemove={encoding ? undefined : onRemove}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}

export { FileTable, type FileTableProps };
