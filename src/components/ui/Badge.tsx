import { cn } from "@/lib/utils";
import type { BadgeVariant } from "@/types/ui.types";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#F5F5F5] text-serva-gray-600",
  serva: "bg-serva-purple/10 text-serva-purple font-mono",
  success: "bg-serva-green/10 text-serva-green",
  credits: "bg-holo-blue/10 text-holo-blue",
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[5px] px-2.5 py-1 text-xs font-normal",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps };
