import { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "@/components/composed";
import { AbandonConfirmModal } from "@/components/composed/AbandonConfirmModal";
import { MobileMenu } from "@/components/composed/MobileMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useUsage } from "@/hooks/data";
import { useWorkflow } from "@/contexts/WorkflowContext";

function NavBarContainer() {
  const { user, signOut } = useAuth();
  const { data: usage } = useUsage();
  const { process, hasFile, stage, isUploading, reset } = useWorkflow();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAbandonModal, setShowAbandonModal] = useState(false);

  const activeKey = useMemo(() => {
    if (location.pathname.startsWith("/settings")) {
      return location.pathname.startsWith("/settings/billing") ? "billing" : "profile";
    }
    return process === "decompress" ? "decode" : "encode";
  }, [location.pathname, process]);

  const handleMenuOpen = useCallback(() => setMobileMenuOpen(true), []);
  const handleMenuClose = useCallback(() => setMobileMenuOpen(false), []);

  const hasActiveSession = hasFile || stage !== "upload" || isUploading;

  const handleNavigateDashboard = useCallback(() => {
    if (location.pathname === "/" && hasActiveSession) {
      setShowAbandonModal(true);
    } else {
      navigate("/");
    }
  }, [location.pathname, hasActiveSession, navigate]);

  const handleAbandonConfirm = useCallback(() => {
    setShowAbandonModal(false);
    reset();
  }, [reset]);

  return (
    <>
      <NavBar
        user={user}
        usage={usage ?? null}
        onSignOut={signOut}
        onNavigateDashboard={handleNavigateDashboard}
        onNavigateSettings={() => navigate("/settings")}
        onNavigateProfile={() => navigate("/settings")}
        onNavigateBilling={() => navigate("/settings/billing")}
        onMenuOpen={handleMenuOpen}
        isSettingsPage={location.pathname.startsWith("/settings")}
      />
      <AbandonConfirmModal
        open={showAbandonModal}
        onClose={() => setShowAbandonModal(false)}
        onConfirm={handleAbandonConfirm}
      />
      <MobileMenu
        open={mobileMenuOpen}
        onClose={handleMenuClose}
        user={user}
        usage={usage ?? null}
        activeKey={activeKey}
        onNavigateEncode={() => navigate("/?process=encode")}
        onNavigateDecode={() => navigate("/?process=decode")}
        onNavigateSettings={() => navigate("/settings/billing")}
        onNavigateProfile={() => navigate("/settings")}
        onSignOut={signOut}
      />
    </>
  );
}

export { NavBarContainer };
