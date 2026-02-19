import { useState, useCallback } from "react";
import { AppShell } from "@/components/layout";
import { NavBarContainer, WorkflowContainer } from "@/containers";
import { InfoBanner, PageHeader, FeatureCard, Footer, OnboardingModal } from "@/components/composed";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useAuth } from "@/contexts/AuthContext";

function FingerprintIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.9 7a8 8 0 0 0-5.3-3.8A8 8 0 0 0 4 10.7" />
      <path d="M12 2a8 8 0 0 1 8 8 16 16 0 0 1-1.2 6.2" />
      <path d="M12 6a4 4 0 0 0-4 4 12 12 0 0 0 .8 4.4" />
      <path d="M12 6a4 4 0 0 1 4 4c0 1.7-.3 3.3-.8 4.8" />
      <path d="M12 10v1a8 8 0 0 1-.4 2.6" />
      <path d="M12 10a8 8 0 0 0 .8 3.5" />
    </svg>
  );
}

function CpuWarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
      <line x1="2" y1="9" x2="4" y2="9" />
      <line x1="2" y1="15" x2="4" y2="15" />
      <line x1="20" y1="9" x2="22" y2="9" />
      <line x1="20" y1="15" x2="22" y2="15" />
      <line x1="9" y1="2" x2="9" y2="4" />
      <line x1="15" y1="2" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="22" />
      <line x1="15" y1="20" x2="15" y2="22" />
    </svg>
  );
}

function RefreshDoubleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}

function EncoderPage() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const { process, setProcess, hasFile } = useWorkflow();
  const { isAuthenticated, isLoading, signIn } = useAuth();

  const handleEmailSubmit = useCallback(
    (email: string) => {
      signIn({ username: email, password: "" });
    },
    [signIn]
  );

  const handleGoogleSignIn = useCallback(() => {
    signIn();
  }, [signIn]);

  const handleAppleSignIn = useCallback(() => {
    signIn();
  }, [signIn]);

  return (
    <AppShell>
      {!isLoading && (
        <OnboardingModal
          open={!isAuthenticated}
          onEmailSubmit={handleEmailSubmit}
          onGoogleSignIn={handleGoogleSignIn}
          onAppleSignIn={handleAppleSignIn}
        />
      )}
      <NavBarContainer />
      <div className="flex-1 px-2.5 pb-2.5">
        <div className="bg-white border border-light-200 rounded-lg min-h-[calc(100vh-70px)]">
          <PageHeader
            title="Serva Encoder"
            processType={process}
            onProcessTypeChange={setProcess}
          />

          {!hasFile && (
            <div className="px-6">
              <InfoBanner
                message="Start with 50 free credits to create your .serva files. Add more anytime in Settings &rarr; Billing &rarr; Credits."
                visible={bannerVisible}
                onDismiss={() => setBannerVisible(false)}
              />
            </div>
          )}

          <div className="px-6 pt-4">
            <WorkflowContainer />
          </div>

          {!hasFile && (
            <section className="flex gap-2 px-6 pb-6 pt-4">
              <FeatureCard
                icon={<FingerprintIcon />}
                title="Deterministic Encoding"
                description="Your data is encoded into a structured format once, eliminating inconsistent tokenization or preprocessing across runs."
                className="flex-1"
              />
              <FeatureCard
                icon={<CpuWarningIcon />}
                title="Reduced Training Overload"
                description="Structured encoding reduces redundant computation and lowers the cost of preparing data for models."
                className="flex-1"
              />
              <FeatureCard
                icon={<RefreshDoubleIcon />}
                title="Reusable Across Workflows"
                description="Use the same .serva dataset across experiments, models, and environments without reprocessing your raw data."
                className="flex-1"
              />
            </section>
          )}
        </div>

        <Footer />
      </div>
    </AppShell>
  );
}

export { EncoderPage };
