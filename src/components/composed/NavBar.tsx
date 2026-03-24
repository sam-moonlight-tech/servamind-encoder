import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/services/file";
import { ServamindLogo } from "@/components/composed/ServamindLogo";
import type { AuthUser } from "@/types/domain.types";
import type { UsageResponse } from "@/types/api.types";

interface NavBarProps {
  user: AuthUser | null;
  usage: UsageResponse | null;
  onSignOut: () => void;
  onNavigateDashboard?: () => void;
  onNavigateSettings?: () => void;
  onNavigateProfile?: () => void;
  className?: string;
}

function ProfilePopover({
  user,
  anchorRect,
  onSignOut,
  onNavigateProfile,
  onClose,
}: {
  user: AuthUser;
  anchorRect: DOMRect;
  onSignOut: () => void;
  onNavigateProfile?: () => void;
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
    window.addEventListener("scroll", onClose, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", onClose, true);
    };
  }, [onClose]);

  const top = anchorRect.bottom + 8;
  const right = window.innerWidth - anchorRect.right;

  return createPortal(
    <div
      ref={popoverRef}
      className="fixed z-50 w-[188px] bg-white rounded-lg shadow-[0px_0px_1px_0px_rgba(0,0,0,0.06),0px_4px_24px_0px_rgba(0,0,0,0.12)] animate-fade-in"
      style={{ top, right }}
    >
      {/* Profile header */}
      <div className="flex flex-col gap-1.5 px-5 py-5">
        <p className="text-sm font-semibold text-serva-gray-600">
          {user.email.split("@")[0]}
        </p>
        <p className="text-xs text-serva-gray-400">{user.email}</p>
      </div>

      <div className="h-px bg-light-200" />

      {/* Menu items */}
      <div className="flex flex-col gap-1 py-4 px-2">
        <button
          type="button"
          onClick={() => {
            onNavigateProfile?.();
            onClose();
          }}
          className="w-full text-left px-4 h-8 flex items-center text-sm font-medium text-serva-gray-600 hover:bg-light-200/50 transition-colors cursor-pointer rounded"
        >
          Your profile
        </button>
        <a
          href="https://www.servamind.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-left px-4 h-8 flex items-center text-sm font-medium text-serva-gray-600 hover:bg-light-200/50 transition-colors cursor-pointer rounded no-underline"
        >
          Visit our website
        </a>
        <a
          href="https://www.servamind.com/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-left px-4 h-8 flex items-center text-sm font-medium text-serva-gray-600 hover:bg-light-200/50 transition-colors cursor-pointer rounded no-underline"
        >
          Talk to our team
        </a>
        <button
          type="button"
          onClick={() => {
            onSignOut();
            onClose();
          }}
          className="w-full text-left px-4 h-8 flex items-center text-sm font-medium text-serva-gray-400 hover:bg-light-200/50 transition-colors cursor-pointer rounded"
        >
          Sign out
        </button>
      </div>
    </div>,
    document.body
  );
}

function NavBar({ user, usage, onSignOut, onNavigateDashboard, onNavigateSettings, onNavigateProfile, className }: NavBarProps) {
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

  const usedDisplay = usage
    ? formatFileSize(usage.usage_this_month_bytes)
    : "0";
  const totalDisplay = usage?.quota_limit_bytes
    ? formatFileSize(usage.quota_limit_bytes)
    : "—";

  const initial = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <nav
      className={cn(
        "flex items-center justify-between px-6 h-[54px] bg-light-300 shrink-0",
        className
      )}
    >
      <button type="button" onClick={onNavigateDashboard} className="bg-transparent border-none p-0 cursor-pointer">
        <ServamindLogo />
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-6 text-sm leading-none">
          <button
            type="button"
            onClick={onNavigateDashboard}
            className="font-medium text-serva-gray-600 cursor-pointer bg-transparent border-none p-0"
          >
            Dashboard
          </button>
          <span className="text-serva-gray-400 cursor-pointer">
            Get Started
          </span>
        </div>

        <button
          className="flex items-center justify-center size-8 mx-1 cursor-pointer"
          aria-label="Settings"
          onClick={onNavigateSettings}
        >
          <svg
            width="20"
            height="20"
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
          <div className="flex items-center gap-1 bg-light-200 rounded-[4px] px-2 h-[30px] text-sm">
            <span className="text-serva-gray-400">Used</span>
            <span className="font-medium text-serva-gray-600">{usedDisplay}</span>
            <span className="text-serva-gray-400">/</span>
            <span className="text-serva-gray-400">{totalDisplay}</span>
          </div>
          <button
            ref={avatarRef}
            onClick={handleToggle}
            className="flex items-center justify-center size-8 rounded-full bg-serva-gray-100 cursor-pointer"
            aria-label="User menu"
          >
            <span className="text-sm font-medium text-serva-gray-600">
              {initial}
            </span>
          </button>
        </div>
      </div>

      {anchorRect && user && (
        <ProfilePopover
          user={user}
          anchorRect={anchorRect}
          onSignOut={onSignOut}
          onNavigateProfile={onNavigateProfile}
          onClose={handleClose}
        />
      )}
    </nav>
  );
}

export { NavBar, type NavBarProps };
