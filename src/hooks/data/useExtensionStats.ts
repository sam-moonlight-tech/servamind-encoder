import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { statsService } from "@/services/api";

export function useExtensionStats() {
  return useQuery({
    queryKey: queryKeys.extensionStats,
    queryFn: () => statsService.getExtensionStats(),
  });
}
