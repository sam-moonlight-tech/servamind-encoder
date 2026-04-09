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

function ImageIcon() {
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
      <rect x="2" y="2" width="12" height="12" rx="1.5" />
      <circle cx="5.5" cy="5.5" r="1.25" />
      <path d="M14 10.5l-3-3L3 14" />
    </svg>
  );
}

function VideoIcon() {
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
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
      <path d="M6.5 6v4l3.5-2-3.5-2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AudioIcon() {
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
      <path d="M6 3v10M6 13a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 2v9M14 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM6 3l8-1" />
    </svg>
  );
}

function DataIcon() {
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
      <ellipse cx="8" cy="4" rx="5" ry="2" />
      <path d="M3 4v4c0 1.1 2.239 2 5 2s5-.9 5-2V4" />
      <path d="M3 8v4c0 1.1 2.239 2 5 2s5-.9 5-2V8" />
    </svg>
  );
}

function ArchiveIcon() {
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
      <rect x="2" y="2" width="12" height="3" rx="1" />
      <path d="M3 5v8a1 1 0 001 1h8a1 1 0 001-1V5" />
      <path d="M6.5 8h3" />
    </svg>
  );
}

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "tif", "ico", "heic", "heif", "avif"]);
const VIDEO_EXTS = new Set(["mp4", "mov", "avi", "mkv", "webm", "wmv", "flv", "m4v"]);
const AUDIO_EXTS = new Set(["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"]);
const DATA_EXTS = new Set(["csv", "json", "xml", "yaml", "yml", "tsv", "parquet", "arrow", "h5", "hdf5", "npy", "npz"]);
const ARCHIVE_EXTS = new Set(["zip", "tar", "gz", "rar", "7z", "bz2", "xz"]);

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "serva") return <ServaIcon />;
  if (IMAGE_EXTS.has(ext)) return <ImageIcon />;
  if (VIDEO_EXTS.has(ext)) return <VideoIcon />;
  if (AUDIO_EXTS.has(ext)) return <AudioIcon />;
  if (DATA_EXTS.has(ext)) return <DataIcon />;
  if (ARCHIVE_EXTS.has(ext)) return <ArchiveIcon />;
  return <DocumentIcon />;
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

function ReductionArrowIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M4.31998 0.479981V8.47998M4.31998 8.47998L0.47998 4.63998M4.31998 8.47998L8.15998 4.63998" stroke="currentColor" strokeWidth="0.96" strokeLinecap="round" strokeLinejoin="round"/>
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
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M4 13.3334L12 13.3334" />
      <path d="M8.00033 2.66663V10.6666M8.00033 10.6666L10.3337 8.33329M8.00033 10.6666L5.66699 8.33329" />
    </svg>
  );
}

function HoloProgressBar({ value, indeterminate }: { value: number; indeterminate?: boolean }) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className="w-[60px] md:w-[120px] h-[4px] bg-light-200 rounded-[12px] overflow-hidden shrink-0">
      <div
        className={cn("h-full rounded-[12px]", indeterminate && "animate-progress-slide")}
        style={{
          width: indeterminate ? "60%" : `${clampedValue}%`,
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
        "flex items-center justify-between h-auto md:h-[56px] p-5 md:py-5 border-b border-light-200 last:border-b-0",
        isError ? "bg-[#fff4f4]" : "bg-white",
        hasDownload ? "md:pl-5 md:pr-[10px]" : "md:pl-5 md:pr-[22px]",
      )}
    >
      {/* Left side: icon + name + sizes */}
      {/* Mobile layout: flex-col with [icon + name] row then size below, left-aligned */}
      {/* Desktop layout: single row [icon name | original | encoded] */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 min-w-0">
        <div className="flex items-start md:items-center gap-3 min-w-0">
          <span className="flex items-center justify-center w-4 h-4 mt-0.5 md:mt-0 shrink-0">
            {isEncoded ? <ServaIcon /> : getFileIcon(file.name)}
          </span>
          <span className="text-sm text-serva-gray-600 leading-[1.1] tracking-[-0.42px] truncate min-w-0 md:w-[250px]">
            {file.name}
          </span>
        </div>

        {/* Size info — mobile: encoded only; desktop: original + encoded inline */}
        <div className="flex items-center text-sm leading-[1.1] tracking-[-0.42px] whitespace-nowrap">
          <span className="text-serva-gray-400 md:w-[140px]">
            Original: {file.formattedSize}
          </span>
          {isDone && file.encodedSize ? (
            <div className="flex items-center gap-1">
              <span className="text-serva-gray-400">
                Encoded: {file.encodedSize}
              </span>
              {file.reductionPercent != null && file.reductionPercent > 0 && (
                <span className="text-serva-green flex items-center gap-0.5">
                  (<ReductionArrowIcon />{file.reductionPercent}%)
                </span>
              )}
            </div>
          ) : (
            <span className="md:hidden text-serva-gray-400">
              {file.formattedSize}
            </span>
          )}
        </div>
      </div>

      {/* Right side: status */}
      <div className={cn(
        "flex items-center justify-end shrink-0",
        hasDownload ? "gap-4" : "gap-2 md:gap-4"
      )}>
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
          <>
            {/* Desktop: full download button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(index);
              }}
              className="hidden md:flex items-center gap-2 h-[36px] px-3 bg-light-300 rounded-[4px] text-sm font-semibold text-serva-gray-600 cursor-pointer hover:bg-light-200 transition-colors"
            >
              Download
              <DownloadIcon />
            </button>
            {/* Mobile: icon-only download button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(index);
              }}
              className="flex md:hidden items-center justify-center size-[36px] p-3 bg-light-300 rounded-[4px] text-serva-gray-600 cursor-pointer hover:bg-light-200 transition-colors"
            >
              <DownloadIcon />
            </button>
          </>
        )}

        {isEncoding && (
          <>
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


        {file.status === "waiting" && (
          <>
            <span className="text-sm text-serva-gray-200 leading-[1.1] tracking-[-0.42px] whitespace-nowrap">
              Waiting
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
      <div
        className={cn("rounded-[16px] overflow-y-auto animate-holo-spin", className)}
        style={{
          border: "2px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), conic-gradient(from var(--holo-angle), var(--color-holo-green), var(--color-holo-seafoam), var(--color-holo-blue), var(--color-holo-pink), var(--color-holo-orange), var(--color-holo-yellow), var(--color-holo-green))",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        {files.map((file, i) => (
          <FileRow
            key={`${file.name}-${i}`}
            file={file}
            index={i}
            processLabel={processLabel}
            onRemove={["error", "waiting", "encoding"].includes(file.status) ? onRemove : undefined}
            onDownload={onDownload}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="border border-light-200 rounded-[16px] overflow-hidden">
      <div className={cn("overflow-x-hidden", className)}>
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
    </div>
  );
}

export { FileTable, type FileTableProps };
