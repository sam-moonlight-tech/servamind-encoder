import { cn } from "@/lib/utils";
import type { Size } from "@/types/ui.types";

const sizeStyles: Record<Size, string> = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

interface IconProps {
  name: string;
  size?: Size;
  className?: string;
}

function Icon({ name, size = "md", className }: IconProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        sizeStyles[size],
        className
      )}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export { Icon, type IconProps };
