import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { EXTERNAL_LINKS } from "@/config/constants";

interface ErrorStageViewProps {
  onReset: () => void;
  className?: string;
}

function ErrorStageView({ onReset, className }: ErrorStageViewProps) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center py-16",
        className,
      )}
    >
      <div className="flex max-w-[400px] flex-col items-center text-center">
        <svg
          className="mb-4 h-10 w-10 text-serva-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 className="text-[20px] font-semibold text-serva-gray-600">
          Something Went Wrong
        </h3>
        <p className="mt-2 text-sm text-serva-gray-400">
          An error occurred during processing. Please try again or contact
          support if the issue persists.
        </p>
        <div className="mt-6 flex gap-3">
          <a
            href={EXTERNAL_LINKS.CONTACT}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary">Contact Support</Button>
          </a>
          <Button onClick={onReset}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}

export { ErrorStageView, type ErrorStageViewProps };
