import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { ButtonVariant, Size } from "@/types/ui.types";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-core-purple text-light-200 hover:bg-core-purple/90 active:bg-core-purple/80",
  secondary:
    "bg-white text-serva-gray-600 border border-light-200 hover:bg-light-100 active:bg-light-200",
  ghost:
    "bg-transparent text-serva-gray-600 hover:bg-light-200 active:bg-light-300",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm h-[32px] rounded-[8px]",
  md: "px-5 py-2.5 text-sm h-[36px] rounded-[8px]",
  lg: "px-7 py-3.5 text-base h-[44px] rounded-[8px]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-serva-purple disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps };
