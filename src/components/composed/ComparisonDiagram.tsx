import { cn } from "@/lib/utils";

interface ComparisonDiagramProps {
  className?: string;
}

function FlowArrow() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-serva-gray-300 shrink-0"
    >
      <path d="M5 12h14m0 0l-4-4m4 4l-4 4" />
    </svg>
  );
}

function FlowStep({
  label,
  highlight,
}: {
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-[8px] text-sm font-medium whitespace-nowrap",
        highlight
          ? "bg-core-purple/10 text-core-purple border border-core-purple/20"
          : "bg-light-300 text-serva-gray-400 border border-light-200"
      )}
    >
      {label}
    </div>
  );
}

function ComparisonDiagram({ className }: ComparisonDiagramProps) {
  return (
    <div className={cn("mt-10", className)}>
      {/* Section heading */}
      <h3 className="text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.1] text-center">
        Then use the same .serva files across every model
      </h3>
      <p className="text-sm text-serva-gray-400 text-center mt-3 leading-[1.4] tracking-[-0.42px] max-w-[480px] mx-auto">
        Skip repeated preprocessing. Encode once and feed the same files into
        any model or workflow.
      </p>

      {/* Comparison flows */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        {/* Without Servamind */}
        <div className="border border-light-200 rounded-[16px] p-6">
          <p className="text-xs font-medium text-serva-gray-300 uppercase tracking-[0.48px] mb-4">
            Without Servamind
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <FlowStep label="Dataset" />
            <FlowArrow />
            <FlowStep label="Preprocess" />
            <FlowArrow />
            <FlowStep label="Train" />
          </div>
          <p className="text-xs text-serva-gray-300 mt-4">
            Reprocess data for every model and experiment
          </p>
        </div>

        {/* With Servamind */}
        <div className="border border-light-200 rounded-[16px] p-6">
          <p className="text-xs font-medium text-serva-gray-300 uppercase tracking-[0.48px] mb-4">
            With Servamind
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <FlowStep label="Dataset" />
            <FlowArrow />
            <FlowStep label=".serva" highlight />
            <FlowArrow />
            <FlowStep label="Train" />
          </div>
          <p className="text-xs text-serva-gray-300 mt-4">
            Encode once, reuse everywhere
          </p>
        </div>
      </div>
    </div>
  );
}

export { ComparisonDiagram, type ComparisonDiagramProps };
