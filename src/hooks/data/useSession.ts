import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { encoderService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export function useSession() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.session,
    queryFn: () =>
      encoderService.loginUser({
        username: user!.id,
        email: user!.email,
      }),
    enabled: isAuthenticated && !!user,
    retry: 0,
  });
}
