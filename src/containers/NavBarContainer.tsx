import { NavBar } from "@/components/composed";
import { useAuth } from "@/contexts/AuthContext";

function NavBarContainer() {
  const { user, signOut } = useAuth();
  return <NavBar user={user} onSignOut={signOut} />;
}

export { NavBarContainer };
