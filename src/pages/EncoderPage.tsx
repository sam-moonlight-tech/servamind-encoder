import { useCallback, useRef, useState } from "react";
import { AppShell } from "@/components/layout";
import { ContentPanel } from "@/components/layout/ContentPanel";
import { NavBarContainer, WorkflowContainer, OnboardingContainer } from "@/containers";
import {
  Sidebar,
  DATA_SECTIONS,
  Footer,
} from "@/components/composed";
import { Dialog, Button } from "@/components/ui";
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
  const { process, setProcess, hasFile, stage, reset } = useWorkflow();
  const { isLoading } = useAuth();
  const [showNavWarning, setShowNavWarning] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pendingProcessRef = useRef<ProcessType | null>(null);

  const isInFlight = stage !== "upload" || hasFile;

  const handleSidebarSelect = useCallback(
    (key: string) => {
      const processType = sidebarKeyToProcess[key];
      if (!processType || processType === process) return;

      if (isInFlight) {
        pendingProcessRef.current = processType;
        setShowNavWarning(true);
      } else {
        setProcess(processType);
      }
    },
    [setProcess, process, isInFlight]
  );

  const handleNavConfirm = useCallback(() => {
    setShowNavWarning(false);
    reset();
    if (pendingProcessRef.current) {
      setProcess(pendingProcessRef.current);
      pendingProcessRef.current = null;
    }
  }, [reset, setProcess]);

  const handleNavCancel = useCallback(() => {
    setShowNavWarning(false);
    pendingProcessRef.current = null;
  }, []);

  const handleContentScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 0);
  }, []);

  const activeKey = processToSidebarKey[process];
  const pageTitle = process === "compress" ? "Encode" : "Decode";

  // Show default title header only when no file is loaded in upload stage
  // Other stages (encoding, download) manage their own headers
  const showTitle = stage === "upload" && !hasFile;

  return (
    <AppShell>
      {!isLoading && <OnboardingContainer />}
      <NavBarContainer />
      <div className="flex flex-1 px-2.5 gap-0 min-h-0">
        <Sidebar
          sections={DATA_SECTIONS}
          activeKey={activeKey}
          onSelect={handleSidebarSelect}
        />
        <ContentPanel
          onScroll={handleContentScroll}
          header={showTitle ? (
            <header className={`flex items-center justify-between py-6 px-6 bg-white rounded-t-[8px] shrink-0 ${isScrolled ? "border-b border-light-200" : ""}`}>
              <h1 className="text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.1]">
                {pageTitle}
              </h1>
            </header>
          ) : undefined}
        >
          <div className={showTitle ? "px-6 pb-6" : ""}>
            <WorkflowContainer />
          </div>
        </ContentPanel>
      </div>
      {!hasFile && <Footer />}

      <Dialog open={showNavWarning} onClose={handleNavCancel} className="max-w-[400px]">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.1]">
              Leave current process?
            </h2>
            <p className="text-sm text-serva-gray-400 tracking-[-0.42px] leading-[1.4]">
              Switching will discard your current progress. This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="md" onClick={handleNavCancel}>
              Cancel
            </Button>
            <Button size="md" onClick={handleNavConfirm}>
              Discard &amp; switch
            </Button>
          </div>
        </div>
      </Dialog>
    </AppShell>
  );
}

export { EncoderPage };
