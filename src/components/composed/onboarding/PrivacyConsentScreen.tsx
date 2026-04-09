import { useState } from "react";
import { EXTERNAL_LINKS } from "@/config/constants";

interface PrivacyConsentScreenProps {
  onContinue: () => void;
}

function PrivacyConsentScreen({ onContinue }: PrivacyConsentScreenProps) {
  const [agreed, setAgreed] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleContinue = () => {
    if (!agreed) {
      setShowError(true);
      return;
    }
    onContinue();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-[20px] font-semibold text-serva-gray-600 leading-[1.1] tracking-[-0.6px]">
          Your privacy, your choice
        </h1>
        <p className="text-sm text-serva-gray-400 leading-normal">
          To help improve Servamind, we collect usage data using cookies and
          analytics tools. You can change this any time in Settings.
        </p>
      </div>

      <div className="bg-light-300 rounded-[8px] px-4 py-6 flex gap-3 items-start">
        <div className="relative shrink-0 mt-1">
          <label
            className={`w-5 h-5 rounded-[4px] border p-0.5 flex items-center justify-center transition-colors cursor-pointer ${
              agreed
                ? "bg-core-purple border-core-purple"
                : showError
                ? "bg-white border-red-500"
                : "bg-white border-serva-gray-200"
            }`}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) setShowError(false);
              }}
              className="sr-only"
            />
            {agreed && (
              <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                <path
                  d="M1 4L4 7L10 1"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </label>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <span className="text-sm text-serva-gray-600 leading-[1.4]">
            I agree to Servamind&apos;s{" "}
            <a
              href={EXTERNAL_LINKS.TERMS}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-core-purple"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href={EXTERNAL_LINKS.PRIVACY}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-core-purple"
            >
              Privacy Policy
            </a>
            .
          </span>
          {showError && (
            <p className="text-sm text-red-500 leading-normal">
              Agree to the terms to continue
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          className="h-9 px-3 rounded-[8px] bg-core-purple text-[#eaeaea] font-semibold text-sm hover:bg-core-purple/90 active:bg-core-purple/80 transition-colors cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

PrivacyConsentScreen.displayName = "PrivacyConsentScreen";

export { PrivacyConsentScreen, type PrivacyConsentScreenProps };
