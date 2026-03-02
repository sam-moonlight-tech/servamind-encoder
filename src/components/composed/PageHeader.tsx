import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

function PageHeader({ title, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex items-center justify-between py-6 px-6", className)}>
      <h1 className="text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.1]">
        {title}
      </h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}

export { PageHeader, type PageHeaderProps };
