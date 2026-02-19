import { useRef } from "react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  isDragging: boolean;
  file?: File;
  sizeError: string | null;
  onFileSelect: (file: File) => void;
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
  onFileSelect,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  className,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div
      className={cn("group relative rounded-[52px] p-8 overflow-hidden", className)}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Rotating conic gradient layer - forced square so rotation always covers corners */}
      <div
        className="absolute top-1/2 left-1/2 aspect-square w-[200%] min-w-[200%] -translate-x-1/2 -translate-y-1/2 group-hover:animate-holo-spin"
        style={{
          backgroundImage:
            "conic-gradient(from 90deg, #c2ea53, #c1ef77, #c0f59b, #bdffe3, #a9b7fc, #d3c1f4, #fccaec, #ffd8a9, #feffd3, #e0f593, #d1ef73, #c2ea53)",
        }}
      />

      {/* Semi-transparent overlay to mute the gradient */}
      <div className="absolute inset-0 rounded-[52px] bg-light-200/60" />

      <div
        className={cn(
          "relative flex flex-col items-center justify-center h-[440px] rounded-[20px] border border-dashed border-serva-gray-100 cursor-pointer transition-all duration-200",
          isDragging && "scale-[1.005]"
        )}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Drop zone for file upload"
      >
        {/* White backdrop overlay */}
        <div className="absolute inset-0 rounded-[20px] bg-white/80 backdrop-blur-[2px] border border-dashed border-serva-gray-100" />

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleInputChange}
        />

        <div className="relative z-10 flex flex-col items-center gap-6">
          {file ? (
            <div className="text-center">
              <p className="text-serva-gray-600 font-extrabold text-2xl tracking-tight">
                {file.name}
              </p>
              <p className="text-[15px] text-serva-gray-600 mt-2">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <>
              {/* Cloud upload icon */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-serva-gray-600"
              >
                <path d="M24 32V22m0 0l-5 5m5-5l5 5" />
                <path d="M12.5 36A10.5 10.5 0 0114 15.5a13 13 0 0120 0A10.5 10.5 0 0135.5 36" />
              </svg>

              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-2xl text-serva-gray-600 tracking-tight leading-[1.1]">
                  Turn your raw data into
                </span>
                <div className="pt-1">
                  <span className="bg-light-200 rounded-[5px] px-2.5 py-1 font-mono text-sm text-serva-gray-600 tracking-[1.4px]">
                    .serva
                  </span>
                </div>
              </div>

              <p className="text-[15px] text-serva-gray-600 text-center leading-[1.2] tracking-tight max-w-[355px]">
                Drop or upload any file to encode them once, then
                reuse them across every AI model and workflow.
              </p>

              <p className="text-xs text-serva-gray-300 text-center">
                Up to 100 MB &bull; txt, csv, json, pdf, png, jpg, mp4
              </p>
            </>
          )}
        </div>

        {sizeError && (
          <p className="relative z-10 text-sm text-red-500 mt-4">{sizeError}</p>
        )}
      </div>
    </div>
  );
}

export { DropZone, type DropZoneProps };
