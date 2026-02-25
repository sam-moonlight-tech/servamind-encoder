import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/services/file";
import { ServamindLogo } from "@/components/composed/ServamindLogo";
import type { AuthUser } from "@/types/domain.types";
import type { QuotaResponse } from "@/types/api.types";

interface NavBarProps {
  user: AuthUser | null;
  quota: QuotaResponse | null;
  onSignOut: () => void;
  onNavigateDashboard?: () => void;
  onNavigateSettings?: () => void;
  className?: string;
}

function ExternalLinkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-serva-gray-400"
    >
      <path d="M12 8.667v4A1.333 1.333 0 0110.667 14H3.333A1.333 1.333 0 012 12.667V5.333A1.333 1.333 0 013.333 4h4" />
      <path d="M10 2h4v4" />
      <path d="M6.667 9.333L14 2" />
    </svg>
  );
}

function ProfilePopover({
  user,
  quota,
  anchorRect,
  onSignOut,
  onClose,
}: {
  user: AuthUser;
  quota: QuotaResponse | null;
  anchorRect: DOMRect;
  onSignOut: () => void;
  onClose: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const initial = user.email?.[0]?.toUpperCase() ?? "U";
  const usedBytes = quota?.total_bytes_this_month ?? 0;
  const totalBytes = quota?.quota_bytes ?? 0;
  const percentUsed = quota?.percentage_used ?? 0;

  const planType = quota?.plan_type ?? "";
  const planLabel = planType.toLowerCase().includes("beta")
    ? "Free Beta"
    : planType
      ? planType.charAt(0).toUpperCase() + planType.slice(1)
      : "Free";

  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const resetFormatted = resetDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const top = anchorRect.bottom + 8;
  const right = window.innerWidth - anchorRect.right;

  return createPortal(
    <div
      ref={popoverRef}
      className="fixed z-50 w-[340px] bg-white rounded-2xl shadow-xl border border-[#E5E5E5] animate-fade-in"
      style={{ top, right }}
    >
      {/* Profile header */}
      <div className="flex flex-col items-center pt-10 pb-7 px-8">
        <div className="flex items-center justify-center size-[72px] rounded-2xl bg-[#EBEBEB] mb-5">
          <span className="text-[28px] font-semibold text-serva-gray-600">
            {initial}
          </span>
        </div>
        <p className="text-lg font-bold text-serva-gray-600">
          {user.email.split("@")[0]}
        </p>
        <p className="text-sm text-serva-gray-400 mt-0.5">{user.email}</p>
      </div>

      {/* Quota section */}
      <div className="border-t border-[#E5E5E5] px-8 py-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-serva-gray-600">
              {planLabel}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-serva-gray-300"
            >
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 7.2V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="8" cy="5.2" r="0.7" fill="currentColor" />
            </svg>
          </div>
          <span className="text-[15px] text-serva-gray-400">
            Used{" "}
            <span className="font-bold text-serva-gray-600">
              {formatFileSize(usedBytes)}
            </span>
            {" / "}
            {formatFileSize(totalBytes)}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-serva-purple rounded-full transition-all"
            style={{ width: `${Math.max(Math.min(percentUsed, 100), 2)}%` }}
          />
        </div>
        <p className="text-[13px] text-serva-gray-300">
          Your free TB resets on {resetFormatted}.
        </p>
      </div>

      {/* Links */}
      <div className="border-t border-[#E5E5E5]">
        <a
          href="#"
          className="flex items-center justify-between px-8 py-5 text-[15px] font-medium text-serva-gray-600 hover:bg-[#FAFAFA] transition-colors"
        >
          Pricing
          <ExternalLinkIcon />
        </a>
      </div>

      <div className="border-t border-[#E5E5E5]">
        <button
          type="button"
          onClick={() => {
            onSignOut();
            onClose();
          }}
          className="w-full text-left px-8 py-5 text-[15px] font-medium text-serva-gray-600 hover:bg-[#FAFAFA] transition-colors cursor-pointer rounded-b-2xl"
        >
          Sign out
        </button>
      </div>
    </div>,
    document.body
  );
}

function NavBar({ user, quota, onSignOut, onNavigateDashboard, onNavigateSettings, className }: NavBarProps) {
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(() => {
    setAnchorRect((prev) => {
      if (prev) return null;
      return avatarRef.current?.getBoundingClientRect() ?? null;
    });
  }, []);

  const handleClose = useCallback(() => {
    setAnchorRect(null);
  }, []);

  const usedDisplay = quota
    ? formatFileSize(quota.total_bytes_this_month)
    : "0";
  const totalDisplay = quota
    ? formatFileSize(quota.quota_bytes)
    : "—";

  return (
    <nav
      className={cn(
        "flex items-center justify-between px-6 py-3 bg-light-300",
        className
      )}
    >
      <ServamindLogo />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-6 text-sm leading-none">
          <button
            type="button"
            onClick={onNavigateDashboard}
            className="font-medium text-serva-gray-600 cursor-pointer bg-transparent border-none p-0"
          >
            Dashboard
          </button>
          <span className="font-medium text-serva-gray-600 cursor-pointer">
            Get Started
          </span>
          <a
            href="https://www.servamind.com/data"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-medium text-serva-gray-600"
          >
            Why .serva
            <ExternalLinkIcon />
          </a>
        </div>

        <button
          className="flex items-center justify-center size-8 cursor-pointer"
          aria-label="Settings"
          onClick={onNavigateSettings}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-serva-gray-400"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-light-200 rounded px-2 h-[30px] text-sm">
            <span className="font-medium text-serva-gray-400">Used</span>
            <span className="font-medium text-serva-gray-600">{usedDisplay}</span>
            <span className="text-serva-gray-400">/</span>
            <span className="text-serva-gray-400">{totalDisplay}</span>
          </div>
          <button
            ref={avatarRef}
            onClick={handleToggle}
            className="flex items-center justify-center size-8 rounded-full bg-serva-purple/40 cursor-pointer"
            aria-label="User menu"
          >
            <span className="text-sm font-medium text-serva-gray-600">
              {user?.email?.[0]?.toUpperCase() ?? "U"}
            </span>
          </button>
        </div>
      </div>

      {anchorRect && user && (
        <ProfilePopover
          user={user}
          quota={quota}
          anchorRect={anchorRect}
          onSignOut={onSignOut}
          onClose={handleClose}
        />
      )}
    </nav>
  );
}

export { NavBar, type NavBarProps };
