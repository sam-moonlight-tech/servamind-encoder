import { useState } from "react";
import { AppShell } from "@/components/layout";
import { NavBarContainer } from "@/containers";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type SettingsSection = "profile" | "billing";

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="5.5" r="3" />
      <path d="M3 16.5v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="14" height="10" rx="2" />
      <path d="M2 8h14" />
    </svg>
  );
}

function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  const displayName = user?.email?.split("@")[0] ?? "";
  const displayEmail = user?.email ?? "";

  return (
    <AppShell>
      <NavBarContainer />
      <div className="flex-1 px-2.5 pb-2.5">
        <div className="bg-white border border-light-200 rounded-lg min-h-[calc(100vh-70px)] flex">
          {/* Sidebar */}
          <aside className="w-[240px] border-r border-light-200 py-6 px-4 shrink-0">
            <div className="mb-6">
              <p className="text-[11px] font-semibold text-serva-gray-300 uppercase tracking-wider px-3 mb-2">
                General
              </p>
              <button
                type="button"
                onClick={() => setActiveSection("profile")}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  activeSection === "profile"
                    ? "bg-light-200 text-serva-gray-600"
                    : "text-serva-gray-400 hover:bg-light-100 hover:text-serva-gray-600"
                )}
              >
                <UserIcon />
                Your Profile
              </button>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-serva-gray-300 uppercase tracking-wider px-3 mb-2">
                Settings
              </p>
              <button
                type="button"
                onClick={() => setActiveSection("billing")}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  activeSection === "billing"
                    ? "bg-light-200 text-serva-gray-600"
                    : "text-serva-gray-400 hover:bg-light-100 hover:text-serva-gray-600"
                )}
              >
                <CreditCardIcon />
                Billing
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 py-10 px-12">
            {activeSection === "profile" && (
              <div className="max-w-[520px]">
                <h1 className="text-2xl font-bold text-serva-gray-600 mb-8">
                  Your Profile
                </h1>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-serva-gray-600 mb-1">
                      Name
                    </label>
                    <p className="text-[13px] text-serva-gray-300 mb-2">
                      The name associated with this account
                    </p>
                    <input
                      type="text"
                      defaultValue={displayName}
                      className="w-full h-10 px-3 border border-light-200 rounded-lg text-sm text-serva-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-serva-purple/30 focus:border-serva-purple transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-serva-gray-600 mb-1">
                      Email address
                    </label>
                    <p className="text-[13px] text-serva-gray-300 mb-2">
                      The email address associated with this account
                    </p>
                    <input
                      type="email"
                      value={displayEmail}
                      disabled
                      className="w-full h-10 px-3 border border-light-200 rounded-lg text-sm text-serva-gray-400 bg-light-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-serva-gray-600 mb-1">
                      Phone number
                    </label>
                    <p className="text-[13px] text-serva-gray-300 mb-2">
                      The phone number associated with this account
                    </p>
                    <input
                      type="tel"
                      placeholder=""
                      className="w-full h-10 px-3 border border-light-200 rounded-lg text-sm text-serva-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-serva-purple/30 focus:border-serva-purple transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      className="h-10 px-6 bg-serva-gray-600 text-white text-sm font-medium rounded-lg hover:bg-serva-gray-600/90 transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "billing" && (
              <div className="max-w-[520px]">
                <h1 className="text-2xl font-bold text-serva-gray-600 mb-8">
                  Billing
                </h1>
                <p className="text-sm text-serva-gray-400">
                  Billing settings will be available soon.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </AppShell>
  );
}

export { SettingsPage };
