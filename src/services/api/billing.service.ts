import type {
  SetupIntentResponse,
  ListPaymentMethodsResponse,
} from "@/types/api.types";
import type { HttpClient } from "./client";

export interface BillingService {
  createSetupIntent(): Promise<SetupIntentResponse>;
  listPaymentMethods(): Promise<ListPaymentMethodsResponse>;
}

export function createBillingService(client: HttpClient): BillingService {
  return {
    createSetupIntent() {
      return client.post<SetupIntentResponse>(
        "/api/stripe/create-setup-intent"
      );
    },

    listPaymentMethods() {
      return client.get<ListPaymentMethodsResponse>(
        "/api/stripe/payment-methods"
      );
    },
  };
}
