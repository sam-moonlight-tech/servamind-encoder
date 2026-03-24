import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { billingService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export function usePaymentMethods() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.paymentMethods,
    queryFn: () => billingService.listPaymentMethods(),
    enabled: isAuthenticated,
  });
}
