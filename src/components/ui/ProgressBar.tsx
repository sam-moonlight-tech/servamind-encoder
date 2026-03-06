import { cn } from "@/lib/utils";

type ProgressBarVariant = "default" | "holographic";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressBarVariant;
  className?: string;
  indeterminate?: boolean;
}

const holoGradient =
  "linear-gradient(90deg, var(--color-holo-green) 0%, var(--color-holo-seafoam) 20%, var(--color-holo-blue) 40%, var(--color-holo-pink) 60%, var(--color-holo-orange) 80%, var(--color-holo-yellow) 100%)";

function ProgressBar({
  value,
  max = 100,
  variant = "default",
  className,
  indeterminate = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isHolo = variant === "holographic";

  return (
    <div
      className={cn(
        "w-full overflow-hidden",
        isHolo ? "h-2 rounded-[12px] bg-light-200" : "h-3 rounded-full bg-serva-gray-100",
        className
      )}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn(
          "h-full transition-all duration-300 ease-out",
          isHolo ? "rounded-[12px]" : "rounded-full",
          !isHolo && "bg-serva-purple",
          indeterminate && "animate-shimmer w-full"
        )}
        style={{
          ...(indeterminate ? undefined : { width: `${percentage}%` }),
          ...(isHolo ? { backgroundImage: holoGradient } : undefined),
        }}
      />
    </div>
  );
}

export { ProgressBar, type ProgressBarProps };
