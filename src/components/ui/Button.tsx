import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { ButtonVariant, Size } from "@/types/ui.types";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1C011E] text-white hover:bg-[#1C011E]/90 active:bg-[#1C011E]/80",
  secondary:
    "bg-white text-serva-gray-600 border border-[#EAEAEA] hover:bg-light-100 active:bg-light-200",
  ghost:
    "bg-transparent text-serva-gray-600 hover:bg-light-200 active:bg-light-300",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2.5 text-sm rounded-[7px]",
  md: "px-5 py-3 text-base rounded-[7px]",
  lg: "px-7 py-4 text-lg rounded-[7px]",
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
          "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-serva-purple disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
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
