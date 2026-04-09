import { useRef, useEffect } from "react";
import { useRive, Layout, Fit } from "@rive-app/react-webgl2";
import { cn } from "@/lib/utils";
import { COMPRESSED_FILE_TYPE } from "@/config/constants";
import type { ProcessType } from "@/types/domain.types";

const RIVE_LAYOUT = new Layout({ fit: Fit.Cover });

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
  const acceptAttr = isDecoding ? `.${COMPRESSED_FILE_TYPE}` : undefined;
  const { RiveComponent, rive } = useRive({
    src: "/Aurora_mk4.riv",
    artboard: "Artboard",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: RIVE_LAYOUT,
  });

  // Resume animation when tab regains visibility (WebGL pauses on hidden tabs)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && rive) {
        rive.startRendering();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [rive]);

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
        "relative overflow-hidden rounded-[16px] border border-dashed border-serva-gray-100 cursor-pointer transition-all duration-200",
        isDragging && "border-core-purple",
        className
      )}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
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

      {/* Rive animation background */}
      <div className="absolute inset-0 rounded-[16px] overflow-hidden pointer-events-none">
        <RiveComponent className="w-full h-full" />
      </div>

      <div className="relative pointer-events-none flex flex-col items-center justify-center py-8 px-4 md:py-16 md:px-8 gap-6">
        {file ? (
          <div className="text-center">
            <p className="text-serva-gray-600 font-semibold text-xl leading-[1.1]">
              {file.name}
            </p>
            <p className="text-sm text-serva-gray-400 mt-2">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <>
            {/* Upload/download icon in white bordered box */}
            <div className="bg-white border border-light-200 rounded-[8px] p-3">
              <svg
                width="12"
                height="16"
                viewBox="0 0 12 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-serva-gray-400"
              >
                <path d="M6 10V1" />
                <path d="M2.5 4.5L6 1l3.5 3.5" />
                <path d="M11 8v5.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 011 13.5V8" />
              </svg>
            </div>

            {/* Heading */}
            <h2 className="text-2xl md:text-xl font-semibold text-serva-gray-600 leading-[1.2] text-center">
              {isDecoding
                ? "Decode .serva files back into your original dataset"
                : "Turn your data into reusable .serva files"}
            </h2>

            {/* Description */}
            <p className="text-sm text-serva-gray-400 text-center max-w-full md:max-w-[380px] leading-[1.4] tracking-[-0.42px]">
              {isDecoding
                ? "Drop or upload your .serva files to restore your data with byte‑for‑byte fidelity."
                : "Upload once and securely reuse the same encoded dataset across models, experiments, and pipelines."}
            </p>

            {/* File limit text — above button on mobile, below on desktop */}
            <p className="text-xs text-serva-gray-300 text-center order-1 md:order-2">
              {isDecoding ? "Up to 10 GB · .serva files only" : "Up to 10 GB · Any file type"}
            </p>

            {/* Select Files button */}
            <button
              className="pointer-events-auto bg-core-purple text-light-200 rounded-[8px] px-3 h-9 text-sm font-semibold transition-colors hover:bg-core-purple/90 active:bg-core-purple/80 cursor-pointer order-2 md:order-1"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Select Files
            </button>
          </>
        )}

        {sizeError && <p className="text-sm text-red-500">{sizeError}</p>}
      </div>
    </div>
  );
}

export { DropZone, type DropZoneProps };
