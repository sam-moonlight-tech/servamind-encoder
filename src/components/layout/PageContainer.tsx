import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn("flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </main>
  );
}

export { PageContainer };
