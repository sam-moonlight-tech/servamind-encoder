import { useMutation } from "@tanstack/react-query";
import { billingService } from "@/services/api";

export function useCreateSetupIntent() {
  return useMutation({
    mutationFn: () => billingService.createSetupIntent(),
  });
}
