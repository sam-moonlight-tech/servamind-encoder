import { createPortal } from "react-dom";
import { useIsMobile } from "@/hooks/utility/useIsMobile";

interface OnboardingShellProps {
  children: React.ReactNode;
}

function OnboardingShell({ children }: OnboardingShellProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true">
        <div className="bg-white rounded-t-2xl shadow-[0px_-4px_24px_rgba(0,0,0,0.12)] w-full max-h-[90vh] overflow-y-auto px-6 pb-24 pt-8 animate-sheet-in">
          {children}
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-[16px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.06),0px_4px_24px_0px_rgba(0,0,0,0.12)] w-[419px] mx-4 px-6 py-8 animate-slide-up">
        {children}
      </div>
    </div>,
    document.body
  );
}

OnboardingShell.displayName = "OnboardingShell";

export { OnboardingShell, type OnboardingShellProps };
