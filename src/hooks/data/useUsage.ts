import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { statsService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export function useUsage() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.usage,
    queryFn: () => statsService.getUsage(),
    enabled: isAuthenticated,
  });
}
