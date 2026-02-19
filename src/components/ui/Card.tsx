import { cn } from "@/lib/utils";
import type { CardVariant } from "@/types/ui.types";

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white border border-serva-gray-300 shadow-sm",
  elevated: "bg-white shadow-md",
  holographic:
    "bg-white border border-serva-gray-300 shadow-holo relative overflow-hidden",
};

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
}

function Card({ variant = "default", className, children }: CardProps) {
  return (
    <div className={cn("rounded-lg p-6", variantStyles[variant], className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>{children}</div>
  );
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

function CardContent({ className, children }: CardContentProps) {
  return <div className={cn(className)}>{children}</div>;
}

export { Card, CardHeader, CardContent, type CardProps };
