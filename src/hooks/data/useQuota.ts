import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { statsService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export function useQuota() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.quota,
    queryFn: () => statsService.getQuota(),
    enabled: isAuthenticated,
  });
}
