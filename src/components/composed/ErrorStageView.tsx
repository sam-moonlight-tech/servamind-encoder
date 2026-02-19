import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { EXTERNAL_LINKS } from "@/config/constants";

interface ErrorStageViewProps {
  onReset: () => void;
  className?: string;
}

function ErrorStageView({ onReset, className }: ErrorStageViewProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-serva-gray-600">
        Something Went Wrong
      </h3>
      <p className="text-serva-gray-400">
        An error occurred during processing. Please try again or contact support
        if the issue persists.
      </p>
      <div className="flex flex-col sm:flex-row-reverse gap-2 justify-end">
        <Button onClick={onReset}>Try Again</Button>
        <a
          href={EXTERNAL_LINKS.CONTACT}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary" className="w-full">
            Contact Support
          </Button>
        </a>
      </div>
    </div>
  );
}

export { ErrorStageView, type ErrorStageViewProps };
