import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ProcessType } from "@/types/domain.types";

interface DownloadStageViewProps {
  process: ProcessType;
  downloadLink: string;
  onReset: () => void;
  className?: string;
}

function DownloadStageView({
  process,
  downloadLink,
  onReset,
  className,
}: DownloadStageViewProps) {
  const title = "Download Ready";
  const description =
    process === "compress"
      ? "Your file has been successfully compressed. Click below to download your .serva file."
      : "Your file has been successfully decompressed. Click below to download your original file.";

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-serva-gray-600">{title}</h3>
      <p className="text-serva-gray-400">{description}</p>
      <div className="flex flex-col sm:flex-row-reverse gap-2 justify-end">
        <Button variant="secondary" onClick={onReset}>
          Encode Another File
        </Button>
        <a
          href={downloadLink}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <Button className="w-full">Download File</Button>
        </a>
      </div>
    </div>
  );
}

export { DownloadStageView, type DownloadStageViewProps };
