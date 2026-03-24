import { useEffect, useRef, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useQueryClient } from "@tanstack/react-query";
import { stripePromise } from "@/lib/stripe";
import { billingService } from "@/services/api";
import { queryKeys } from "@/hooks/data/keys";
import { Button } from "@/components/ui/Button";

import type { QueryClient } from "@tanstack/react-query";

/**
 * After confirmSetup succeeds, Stripe sends a webhook to our backend which
 * attaches the payment method. Poll until the list endpoint reflects it.
 */
async function waitForPaymentMethod(queryClient: QueryClient, maxAttempts = 5) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const data = await billingService.listPaymentMethods();
    if (data.has_payment_method) {
      queryClient.setQueryData(queryKeys.paymentMethods, data);
      return;
    }
  }
  // Even if polling didn't find it, invalidate so next navigation fetches fresh
  queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods });
}

interface AddPaymentMethodFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function CheckoutForm({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const result = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/settings?section=billing&tab=payment-methods`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message ?? "Something went wrong.");
      setSubmitting(false);
    } else {
      // Poll for the webhook to be processed — the backend attaches the payment
      // method asynchronously via Stripe's setupintent.succeeded webhook
      await waitForPaymentMethod(queryClient);
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-light-200 rounded-[16px] p-6">
        <PaymentElement />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!stripe || submitting}
        >
          {submitting ? "Saving…" : "Save payment method"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function AddPaymentMethodForm({
  onSuccess,
  onCancel,
}: AddPaymentMethodFormProps) {
  const calledRef = useRef(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSetupIntent = () => {
    setLoading(true);
    setError(null);
    billingService
      .createSetupIntent()
      .then((res) => setClientSecret(res.client_secret))
      .catch(() => setError("Failed to load payment form. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    fetchSetupIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-serva-gray-400">Loading payment form…</p>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-500">
          {error ?? "Failed to load payment form. Please try again."}
        </p>
        <Button variant="secondary" size="md" onClick={fetchSetupIntent}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret }}
    >
      <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}

export { AddPaymentMethodForm };
export type { AddPaymentMethodFormProps };
