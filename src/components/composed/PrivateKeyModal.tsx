import { useState, useCallback } from "react";
import { Dialog, Button } from "@/components/ui";
import { generatePrivateKey } from "@/services/file";
import { cn } from "@/lib/utils";

interface PrivateKeyModalProps {
  open: boolean;
  mode?: "encrypt" | "decrypt";
  onClose: () => void;
  onConfirm: (key: string) => void;
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-serva-purple"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

const MIN_LENGTH = 3;
const MAX_LENGTH = 64;

function PrivateKeyModal({ open, mode = "encrypt", onClose, onConfirm }: PrivateKeyModalProps) {
  const [key, setKey] = useState("");
  const isDecrypting = mode === "decrypt";

  const isValid = key.length >= MIN_LENGTH && key.length <= MAX_LENGTH;

  const handleGenerate = useCallback(() => {
    setKey(generatePrivateKey());
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(key);
  }, [key]);

  const handleConfirm = useCallback(() => {
    if (isValid) {
      onConfirm(key);
      setKey("");
    }
  }, [isValid, key, onConfirm]);

  const handleClose = useCallback(() => {
    setKey("");
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-2.5">
            <LockIcon />
          </div>
          <div>
            <h2 className="text-md font-bold text-serva-gray-900">
              {isDecrypting ? "Enter Your Private Key" : "Choose a Private Key"}
            </h2>
            <p className="mt-1 text-sm text-[#614F62] leading-snug tracking-tight">
              {isDecrypting
                ? "Enter the private key you used to encrypt these .serva files to decrypt them."
                : "This key will encrypt your .serva files. Keep it safe\u2014you\u2019ll need it to decrypt them later."}
            </p>
          </div>
        </div>

        <div className="w-full">
          <label className="block text-xs font-semibold text-serva-gray-900 mb-2">
            Private Key ({MIN_LENGTH}–{MAX_LENGTH} characters)
          </label>
          <div className="relative">
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value.slice(0, MAX_LENGTH))}
              placeholder="Enter your private key..."
              className={cn(
                "w-full rounded-[7px] border border-[#EAEAEA] px-4 py-3 text-sm text-serva-gray-900 placeholder:text-serva-gray-400 focus:border-2 focus:border-serva-purple focus:outline-none",
                !isDecrypting && "pr-24"
              )}
            />
            {!isDecrypting && (
              <button
                type="button"
                onClick={isValid ? handleCopy : handleGenerate}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[7px] bg-[#F5F5F5] px-3 py-1.5 text-sm font-medium text-serva-gray-900 hover:bg-[#EAEAEA] transition-colors cursor-pointer"
              >
                {isValid ? "Copy" : "Generate"}
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="px-6"
            disabled={!isValid}
            onClick={handleConfirm}
          >
            {isDecrypting ? "Confirm Key" : "Set Private Key"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

PrivateKeyModal.displayName = "PrivateKeyModal";

export { PrivateKeyModal, type PrivateKeyModalProps };
