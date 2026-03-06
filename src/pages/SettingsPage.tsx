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
        <ContentPanel className="py-10 px-16">
            {activeSection === "profile" && (
              <div>
                <h1 className="text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.1] mb-16">
                  Your profile
                </h1>

                <div className="max-w-[394px] ml-[10%] space-y-8">
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
                  <div className="max-w-[805px] ml-[10%] space-y-8">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-2 w-full rounded-[12px]" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-32 w-full rounded-[16px]" />
                  </div>
                ) : (
                  (() => {
                    const isOverLimit = (quota?.percentage_used ?? 0) >= 100;
                    const overageBytes = isOverLimit && quota
                      ? quota.total_bytes_this_month - quota.quota_bytes
                      : 0;
                    const overageGb = overageBytes / (1024 ** 3);
                    const estimatedCharge = (overageGb * 0.005).toFixed(2);
                    // TODO: replace with actual payment method check
                    const hasPaymentMethod = isOverLimit;

                    return (
                      <div className="max-w-[805px] ml-[10%] space-y-8">
                        {/* Monthly usage */}
                        <div>
                          <p className="text-sm font-medium text-serva-gray-600 mb-2">
                            Monthly usage
                          </p>
                          <p className="text-xs text-serva-gray-400 mb-8">
                            You get 1 TB free every month.
                            {!hasPaymentMethod && !isOverLimit && " Add a payment method to continue encoding once your free usage runs out."}
                          </p>

                          <div className="flex items-baseline gap-1 mb-4">
                            {isOverLimit ? (
                              <>
                                <span className="text-2xl font-medium text-serva-gray-200">
                                  {quota ? formatFileSize(quota.quota_bytes) : "0 GB"}
                                </span>
                                <span className="text-2xl font-medium text-serva-gray-200">
                                  {" / "}
                                  {quota ? formatFileSize(quota.quota_bytes) : "0 GB"}
                                </span>
                                <span className="text-2xl font-medium text-serva-gray-600">
                                  {" + "}
                                  {formatFileSize(overageBytes)}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-2xl font-medium text-serva-gray-600">
                                  {quota
                                    ? formatFileSize(quota.total_bytes_this_month)
                                    : "0 GB"}
                                </span>
                                <span className="text-2xl font-medium text-serva-gray-400">
                                  {" / "}
                                  {quota ? formatFileSize(quota.quota_bytes) : "0 GB"}
                                </span>
                              </>
                            )}
                          </div>

                          <ProgressBar
                            value={quota?.percentage_used ?? 0}
                            max={100}
                            variant="holographic"
                            className="mb-3"
                          />

                          <p className="text-xs text-serva-gray-400">
                            Resets in {daysRemaining} day{daysRemaining === 1 ? "" : "s"}
                          </p>
                        </div>

                        {/* Over-limit: card with pricing + estimated charge */}
                        {isOverLimit && (
                          <div className="border border-light-200 rounded-[16px] p-6 space-y-8">
                            <div>
                              <p className="text-sm font-medium text-serva-gray-600 mb-2">
                                Keep encoding after your free 1 TB
                              </p>
                              <p className="text-xs text-serva-gray-400">
                                Additional usage is{" "}
                                <span className="text-serva-gray-600">$0.005/GB</span>
                                , billed at the end of each monthly cycle.
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-serva-gray-600 mb-2">
                                Estimated charge on{" "}
                                {resetDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-serva-gray-400">
                                ${estimatedCharge}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Under limit, no payment: upsell card */}
                        {!isOverLimit && !hasPaymentMethod && (
                          <div className="border border-light-200 rounded-[16px] p-6">
                            <p className="text-sm font-medium text-serva-gray-600 mb-2">
                              Keep encoding after your free 1 TB
                            </p>
                            <p className="text-xs text-serva-gray-400 mb-8">
                              Add a payment method to continue encoding once your free usage runs out.
                              {" "}Additional usage is{" "}
                              <span className="text-serva-gray-600">$0.005/GB</span>
                              , billed at the end of each monthly cycle.
                            </p>
                            <Button variant="primary" size="md">
                              Add payment method
                            </Button>
                          </div>
                        )}

                        {/* Under limit, has payment: standalone button */}
                        {!isOverLimit && hasPaymentMethod && (
                          <Button variant="primary" size="md">
                            Add payment method
                          </Button>
                        )}
                      </div>
                    );
                  })()
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
