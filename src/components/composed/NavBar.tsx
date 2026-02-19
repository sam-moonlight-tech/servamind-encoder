import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/domain.types";

interface NavBarProps {
  user: AuthUser | null;
  onSignOut: () => void;
  className?: string;
}

function NavBar({ user, onSignOut, className }: NavBarProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between px-6 py-3 bg-light-300",
        className
      )}
    >
      <div className="flex items-center">
        <span className="text-xl font-bold tracking-tight text-serva-gray-600 uppercase">
          Servamind
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-6 text-sm leading-none">
          <span className="font-medium text-serva-gray-600 cursor-pointer">
            Encoder
          </span>
          <span className="text-serva-gray-400 cursor-pointer hover:text-serva-gray-600 transition-colors">
            Docs
          </span>
        </div>

        <button
          className="flex items-center justify-center size-8 cursor-pointer"
          aria-label="Settings"
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
            <span className="font-medium text-serva-gray-600">0</span>
            <span className="text-serva-gray-400">/</span>
            <span className="text-serva-gray-400">50 credits</span>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center justify-center size-8 rounded-full bg-serva-purple/40 cursor-pointer"
            aria-label="User menu"
          >
            <span className="text-sm font-medium text-serva-gray-600">
              {user?.email?.[0]?.toUpperCase() ?? "U"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export { NavBar, type NavBarProps };
