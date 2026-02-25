import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { statsService } from "@/services/api";

export function usePublicStats() {
  return useQuery({
    queryKey: queryKeys.publicStats,
    queryFn: () => statsService.getPublicStats(),
  });
}
