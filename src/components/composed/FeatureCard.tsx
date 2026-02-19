import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 bg-light-300 border border-light-200 rounded-lg pt-5 pb-6 px-6 h-[160px]",
        className
      )}
    >
      <div className="size-6 text-serva-gray-600">{icon}</div>
      <div className="flex flex-col gap-3 text-[15px] leading-[1.2] tracking-tight">
        <p className="font-semibold text-serva-gray-600">{title}</p>
        <p className="text-serva-gray-400">{description}</p>
      </div>
    </div>
  );
}

export { FeatureCard, type FeatureCardProps };
