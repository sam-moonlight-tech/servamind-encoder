import { createPortal } from "react-dom";

interface OnboardingShellProps {
  children: React.ReactNode;
}

function OnboardingShell({ children }: OnboardingShellProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-[16px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.06),0px_4px_24px_0px_rgba(0,0,0,0.12)] w-[419px] mx-4 px-6 py-8 animate-slide-up">
        {children}
      </div>
    </div>,
    document.body
  );
}

OnboardingShell.displayName = "OnboardingShell";

export { OnboardingShell, type OnboardingShellProps };
