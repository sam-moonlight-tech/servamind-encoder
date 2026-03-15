import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ALLOWED_ENCODE_EXTENSIONS, COMPRESSED_FILE_TYPE } from "@/config/constants";
import type { ProcessType } from "@/types/domain.types";

interface DropZoneProps {
  isDragging: boolean;
  file?: File;
  sizeError: string | null;
  processType?: ProcessType;
  onFileSelect: (files: File[]) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  className?: string;
}

function DropZone({
  isDragging,
  file,
  sizeError,
  processType = "compress",
  onFileSelect,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  className,
}: DropZoneProps) {
  const isDecoding = processType === "decompress";
  const inputRef = useRef<HTMLInputElement>(null);
  const acceptAttr = isDecoding
    ? `.${COMPRESSED_FILE_TYPE}`
    : ALLOWED_ENCODE_EXTENSIONS.map((ext) => `.${ext}`).join(",");

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      onFileSelect(Array.from(selected));
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-[16px] border border-dashed border-serva-gray-100 cursor-pointer transition-all duration-200",
        isDragging && "scale-[1.005] border-core-purple",
        className
      )}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Drop zone for file upload"
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="flex flex-col items-center justify-center py-16 px-8 gap-5">
        {file ? (
          <div className="text-center">
            <p className="text-serva-gray-600 font-semibold text-xl tracking-[-0.6px] leading-[1.1]">
              {file.name}
            </p>
            <p className="text-sm text-serva-gray-400 mt-2">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <>
            {/* Cloud icon in white bordered box */}
            <div className="bg-white border border-light-200 rounded-[8px] p-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-serva-gray-600"
              >
                {isDecoding ? (
                  <>
                    <path d="M12 11v5m0 0l-2.5-2.5M12 16l2.5-2.5" />
                    <path d="M6.25 18A5.25 5.25 0 017 7.75a6.5 6.5 0 0110 0A5.25 5.25 0 0117.75 18" />
                  </>
                ) : (
                  <>
                    <path d="M12 16v-5m0 0l-2.5 2.5M12 11l2.5 2.5" />
                    <path d="M6.25 18A5.25 5.25 0 017 7.75a6.5 6.5 0 0110 0A5.25 5.25 0 0117.75 18" />
                  </>
                )}
              </svg>
            </div>

            {/* Heading */}
            <h2 className="text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.1] text-center">
              {isDecoding
                ? "Decode .serva files back into your original dataset"
                : "Turn your data into reusable .serva files"}
            </h2>

            {/* Description */}
            <p className="text-sm text-serva-gray-400 text-center max-w-[380px] leading-[1.4] tracking-[-0.42px]">
              {isDecoding
                ? "Drop or upload your .serva files to restore your data with byte\u2011for\u2011byte fidelity."
                : "Upload once and securely reuse the same encoded dataset across models, experiments, and pipelines."}
            </p>

            {/* Select Files button */}
            <button
              className="bg-core-purple text-light-200 rounded-[8px] px-3 h-9 text-sm font-semibold transition-colors hover:bg-core-purple/90 active:bg-core-purple/80 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Select Files
            </button>

            {/* File limit text */}
            <p className="text-xs text-serva-gray-300 text-center">
              {"Up to 100 MB \u00b7 txt, csv, json, pdf, png, jpg, mp4"}
            </p>
          </>
        )}

        {sizeError && <p className="text-sm text-red-500">{sizeError}</p>}
      </div>
    </div>
  );
}

export { DropZone, type DropZoneProps };
