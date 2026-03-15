import { cn } from "@/lib/utils";
import type { FileTableItem } from "@/types/domain.types";

interface FileTableProps {
  files: FileTableItem[];
  encoding?: boolean;
  processLabel?: string;
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
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path d="M2.25879 0H8.79129L13.74 4.94875V16H2.25879V0Z" fill="white" />
      <path
        d="M8.79129 0H2.25879V16H13.74V4.94875L8.79129 0ZM8.88566 4.81125V0.978125L12.7188 4.81125H8.88566Z"
        fill="#51A500"
      />
      <path
        d="M10.9683 8.45V7.5825H10.2764C9.62828 6.985 8.76328 6.62 7.81266 6.62C6.86203 6.62 5.99703 6.985 5.34891 7.5825H4.65703V8.45C4.35141 8.9825 4.17578 9.59937 4.17578 10.2569C4.17578 10.9144 4.35141 11.5312 4.65703 12.0637V13.8937H10.9683V12.0637C11.2739 11.5312 11.4495 10.9144 11.4495 10.2569C11.4495 9.59937 11.2739 8.9825 10.9683 8.45ZM10.4683 8.59062V11.9237C10.4083 12.0187 10.3427 12.1094 10.2733 12.1975L8.21578 8.08312H10.0702C10.2195 8.23812 10.3527 8.40812 10.4683 8.59062ZM7.81266 7.12C8.41203 7.12 8.97328 7.28937 9.45016 7.5825H6.17516C6.65203 7.28937 7.21266 7.12 7.81266 7.12ZM5.15703 8.59062C5.27203 8.4075 5.40578 8.2375 5.55516 8.08312H7.40953L5.35203 12.1975C5.28266 12.1094 5.21703 12.0187 5.15703 11.9237V8.59062ZM5.71641 12.5862L7.81266 8.39437L9.90891 12.5862C9.35328 13.0875 8.61891 13.3937 7.81266 13.3937C7.00641 13.3937 6.27266 13.0869 5.71641 12.5862Z"
        fill="white"
      />
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

function WarningIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0"
    >
      <circle cx="7" cy="7" r="5.5" stroke="#660000" strokeWidth="1.2" />
      <line x1="7" y1="4" x2="7" y2="8" stroke="#660000" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="10" r="0.75" fill="#660000" />
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

function HoloProgressBar({ value, indeterminate }: { value: number; indeterminate?: boolean }) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className="w-[120px] h-[4px] bg-light-200 rounded-[12px] overflow-hidden shrink-0">
      <div
        className={cn("h-full rounded-[12px]", indeterminate && "animate-pulse")}
        style={{
          width: indeterminate ? "70%" : `${clampedValue}%`,
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
  processLabel = "Encoding",
  onRemove,
  onDownload,
}: {
  file: FileTableItem;
  index: number;
  processLabel?: string;
  onRemove?: (index: number) => void;
  onDownload?: (index: number) => void;
}) {
  const isEncoded = file.status === "encoded";
  const isComplete = file.status === "complete";
  const isDone = isEncoded || isComplete;
  const isEncoding = file.status === "encoding";
  const isReady = file.status === "ready";
  const isError = file.status === "error";
  const hasDownload = isDone && onDownload;

  return (
    <div
      className={cn(
        "flex items-center justify-between h-[56px] py-5 border-b border-light-200 last:border-b-0",
        isError ? "bg-[#fff4f4]" : "bg-white",
        hasDownload ? "pl-8 pr-[10px]" : "pl-8 pr-[22px]",
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

        {isEncoded && file.encodedSize ? (
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
                  (-{Math.abs(file.reductionPercent)}%)
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
        {isDone && (
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
            <HoloProgressBar
              value={file.encodingProgress ?? 0}
              indeterminate={file.encodingProgress == null}
            />
            <span className="text-sm text-serva-gray-400 leading-[1.1] tracking-[-0.42px] whitespace-nowrap">
              {file.encodingProgress != null
                ? `${file.encodingProgress}%`
                : `${processLabel}...`}
            </span>
          </div>
        )}

        {file.status === "waiting" && (
          <span className="text-sm text-serva-gray-200 leading-[1.1] tracking-[-0.42px] whitespace-nowrap">
            Waiting
          </span>
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
            <div className="flex items-center gap-2">
              <WarningIcon />
              <span className="text-sm text-[#660000] leading-[1.1] tracking-[-0.42px] whitespace-nowrap">
                {file.sizeError ?? `${processLabel} failed`}
              </span>
            </div>
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

function FileTable({ files, encoding, processLabel, onRemove, onDownload, className }: FileTableProps) {
  if (encoding) {
    return (
      <div className={cn("relative rounded-[16px] p-[2px]", className)}>
        {/* Animated holographic border — colors cycle via @property --holo-angle */}
        <div
          className="absolute inset-0 rounded-[16px] animate-holo-spin"
          style={{
            backgroundImage:
              "conic-gradient(from var(--holo-angle), var(--color-holo-green), var(--color-holo-seafoam), var(--color-holo-blue), var(--color-holo-pink), var(--color-holo-orange), var(--color-holo-yellow), var(--color-holo-green))",
          }}
        />
        <div className="relative rounded-[14px] overflow-clip">
          {files.map((file, i) => (
            <FileRow
              key={`${file.name}-${i}`}
              file={file}
              index={i}
              processLabel={processLabel}
              onRemove={file.status === "error" ? onRemove : undefined}
              onDownload={onDownload}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border border-light-200 rounded-[16px] overflow-clip",
        className
      )}
    >
      {files.map((file, i) => (
        <FileRow
          key={`${file.name}-${i}`}
          file={file}
          index={i}
          onRemove={onRemove}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}

export { FileTable, type FileTableProps };
