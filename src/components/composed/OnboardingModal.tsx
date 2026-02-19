import { useState, useCallback, type FormEvent } from "react";
import { createPortal } from "react-dom";

interface OnboardingModalProps {
  open: boolean;
  onEmailSubmit: (email: string) => void;
  onGoogleSignIn: () => void;
  onAppleSignIn: () => void;
}

function ServamindLogo() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-serva-purple"
    >
      <rect
        x="15"
        y="5"
        width="70"
        height="90"
        rx="4"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="50" cy="26" r="9" stroke="currentColor" strokeWidth="3" />
      <line
        x1="50"
        y1="35"
        x2="50"
        y2="65"
        stroke="currentColor"
        strokeWidth="3"
      />
      <line
        x1="50"
        y1="42"
        x2="25"
        y2="34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="42"
        x2="75"
        y2="34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="65"
        x2="30"
        y2="85"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="65"
        x2="70"
        y2="85"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-light-200" />
      <span className="text-sm font-medium text-serva-gray-300 tracking-wide">
        OR
      </span>
      <div className="flex-1 h-px bg-light-200" />
    </div>
  );
}

function OnboardingModal({
  open,
  onEmailSubmit,
  onGoogleSignIn,
  onAppleSignIn,
}: OnboardingModalProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (email.trim()) {
        onEmailSubmit(email.trim());
      }
    },
    [email, onEmailSubmit]
  );

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4 px-10 py-12 animate-slide-up">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-6">
            <ServamindLogo />
            <span className="text-xl font-bold tracking-tight text-serva-gray-600 uppercase font-display">
              servamind
            </span>
            <span className="ml-1 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-light-200 text-serva-gray-300 rounded">
              Beta
            </span>
          </div>

          <h1 className="text-3xl font-bold text-serva-gray-600 leading-tight mb-8">
            Turn your raw files into
            <br />
            reusable AI&#8209;ready data.
          </h1>

          <form onSubmit={handleSubmit} className="w-full mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Personal or work email"
              className="w-full rounded-xl border border-light-200 px-5 py-4 text-base text-serva-gray-600 placeholder:text-serva-gray-100 focus:border-2 focus:border-serva-purple focus:outline-none transition-colors"
            />
          </form>

          <div className="w-full mb-6">
            <Divider />
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="flex items-center justify-center gap-3 w-full rounded-[7px] bg-[#1C011E] text-white font-medium py-4 text-base hover:bg-[#1C011E]/90 active:bg-[#1C011E]/80 transition-colors cursor-pointer"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={onAppleSignIn}
              className="flex items-center justify-center gap-3 w-full rounded-[7px] bg-[#1C011E] text-white font-medium py-4 text-base hover:bg-[#1C011E]/90 active:bg-[#1C011E]/80 transition-colors cursor-pointer"
            >
              <AppleIcon />
              Continue with Apple
            </button>
          </div>

          <p className="mt-8 text-xs text-serva-gray-300 leading-relaxed">
            By continuing, you agree to Servamind&apos;s{" "}
            <a href="#" className="underline text-serva-gray-600">
              Consumer Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline text-serva-gray-600">
              Usage Policy
            </a>
            , and acknowledge their{" "}
            <a href="#" className="underline text-serva-gray-600">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

OnboardingModal.displayName = "OnboardingModal";

export { OnboardingModal, type OnboardingModalProps };
