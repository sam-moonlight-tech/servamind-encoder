import type {
  SetupIntentResponse,
  ListPaymentMethodsResponse,
} from "@/types/api.types";
import type { HttpClient } from "./client";

export interface BillingService {
  createSetupIntent(): Promise<SetupIntentResponse>;
  listPaymentMethods(): Promise<ListPaymentMethodsResponse>;
  setDefaultPaymentMethod(paymentMethodId: string): Promise<void>;
  deletePaymentMethod(paymentMethodId: string): Promise<void>;
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

    setDefaultPaymentMethod(paymentMethodId) {
      return client.post<void>("/api/stripe/payment-methods/default", {
        payment_method_id: paymentMethodId,
      });
    },

    deletePaymentMethod(paymentMethodId) {
      return client.del<void>(
        `/api/stripe/payment-methods/${paymentMethodId}`
      );
    },
  };
}
