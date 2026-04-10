import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppShell } from "@/components/layout";
import { ContentPanel } from "@/components/layout/ContentPanel";
import { NavBarContainer, WorkflowContainer, OnboardingContainer } from "@/containers";
import {
  Sidebar,
  DATA_SECTIONS,
  Footer,
} from "@/components/composed";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useAuth } from "@/contexts/AuthContext";
import type { ProcessType } from "@/types/domain.types";

const sidebarKeyToProcess: Record<string, ProcessType> = {
  encode: "compress",
  decode: "decompress",
};

const processToSidebarKey: Record<ProcessType, string> = {
  compress: "encode",
  decompress: "decode",
};

function EncoderPage() {
  const { process, setProcess, hasFile, stage, isUploading, isScrolled, setIsScrolled } = useWorkflow();
  const { isLoading, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Read process type from URL params (e.g. /?process=decode from mobile menu)
  useEffect(() => {
    const processParam = searchParams.get("process");
    if (processParam && sidebarKeyToProcess[processParam]) {
      const target = sidebarKeyToProcess[processParam];
      if (target !== process && !isUploading) {
        setProcess(target);
      }
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSidebarSelect = useCallback(
    (key: string) => {
      const processType = sidebarKeyToProcess[key];
      if (!processType || processType === process) return;
      // Don't switch tabs while an upload is in progress
      if (isUploading) return;
      setProcess(processType);
      setIsScrolled(false);
    },
    [setProcess, setIsScrolled, process, isUploading]
  );

  const handleContentScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 0);
  }, [setIsScrolled]);

  const activeKey = processToSidebarKey[process];
  const pageTitle = process === "compress" ? "Encode" : "Decode";

  // Show default title header only when no file is loaded in upload stage
  // Other stages (encoding, download) manage their own headers
  const showTitle = stage === "upload" && !hasFile;

  return (
    <AppShell>
      {/* key on user id so onboarding state resets when a different account
          signs in (e.g. after account deletion + re-signup in the same browser) */}
      {!isLoading && <OnboardingContainer key={user?.id ?? "anon"} />}
      <NavBarContainer />
      <div className="flex flex-1 px-2.5 gap-0 min-h-0 min-w-0">
        <div className="hidden md:flex">
          <Sidebar
            sections={DATA_SECTIONS}
            activeKey={activeKey}
            onSelect={handleSidebarSelect}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          />
        </div>
        <ContentPanel
          onScroll={handleContentScroll}
          header={showTitle ? (
            <header className={`flex items-center justify-between py-6 px-4 md:px-6 bg-white rounded-t-[8px] shrink-0 ${isScrolled ? "border-b border-light-200" : ""}`}>
              <h1 className="text-xl font-semibold text-serva-gray-600 leading-[1.1]">
                {pageTitle}
              </h1>
            </header>
          ) : undefined}
        >
          <div className={showTitle ? "px-4 md:px-6 pb-6" : ""}>
            <WorkflowContainer />
          </div>
        </ContentPanel>
      </div>
      <div className="hidden md:block">
        {!hasFile && <Footer />}
      </div>
    </AppShell>
  );
}

export { EncoderPage };
