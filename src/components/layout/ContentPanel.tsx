import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ContentPanelProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

const ContentPanel = forwardRef<HTMLDivElement, ContentPanelProps>(
  ({ children, header, className, contentClassName, onScroll }, ref) => {
    return (
      <main
        className={cn(
          "flex-1 flex flex-col bg-white border border-light-200 rounded-t-[8px] min-h-0 min-w-0 mb-2.5 pb-6 md:pb-0 overflow-x-hidden",
          className
        )}
      >
        {header}
        <div
          ref={ref}
          onScroll={onScroll}
          className={cn(
            "flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-none",
            contentClassName
          )}
        >
          {children}
        </div>
      </main>
    );
  }
);

export { ContentPanel };
