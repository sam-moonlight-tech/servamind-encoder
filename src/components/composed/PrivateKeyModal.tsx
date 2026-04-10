import { useState, useCallback, useEffect, useRef } from "react";
import { Dialog } from "@/components/ui";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { generatePrivateKey } from "@/services/file";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/utility/useIsMobile";

interface PrivateKeyModalProps {
  open: boolean;
  mode?: "encrypt" | "decrypt";
  onClose: () => void;
  onConfirm: (key: string) => void;
}

type Step = "input" | "confirm1" | "confirm2";

const MIN_LENGTH = 3;
const MAX_LENGTH = 64;

function PrivateKeyModal({ open, mode = "encrypt", onClose, onConfirm }: PrivateKeyModalProps) {
  const [key, setKey] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  const isDecrypting = mode === "decrypt";
  const isValid = key.length >= MIN_LENGTH && key.length <= MAX_LENGTH;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setKey("");
      setStep("input");
      setCopied(false);
    }
  }, [open]);

  const handleGenerate = useCallback(async () => {
    const generated = await generatePrivateKey();
    setKey(generated);
    setCopied(false);
  }, []);

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(key);
    } catch {
      // Fallback for iOS Safari where clipboard API can reject on repeat calls
      const textarea = document.createElement("textarea");
      textarea.value = key;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 3000);
  }, [key]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handlePrimaryClick = useCallback(() => {
    if (!isValid) return;

    if (step === "input") {
      if (isDecrypting) {
        // Decrypt mode: skip confirmation steps
        onConfirm(key);
      } else {
        setStep("confirm1");
      }
    } else if (step === "confirm1") {
      setStep("confirm2");
    } else if (step === "confirm2") {
      onConfirm(key);
    }
  }, [step, isValid, isDecrypting, key, onConfirm]);

  const handleGoBack = useCallback(() => {
    if (step === "confirm2") {
      setStep("confirm1");
    } else if (step === "confirm1") {
      setStep("input");
      setCopied(false);
    }
  }, [step]);

  // Derive heading, description, and button labels per step
  let heading: string;
  let description: string;
  let primaryLabel: string;
  let secondaryLabel: string;
  let onSecondary: () => void;

  if (step === "confirm2") {
    heading = "Are you sure you saved it?";
    description = "Without this private key you can't decode your .serva files. Ever. Just double checking!";
    primaryLabel = "It's definitely saved";
    secondaryLabel = "Go back";
    onSecondary = handleGoBack;
  } else if (step === "confirm1") {
    heading = "Have you saved your private key?";
    description = "You'll need this to decode your .serva files in the future. Make sure you've saved it somewhere safe.";
    primaryLabel = "Yes, I've saved it";
    secondaryLabel = "Go back";
    onSecondary = handleGoBack;
  } else {
    heading = isDecrypting ? "Enter your private key" : "Choose a private key";
    description = isDecrypting
      ? "Enter the private key you used to encrypt these .serva files to decrypt them."
      : "This key will securely encrypt your serva files. Keep it safe, you'll need it to decrypt them later!";
    primaryLabel = isDecrypting ? "Confirm key" : "Set private key";
    secondaryLabel = "Cancel";
    onSecondary = handleClose;
  }

  const isReadOnly = step === "confirm1" || step === "confirm2";

  const content = (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-3">
        <h2 className="text-sm font-semibold text-serva-gray-600">
          {heading}
        </h2>
        <p className="text-xs text-serva-gray-400 leading-normal">
          {description}
        </p>
      </div>

      {/* Input field with inline button */}
      <div
        className={cn(
          "flex items-center justify-between h-[44px] rounded-[8px] pl-4 pr-1",
          isReadOnly
            ? "bg-light-300 border border-light-200"
            : "border-[1.25px] border-light-200 focus-within:border-serva-gray-200"
        )}
      >
        <input
          type="text"
          value={key}
          onChange={(e) => {
            if (!isReadOnly) {
              setKey(e.target.value.slice(0, MAX_LENGTH));
              setCopied(false);
            }
          }}
          readOnly={isReadOnly}
          placeholder="Enter a private key"
          className={cn(
            "flex-1 min-w-0 bg-transparent text-base md:text-sm outline-none truncate",
            key ? "text-serva-gray-600" : "text-serva-gray-200",
            isReadOnly && "text-serva-gray-600"
          )}
        />
        {step === "input" && !isDecrypting && (
          <button
            type="button"
            onClick={isValid ? handleCopy : handleGenerate}
            className={cn(
              "shrink-0 h-9 px-3 rounded-[4px] text-sm font-semibold text-serva-gray-600 transition-colors cursor-pointer",
              copied
                ? "bg-serva-gray-100"
                : "bg-light-300 hover:bg-light-200"
            )}
          >
            {copied ? "Copied, keep it safe!" : isValid ? "Copy" : "Generate"}
          </button>
        )}
        {isReadOnly && (
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 h-9 px-3 rounded-[4px] text-sm font-semibold text-serva-gray-600 bg-white border border-light-200 hover:bg-light-300 transition-colors cursor-pointer"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onSecondary}
          className="h-9 px-3 rounded-[8px] bg-light-300 text-sm font-semibold text-serva-gray-600 hover:bg-light-200 transition-colors cursor-pointer"
        >
          {secondaryLabel}
        </button>
        <button
          type="button"
          onClick={handlePrimaryClick}
          disabled={step === "input" && !isValid}
          className={cn(
            "h-9 px-3 rounded-[8px] text-sm font-semibold text-light-200 transition-colors cursor-pointer",
            step === "input" && !isValid
              ? "bg-serva-gray-200 cursor-not-allowed"
              : "bg-core-purple hover:bg-core-purple/90"
          )}
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet open={open} onClose={handleClose} className="p-6">
        {content}
      </BottomSheet>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} className="w-[29vw] min-w-[419px] p-[1.67vw] rounded-[16px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.06),0px_4px_24px_0px_rgba(0,0,0,0.12)]">
      {content}
    </Dialog>
  );
}

PrivateKeyModal.displayName = "PrivateKeyModal";

export { PrivateKeyModal, type PrivateKeyModalProps };
