import { useState } from "react";
import { usePaymentMethods } from "@/hooks/data";
import { AddPaymentMethodForm } from "./AddPaymentMethodForm";
import type { PaymentMethod } from "@/types/api.types";

interface PaymentMethodsTabProps {
  onPaymentMethodAdded?: () => void;
}

function PaymentMethodLabel({ pm }: { pm: PaymentMethod }) {
  if (pm.type === "link") {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm text-serva-gray-600">Link</span>
        <span className="text-xs text-serva-gray-400">{pm.link_email}</span>
      </div>
    );
  }

  if (pm.type === "us_bank_account" || pm.type === "sepa_debit") {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm text-serva-gray-600">
          {pm.bank_name || "Bank account"} ••••{pm.last4}
        </span>
      </div>
    );
  }

  // Default: card
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-serva-gray-600">
        {pm.brand ? `${pm.brand.charAt(0).toUpperCase()}${pm.brand.slice(1)} ` : ""}••••{pm.last4}
      </span>
      {pm.exp_month > 0 && (
        <span className="text-xs text-serva-gray-400">
          Expires {String(pm.exp_month).padStart(2, "0")}/{pm.exp_year}
        </span>
      )}
    </div>
  );
}

function PaymentMethodsTab({ onPaymentMethodAdded }: PaymentMethodsTabProps) {
  const { data, isPending } = usePaymentMethods();
  const methods = data?.payment_methods;
  const hasMethods = methods && methods.length > 0;
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
    onPaymentMethodAdded?.();
  };

  return (
    <div className="max-w-[805px] ml-0 md:ml-[10%]">
      <div className="flex flex-col items-start w-full md:w-[300px] pt-3 gap-3">
        {isPending ? (
          <>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-[88px] w-full md:w-[300px] bg-light-200 animate-shimmer rounded-[12px]"
              />
            ))}
          </>
        ) : (
          <>
            {hasMethods ? (
              <>
                {methods.map((pm) => (
                  <div
                    key={pm.id}
                    className="border border-light-200 rounded-[12px] w-full md:w-[300px] pt-3 pb-4 pl-4 pr-3 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between w-full">
                      <PaymentMethodLabel pm={pm} />
                      {pm.is_default ? (
                        <span className="bg-serva-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-[4px] leading-[1.4]">
                          Default
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="bg-light-300 text-serva-gray-600 text-xs font-semibold px-3 py-1 rounded-[4px] leading-[1.4] cursor-pointer hover:bg-light-200 transition-colors"
                        >
                          Make Default
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      className="text-xs font-medium text-[#660000] text-left cursor-pointer hover:text-[#880000] transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-xs text-serva-gray-400">
                No payment methods on file.
              </p>
            )}
          </>
        )}

        {showForm ? (
          <div className="w-full md:min-w-[400px]">
            <AddPaymentMethodForm
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : (
          <div className="pt-3">
            {hasMethods ? (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="bg-light-300 text-serva-gray-600 text-sm font-semibold h-9 px-3 rounded-[8px] cursor-pointer hover:bg-light-200 transition-colors"
              >
                Add payment method
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="bg-core-purple text-light-200 text-sm font-semibold h-9 px-3 rounded-[8px] cursor-pointer hover:bg-core-purple/90 transition-colors"
              >
                Add payment method
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { PaymentMethodsTab };
export type { PaymentMethodsTabProps };
