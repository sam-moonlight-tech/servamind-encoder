import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

function AppShell({ children, className }: AppShellProps) {
  return (
    <div className={cn("h-screen flex flex-col bg-light-300 overflow-hidden relative", className)}>
      {children}
    </div>
  );
}

export { AppShell };
