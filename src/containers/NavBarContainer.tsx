import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/composed";
import { useAuth } from "@/contexts/AuthContext";
import { useQuota } from "@/hooks/data";

function NavBarContainer() {
  const { user, signOut } = useAuth();
  const { data: quota } = useQuota();
  const navigate = useNavigate();
  return (
    <NavBar
      user={user}
      quota={quota ?? null}
      onSignOut={signOut}
      onNavigateDashboard={() => navigate("/")}
      onNavigateSettings={() => navigate("/settings")}
      onNavigateProfile={() => navigate("/settings")}
    />
  );
}

export { NavBarContainer };
