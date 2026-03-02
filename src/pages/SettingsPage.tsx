import { useState } from "react";
import { AppShell } from "@/components/layout";
import { ContentPanel } from "@/components/layout/ContentPanel";
import { NavBarContainer } from "@/containers";
import { Sidebar, SETTINGS_SECTIONS, Footer } from "@/components/composed";
import { useAuth } from "@/contexts/AuthContext";
import { useQuota } from "@/hooks/data/useQuota";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatFileSize } from "@/services/file/format";
import { cn } from "@/lib/utils";

type SettingsSection = "profile" | "billing";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("bg-light-200 animate-shimmer rounded", className)}
    />
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="6" />
      <path d="M7 9.5V7" />
      <circle cx="7" cy="4.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SettingsPage() {
  const { user } = useAuth();
  const { data: quota, isPending } = useQuota();
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  const displayName = user?.email?.split("@")[0] ?? "";
  const displayEmail = user?.email ?? "";

  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysRemaining = Math.ceil(
    (resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return (
    <AppShell>
      <NavBarContainer />
      <div className="flex flex-1 px-2.5 pb-2.5 gap-0 min-h-0">
        <Sidebar
          sections={SETTINGS_SECTIONS}
          activeKey={activeSection}
          onSelect={(key) => setActiveSection(key as SettingsSection)}
        />
        <ContentPanel className="py-10 px-12">
            {activeSection === "profile" && (
              <div>
                <h1 className="text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.1] mb-8">
                  Your profile
                </h1>

                <div className="max-w-[394px] space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-serva-gray-600 mb-1">
                      Name
                    </label>
                    <p className="text-xs text-serva-gray-400 mb-4">
                      The name associated with this account
                    </p>
                    <input
                      type="text"
                      defaultValue={displayName}
                      className="w-full h-[44px] pl-4 pr-4 py-2.5 border border-light-200 rounded-[8px] text-sm text-serva-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-serva-purple/30 focus:border-serva-purple transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-serva-gray-600 mb-1">
                      Email address
                    </label>
                    <p className="text-xs text-serva-gray-400 mb-4">
                      The email address associated with this account
                    </p>
                    <input
                      type="email"
                      value={displayEmail}
                      disabled
                      className="w-full h-[44px] pl-4 pr-4 py-2.5 border border-light-200 rounded-[8px] text-sm text-serva-gray-200 bg-light-300 cursor-not-allowed"
                    />
                  </div>

                  <div className="pt-2">
                    <Button variant="primary" size="md">
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "billing" && (
              <div>
                <h1 className="text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.1] mb-6">
                  Billing
                </h1>

                {/* Tab bar */}
                <div className="flex gap-6 border-b border-light-200 mb-8">
                  <button
                    type="button"
                    className="pb-3 text-sm font-medium border-b-2 border-serva-gray-600 text-serva-gray-600 cursor-pointer"
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    className="pb-3 text-sm font-medium text-serva-gray-300 border-b-2 border-transparent cursor-pointer hover:text-serva-gray-400"
                  >
                    Payment methods
                  </button>
                </div>

                {isPending ? (
                  <div className="max-w-[800px] space-y-8">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-2 w-full rounded-[12px]" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-32 w-full rounded-[16px]" />
                  </div>
                ) : (
                  <div className="max-w-[800px] space-y-8">
                    {/* Monthly usage */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm font-medium text-serva-gray-600">
                          Monthly usage
                        </span>
                        <span className="text-serva-gray-300">
                          <InfoIcon />
                        </span>
                      </div>
                      <p className="text-xs text-serva-gray-400 mb-4">
                        You get 1 TB free every month.
                      </p>

                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-medium text-serva-gray-600">
                          {quota
                            ? formatFileSize(quota.total_bytes_this_month)
                            : "0 GB"}
                        </span>
                        <span className="text-2xl text-serva-gray-400">
                          {" / "}
                          {quota ? formatFileSize(quota.quota_bytes) : "0 GB"}
                        </span>
                      </div>

                      <ProgressBar
                        value={quota?.percentage_used ?? 0}
                        max={100}
                        className="h-2 mb-3"
                      />

                      <p className="text-xs text-serva-gray-400">
                        Resets in {daysRemaining} day{daysRemaining === 1 ? "" : "s"}
                      </p>
                    </div>

                    {/* Upsell card */}
                    <div className="border border-light-200 rounded-[16px] p-6">
                      <p className="text-sm font-medium text-serva-gray-600 mb-2">
                        Keep encoding after your free 1 TB
                      </p>
                      <p className="text-xs text-serva-gray-400 mb-4">
                        Usage beyond your free allocation is billed at{" "}
                        <span className="font-semibold text-serva-gray-600">$0.005/GB</span>.
                        Only pay for what you use.
                      </p>
                      <Button variant="primary" size="md">
                        Add payment method
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
        </ContentPanel>
      </div>
      <Footer />
    </AppShell>
  );
}

export { SettingsPage };
