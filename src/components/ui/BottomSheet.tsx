import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

function BottomSheet({ open, onClose, children, className }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      setClosing(true);
      const timer = setTimeout(() => {
        setMounted(false);
        setClosing(false);
        previousFocusRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus the sheet when mounted
  useEffect(() => {
    if (mounted && !closing && sheetRef.current) {
      sheetRef.current.focus();
    }
  }, [mounted, closing]);

  useEffect(() => {
    if (!mounted) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }

      // Focus trap
      if (e.key === "Tab" && sheetRef.current) {
        const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mounted, onClose]);

  useEffect(() => {
    if (mounted) lockScroll();
    return () => { if (mounted) unlockScroll(); };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-[10px]",
        closing ? "animate-backdrop-out" : "animate-backdrop-in"
      )}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={sheetRef}
        tabIndex={-1}
        className={cn(
          "w-full max-h-[90vh] overflow-y-auto bg-white rounded-t-2xl shadow-[0px_-4px_24px_rgba(0,0,0,0.12)] pb-[env(safe-area-inset-bottom)] outline-none",
          closing ? "animate-sheet-out" : "animate-sheet-in",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

BottomSheet.displayName = "BottomSheet";

export { BottomSheet, type BottomSheetProps };
