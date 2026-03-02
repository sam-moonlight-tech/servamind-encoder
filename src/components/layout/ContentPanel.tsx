import { cn } from "@/lib/utils";

interface ContentPanelProps {
  children: React.ReactNode;
  className?: string;
}

function ContentPanel({ children, className }: ContentPanelProps) {
  return (
    <main
      className={cn(
        "flex-1 bg-white border border-light-200 rounded-[8px] min-h-0",
        className
      )}
    >
      {children}
    </main>
  );
}

export { ContentPanel };
