import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppShell } from "@/components/layout";
import { ContentPanel } from "@/components/layout/ContentPanel";
import { NavBarContainer } from "@/containers";
import {
  Sidebar,
  SETTINGS_SECTIONS,
  Footer,
  PaymentMethodsTab,
} from "@/components/composed";
import { useAuth } from "@/contexts/AuthContext";
import { useUsage } from "@/hooks/data/useUsage";
import { usePaymentMethods } from "@/hooks/data/usePaymentMethods";
import { Button } from "@/components/ui/Button";
import { formatFileSize } from "@/services/file/format";
import { cn } from "@/lib/utils";

type SettingsSection = "profile" | "billing";
type BillingTab = "overview" | "payment-methods";

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-light-200 animate-shimmer rounded", className)} />
  );
}

function SettingsPage() {
  const { user } = useAuth();
  const { data: usage, isPending } = useUsage();
  const { data: paymentMethodsData } = usePaymentMethods();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");
  const [billingTab, setBillingTab] = useState<BillingTab>("overview");
  const returnPathRef = useRef<string | null>(null);

  // Read URL params on mount for deep-linking (e.g. redirect from encode 403, page reload)
  useEffect(() => {
    const section = searchParams.get("section");
    const tab = searchParams.get("tab");
    const returnPath = searchParams.get("return");
    if (section === "billing") {
      setActiveSection("billing");
      if (tab === "payment-methods") {
        setBillingTab("payment-methods");
      }
      if (returnPath) {
        returnPathRef.current = returnPath;
      }
      // Clean up only the return param; keep section/tab for reload persistence
      if (returnPath) {
        const next = new URLSearchParams(searchParams);
        next.delete("return");
        setSearchParams(next, { replace: true });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep URL in sync with section/tab so page reload restores position
  useEffect(() => {
    if (activeSection === "billing") {
      setSearchParams(
        { section: "billing", ...(billingTab !== "overview" ? { tab: billingTab } : {}) },
        { replace: true }
      );
    } else {
      // On profile tab, clear params
      if (searchParams.has("section")) {
        setSearchParams({}, { replace: true });
      }
    }
  }, [activeSection, billingTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePaymentMethodAdded = () => {
    if (returnPathRef.current) {
      const path = returnPathRef.current;
      returnPathRef.current = null;
      navigate(path);
    }
  };

  const displayName = user?.email?.split("@")[0] ?? "";
  const displayEmail = user?.email ?? "";

  const [now] = useState(() => new Date());
  const resetDate = usage?.quota_resets_at
    ? new Date(usage.quota_resets_at)
    : new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const goToPaymentMethods = () => {
    setBillingTab("payment-methods");
  };

  return (
    <AppShell>
      <NavBarContainer />
      <div className="flex flex-1 px-2.5 gap-0 min-h-0">
        <Sidebar
          sections={SETTINGS_SECTIONS}
          activeKey={activeSection}
          onSelect={(key) => setActiveSection(key as SettingsSection)}
        />
        <ContentPanel contentClassName="py-10 px-16">
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
                  onClick={() => setBillingTab("overview")}
                  className={cn(
                    "pb-3 text-sm font-medium border-b-2 cursor-pointer",
                    billingTab === "overview"
                      ? "border-serva-gray-600 text-serva-gray-600"
                      : "border-transparent text-serva-gray-300 hover:text-serva-gray-400"
                  )}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setBillingTab("payment-methods")}
                  className={cn(
                    "pb-3 text-sm font-medium border-b-2 cursor-pointer",
                    billingTab === "payment-methods"
                      ? "border-serva-gray-600 text-serva-gray-600"
                      : "border-transparent text-serva-gray-300 hover:text-serva-gray-400"
                  )}
                >
                  Payment methods
                </button>
              </div>

              {billingTab === "payment-methods" && (
                <PaymentMethodsTab onPaymentMethodAdded={handlePaymentMethodAdded} />
              )}

              {billingTab === "overview" && (
                <>
                  {isPending ? (
                    <div className="max-w-[805px] ml-[10%] space-y-8">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-64" />
                      <Skeleton className="h-3 w-64" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  ) : (
                    (() => {
                      const usedBytes = usage?.usage_this_month_bytes ?? 0;
                      const limitBytes = usage?.quota_limit_bytes ?? 0;
                      const overageBytes = usage?.overage_bytes ?? 0;
                      const estimatedCharge =
                        usage?.overage_charges?.toFixed(2) ?? "0.00";
                      const hasPaymentMethod =
                        paymentMethodsData?.has_payment_method ?? false;

                      const chargeDate = resetDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <div className="max-w-[805px] ml-[10%] flex flex-col gap-8">
                          {/* Usage Details heading */}
                          <p className="text-base font-semibold text-serva-gray-600">
                            Usage Details
                          </p>

                          {/* Remaining Usage section */}
                          <div className="flex flex-col gap-4">
                            <p className="text-sm font-medium text-serva-gray-600">
                              Remaining Usage
                            </p>

                            <div className="flex flex-col gap-4 text-xs">
                              {/* Included */}
                              <div className="flex gap-6 items-start">
                                <span className="text-serva-gray-400 w-[120px]">
                                  Included:
                                </span>
                                <span className="font-medium text-serva-gray-600">
                                  {formatFileSize(usedBytes)} / {formatFileSize(limitBytes)}
                                </span>
                              </div>

                              {/* Additional */}
                              <div className="flex gap-6 items-start">
                                <span className="text-serva-gray-400 w-[120px]">
                                  Additional:
                                </span>
                                <div className="flex flex-col gap-2 font-medium">
                                  <span className="text-serva-gray-600">
                                    {formatFileSize(overageBytes)}
                                  </span>
                                  <span className="text-serva-gray-400">
                                    ${estimatedCharge} will be charged on {chargeDate}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Usage refreshes on */}
                            <div className="flex gap-6 items-start text-xs">
                              <span className="text-serva-gray-400 w-[120px]">
                                Usage refreshes on:
                              </span>
                              <span className="font-medium text-serva-gray-600">
                                {chargeDate}
                              </span>
                            </div>

                            {/* Pay-as-you-go info + button */}
                            <div className="flex flex-col gap-3 pt-3">
                              <p className="text-xs text-serva-gray-400">
                                If you need to keep encoding after your free TB,{"\n"}
                                you can continue with pay-as-you-go pricing.
                              </p>
                              <p className="text-xs font-medium text-serva-gray-400">
                                $0.005 per GB
                              </p>
                              {!hasPaymentMethod && (
                                <div className="pt-3">
                                  <Button
                                    variant="primary"
                                    size="md"
                                    onClick={goToPaymentMethods}
                                  >
                                    Add payment method
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </>
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
