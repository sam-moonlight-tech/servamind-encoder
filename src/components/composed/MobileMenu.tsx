import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/services/file";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import type { AuthUser } from "@/types/domain.types";
import type { UsageResponse } from "@/types/api.types";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  user: AuthUser | null;
  usage: UsageResponse | null;
  activeKey?: string;
  onNavigateEncode?: () => void;
  onNavigateDecode?: () => void;
  onNavigateSettings?: () => void;
  onNavigateProfile?: () => void;
  onSignOut: () => void;
}

function MobileMenu({
  open,
  onClose,
  user,
  usage,
  activeKey,
  onNavigateEncode,
  onNavigateDecode,
  onNavigateSettings,
  onNavigateProfile,
  onSignOut,
}: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      setClosing(false);
      lockScroll();
    } else if (mounted) {
      setClosing(true);
      const timer = setTimeout(() => {
        setMounted(false);
        setClosing(false);
        unlockScroll();
        previousFocusRef.current?.focus();
      }, 200);
      return () => {
        clearTimeout(timer);
        unlockScroll();
      };
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus menu when mounted
  useEffect(() => {
    if (mounted && !closing && menuRef.current) {
      menuRef.current.focus();
    }
  }, [mounted, closing]);

  // Escape key handler
  useEffect(() => {
    if (!mounted) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }

      // Focus trap
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
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

  const handleNav = useCallback((cb?: () => void) => {
    cb?.();
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  const displayName = user?.email?.split("@")[0] ?? "";
  const displayEmail = user?.email ?? "";
  const usedDisplay = usage ? formatFileSize(usage.usage_this_month_bytes) : "0";
  const totalDisplay = usage?.quota_limit_bytes ? formatFileSize(usage.quota_limit_bytes) : "—";

  return createPortal(
    <div
      className={cn("fixed inset-0 z-[60]", closing ? "animate-backdrop-out" : "animate-fade-in")}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="absolute inset-0 bg-white/95 backdrop-blur-md" />
      <div
        ref={menuRef}
        tabIndex={-1}
        className="relative h-full flex flex-col px-6 pt-[calc(1rem+env(safe-area-inset-top))] pb-8 overflow-y-auto outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-[calc(0.5rem+env(safe-area-inset-top))] right-4 p-2 cursor-pointer"
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-serva-gray-600">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* User info */}
        {user && (
          <div className="flex flex-col gap-1 mb-8 mt-8">
            <p className="text-base font-semibold text-serva-gray-600">{displayName}</p>
            <p className="text-sm text-serva-gray-400">{displayEmail}</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-serva-gray-400">Used</span>
              <span className="font-medium text-serva-gray-600">{usedDisplay}</span>
              <span className="text-serva-gray-400">/</span>
              <span className="text-serva-gray-400">{totalDisplay}</span>
            </div>
          </div>
        )}

        <div className="h-px bg-light-200 mb-6" />

        {/* DATA section */}
        <p className="font-mono text-xs tracking-[0.48px] text-serva-gray-300 mb-3">DATA</p>
        <div className="flex flex-col gap-1 mb-8">
          <button
            type="button"
            onClick={() => handleNav(onNavigateEncode)}
            className={cn(
              "flex items-center gap-3 h-11 px-3 rounded-lg text-base hover:bg-light-200/50 transition-colors cursor-pointer w-full text-left",
              activeKey === "encode" ? "font-medium text-serva-gray-600 bg-light-200" : "text-serva-gray-400"
            )}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => handleNav(onNavigateDecode)}
            className={cn(
              "flex items-center gap-3 h-11 px-3 rounded-lg text-base hover:bg-light-200/50 transition-colors cursor-pointer w-full text-left",
              activeKey === "decode" ? "font-medium text-serva-gray-600 bg-light-200" : "text-serva-gray-400"
            )}
          >
            Decode
          </button>
        </div>

        {/* SETTINGS section */}
        <p className="font-mono text-xs tracking-[0.48px] text-serva-gray-300 mb-3">SETTINGS</p>
        <div className="flex flex-col gap-1 mb-8">
          <button
            type="button"
            onClick={() => handleNav(onNavigateProfile)}
            className={cn(
              "flex items-center gap-3 h-11 px-3 rounded-lg text-base hover:bg-light-200/50 transition-colors cursor-pointer w-full text-left",
              activeKey === "profile" ? "font-medium text-serva-gray-600 bg-light-200" : "text-serva-gray-400"
            )}
          >
            Your profile
          </button>
          <button
            type="button"
            onClick={() => handleNav(onNavigateSettings)}
            className={cn(
              "flex items-center gap-3 h-11 px-3 rounded-lg text-base hover:bg-light-200/50 transition-colors cursor-pointer w-full text-left",
              activeKey === "billing" ? "font-medium text-serva-gray-600 bg-light-200" : "text-serva-gray-400"
            )}
          >
            Billing
          </button>
        </div>

        <div className="h-px bg-light-200 mb-6" />

        {/* External links */}
        <div className="flex flex-col gap-1 mb-8">
          <a
            href="https://servamind.mintlify.app/guides/basics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 h-11 px-3 rounded-lg text-base text-serva-gray-600 hover:bg-light-200/50 transition-colors cursor-pointer no-underline"
          >
            Get Started
          </a>
          <a
            href="https://www.servamind.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 h-11 px-3 rounded-lg text-base text-serva-gray-600 hover:bg-light-200/50 transition-colors cursor-pointer no-underline"
          >
            Website
          </a>
          <a
            href="https://www.servamind.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 h-11 px-3 rounded-lg text-base text-serva-gray-600 hover:bg-light-200/50 transition-colors cursor-pointer no-underline"
          >
            Contact team
          </a>
        </div>

        {/* Sign out at bottom */}
        <div className="mt-auto">
          <button
            type="button"
            onClick={() => handleNav(onSignOut)}
            className="flex items-center gap-3 h-11 px-3 rounded-lg text-base text-serva-gray-400 hover:bg-light-200/50 transition-colors cursor-pointer w-full text-left"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export { MobileMenu, type MobileMenuProps };
