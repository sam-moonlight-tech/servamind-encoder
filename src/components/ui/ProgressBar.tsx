import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  indeterminate?: boolean;
}

function ProgressBar({
  value,
  max = 100,
  className,
  indeterminate = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={cn(
        "h-3 w-full overflow-hidden rounded-full bg-serva-gray-100",
        className
      )}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn(
          "h-full rounded-full bg-serva-purple transition-all duration-300 ease-out",
          indeterminate && "animate-shimmer w-full"
        )}
        style={indeterminate ? undefined : { width: `${percentage}%` }}
      />
    </div>
  );
}

export { ProgressBar, type ProgressBarProps };
