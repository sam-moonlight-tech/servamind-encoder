import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/composed";
import { useAuth } from "@/contexts/AuthContext";
import { useUsage } from "@/hooks/data";

function NavBarContainer() {
  const { user, signOut } = useAuth();
  const { data: usage } = useUsage();
  const navigate = useNavigate();
  return (
    <NavBar
      user={user}
      usage={usage ?? null}
      onSignOut={signOut}
      onNavigateDashboard={() => navigate("/")}
      onNavigateSettings={() => navigate("/settings")}
      onNavigateProfile={() => navigate("/settings")}
    />
  );
}

export { NavBarContainer };
