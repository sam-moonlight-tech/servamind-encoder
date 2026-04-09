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
  onNavigateBilling?: () => void;
  onMenuOpen?: () => void;
  isSettingsPage?: boolean;
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
      className="fixed z-50 w-[240px] bg-white rounded-lg shadow-[0px_0px_1px_0px_rgba(0,0,0,0.06),0px_4px_24px_0px_rgba(0,0,0,0.12)] animate-fade-in overflow-hidden"
      style={{ top, right }}
    >
      {/* Profile header */}
      <div className="flex flex-col gap-1.5 px-5 py-5">
        <p className="text-sm font-semibold text-serva-gray-600 truncate">
          {user.name || user.email.split("@")[0]}
        </p>
        <p className="text-xs text-serva-gray-400 truncate">{user.email}</p>
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

function ServamindIconMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.0854 18.4001C23.2831 16.5019 23.9242 14.3008 23.9242 12C23.9242 9.69921 23.2831 7.49688 22.0854 5.59992V3.43623H20.3398C18.0897 1.21894 15.1191 0 11.9621 0C8.80507 0 5.83443 1.21894 3.5844 3.43498H1.83879V5.59867C0.641092 7.49688 0 9.69921 0 12C0 14.3008 0.641092 16.5031 1.83879 18.4001V23.7457H9.49959C10.301 23.9128 11.1247 24 11.9621 24C12.7995 24 13.6232 23.914 14.4246 23.7457H22.0854V18.4001ZM23.4023 12C23.4023 13.8982 22.9451 15.7254 22.0854 17.3569V6.64188C22.9464 8.27337 23.4023 10.1005 23.4023 11.9988V12ZM10.5656 3.95845C10.1121 4.35231 9.82511 4.93187 9.82511 5.57998C9.82511 6.41504 10.3047 7.14042 11.0017 7.49439H10.1258L3.60055 4.16909C3.6664 4.09805 3.73349 4.02825 3.80058 3.9597H10.5656V3.95845ZM20.1236 3.95845C20.1919 4.02825 20.2578 4.09805 20.3236 4.16784L13.7984 7.49314H12.9225C13.6195 7.13918 14.0991 6.41504 14.0991 5.57873C14.0991 4.93187 13.8121 4.35106 13.3586 3.95721H20.1236V3.95845ZM21.5635 7.49314H14.9501L20.6839 4.57167C21.0045 4.94931 21.2977 5.34441 21.5648 5.75447V7.49314H21.5635ZM14.8172 8.01662L13.9214 9.58081V8.01787H13.9239L14.8172 8.01662ZM10.5246 11.5937L11.6266 13.5916H10.5246V11.5937ZM11.9149 14.1151L11.9198 14.1226L11.9248 14.1151H12.6367V23.2235H11.2576V14.1151H11.9149ZM12.223 13.5916L13.3996 11.5388V13.5916H12.223ZM11.9273 13.0582L10.5233 10.5131V8.28334L11.9608 9.0162L13.3983 8.28334V10.4894L11.926 13.0582H11.9273ZM10.0003 8.01662H10.0028V9.5671L9.14798 8.01662H10.0003ZM13.5772 5.57873C13.5772 6.47237 12.8529 7.20025 11.9608 7.20025C11.0688 7.20025 10.3444 6.47362 10.3444 5.57873C10.3444 4.68384 11.0688 3.95721 11.9608 3.95721C12.8529 3.95721 13.5772 4.68384 13.5772 5.57873ZM3.24025 4.57167L8.97405 7.49314H2.36061V5.75447C2.62649 5.34441 2.92094 4.94931 3.24149 4.57167H3.24025ZM2.36061 8.01662H8.55162L10.0028 10.6477V13.791L5.97856 21.7865C5.22316 21.3191 4.51622 20.7607 3.87264 20.1151C3.29864 19.5393 2.79297 18.9123 2.36061 18.2455V8.01662ZM10.424 14.1151H10.7358V23.2235H9.55426C8.4572 22.9892 7.4061 22.5941 6.42956 22.0507L10.424 14.1151ZM13.1573 23.2223V14.1138H13.5002L17.4946 22.0494C16.5168 22.5929 15.467 22.9867 14.3699 23.2223H13.1573ZM17.9456 21.7865L13.9214 13.791V10.629L15.4185 8.01537H21.5635V18.2443C21.1299 18.9111 20.6255 19.538 20.0515 20.1138C19.4079 20.7595 18.701 21.3178 17.9456 21.7852V21.7865ZM11.9621 0.523473C14.7998 0.523473 17.4785 1.55297 19.5769 3.43498H4.34725C6.44571 1.55297 9.12438 0.523473 11.9621 0.523473ZM0.521819 12C0.521819 10.1018 0.979032 8.27462 1.83879 6.64312V17.3581C0.97779 15.7266 0.521819 13.8995 0.521819 12.0012V12ZM2.36061 23.2223V19.1591C2.706 19.624 3.08743 20.0665 3.50364 20.484C4.71874 21.703 6.15125 22.6278 7.71174 23.2223H2.36061ZM16.2124 23.2223C17.7729 22.6278 19.2042 21.7042 20.4205 20.484C20.8367 20.0665 21.2182 19.624 21.5635 19.1591V23.2223H16.2124Z"
        fill="#630066"
      />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-serva-gray-600">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}

function NavBar({ user, usage, onSignOut, onNavigateDashboard, onNavigateSettings, onNavigateProfile, onNavigateBilling, onMenuOpen, isSettingsPage, className }: NavBarProps) {
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

  const initial = (user?.name?.[0] ?? user?.email?.[0])?.toUpperCase() ?? "U";

  return (
    <nav
      className={cn(
        "flex items-center justify-between px-6 h-[54px] bg-light-300 shrink-0",
        className
      )}
    >
      {/* Mobile: icon mark + BETA */}
      <div className="flex md:hidden items-center gap-2">
        <button type="button" onClick={onNavigateDashboard} className="bg-transparent border-none p-0 cursor-pointer">
          <ServamindIconMark />
        </button>
        <span className="px-[6px] py-[4px] text-[11px] font-bold tracking-[-0.33px] uppercase bg-[#1c011e] text-white rounded-[2px] font-mono leading-[1.4]">
          BETA
        </span>
      </div>

      {/* Desktop: full logo + BETA tag */}
      <button type="button" onClick={onNavigateDashboard} className="hidden md:flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer">
        <ServamindLogo />
        <span className="px-[6px] py-[4px] text-[11px] font-bold tracking-[-0.33px] uppercase bg-[#1c011e] text-white rounded-[2px] font-mono leading-[1.4]">
          BETA
        </span>
      </button>

      <div className="flex items-center gap-4">
        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm leading-none">
          <button
            type="button"
            onClick={onNavigateDashboard}
            className={cn("font-medium cursor-pointer bg-transparent border-none p-0", isSettingsPage ? "text-serva-gray-400" : "text-serva-gray-600")}
          >
            Home
          </button>
          <a
            href="https://servamind.mintlify.app/guides/basics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-serva-gray-400 hover:text-serva-gray-600 transition-colors"
          >
            Get Started
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 8.5l5-5M3.5 3.5h5v5" />
            </svg>
          </a>
        </div>

        {/* Desktop gear icon */}
        <button
          className="hidden md:flex items-center justify-center size-8 mx-1 cursor-pointer rounded-full hover:bg-light-200 transition-colors"
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
            className={isSettingsPage ? "text-serva-gray-600" : "text-serva-gray-400"}
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {/* Usage pill - shown on both */}
        <button
          type="button"
          onClick={onNavigateBilling}
          className="flex items-center gap-1 bg-light-200 rounded-[4px] px-2 h-[30px] text-sm cursor-pointer hover:bg-light-200/80 transition-colors"
        >
          <span className="text-serva-gray-400">Used</span>
          <span className="font-medium text-serva-gray-600">{usedDisplay}</span>
          <span className="text-serva-gray-400">/</span>
          <span className="text-serva-gray-400">{totalDisplay}</span>
        </button>

        {/* Desktop avatar */}
        <div className="hidden md:flex items-center">
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

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuOpen}
          className="flex md:hidden items-center justify-center size-8 cursor-pointer"
          aria-label="Open menu"
        >
          <HamburgerIcon />
        </button>
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
