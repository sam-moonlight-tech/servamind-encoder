import { cn } from "@/lib/utils";
import type { ProcessType } from "@/types/domain.types";

interface PageHeaderProps {
  title: string;
  processType?: ProcessType;
  onProcessTypeChange?: (type: ProcessType) => void;
  className?: string;
}

function PageHeader({ title, processType = "compress", onProcessTypeChange, className }: PageHeaderProps) {
  return (
    <header className={cn("flex items-center gap-4 py-6 px-6", className)}>
      <h1 className="text-xl font-extrabold text-serva-gray-600 tracking-tight leading-[1.1]">
        {title}
      </h1>
      {onProcessTypeChange && (
        <div className="flex items-center bg-light-300 rounded-[7px] p-1">
          <button
            onClick={() => onProcessTypeChange("compress")}
            className={cn(
              "px-4 py-1.5 text-sm rounded-[5px] transition-colors cursor-pointer",
              processType === "compress"
                ? "bg-white text-serva-gray-600 font-medium shadow-sm"
                : "text-serva-gray-400 hover:text-serva-gray-600"
            )}
          >
            Encode
          </button>
          <button
            onClick={() => onProcessTypeChange("decompress")}
            className={cn(
              "px-4 py-1.5 text-sm rounded-[5px] transition-colors cursor-pointer",
              processType === "decompress"
                ? "bg-white text-serva-gray-600 font-medium shadow-sm"
                : "text-serva-gray-400 hover:text-serva-gray-600"
            )}
          >
            Decode
          </button>
        </div>
      )}
    </header>
  );
}

export { PageHeader, type PageHeaderProps };
