import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { statsService } from "@/services/api";

export function useSystemStats() {
  return useQuery({
    queryKey: queryKeys.systemStats,
    queryFn: () => statsService.getSystemStats(),
    retry: 1,
  });
}
