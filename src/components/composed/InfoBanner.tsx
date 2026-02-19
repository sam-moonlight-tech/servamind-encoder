import { cn } from "@/lib/utils";

interface InfoBannerProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  className?: string;
}

function InfoBanner({ message, visible, onDismiss, className }: InfoBannerProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 bg-serva-gray-600 rounded-lg text-sm animate-fade-in",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0"
        >
          <circle cx="8" cy="8" r="6.5" stroke="#c8c3c8" strokeWidth="1.5" />
          <line x1="8" y1="7" x2="8" y2="11" stroke="#c8c3c8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="5.5" r="0.75" fill="#c8c3c8" />
        </svg>
        <span className="font-medium text-serva-gray-100">{message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="ml-4 shrink-0 text-serva-gray-100 hover:text-white transition-colors cursor-pointer"
        aria-label="Dismiss banner"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export { InfoBanner, type InfoBannerProps };
