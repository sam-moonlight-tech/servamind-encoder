import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { healthService } from "@/services/api";

export function useAuthHealth() {
  return useQuery({
    queryKey: queryKeys.authHealth,
    queryFn: () => healthService.getAuthHealth(),
    refetchInterval: 60_000,
  });
}

export function useBackendHealth() {
  return useQuery({
    queryKey: queryKeys.backendHealth,
    queryFn: () => healthService.getBackendHealth(),
    refetchInterval: 60_000,
  });
}
