import { useState } from "react";
import { usePaymentMethods } from "@/hooks/data";
import { AddPaymentMethodForm } from "./AddPaymentMethodForm";

interface PaymentMethodsTabProps {
  onPaymentMethodAdded?: () => void;
}

function PaymentMethodsTab({ onPaymentMethodAdded }: PaymentMethodsTabProps) {
  const { data, isPending } = usePaymentMethods();
  const methods = data?.payment_methods;
  const hasCards = methods && methods.length > 0;
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
    onPaymentMethodAdded?.();
  };

  return (
    <div className="max-w-[805px] ml-[10%]">
      <div className="flex flex-col items-start w-[250px] pt-3 gap-3">
        {isPending ? (
          <>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-[88px] w-[250px] bg-light-200 animate-shimmer rounded-[12px]"
              />
            ))}
          </>
        ) : (
          <>
            {methods && methods.length > 0 ? (
              <>
                {methods.map((pm) => (
                  <div
                    key={pm.id}
                    className="border border-light-200 rounded-[12px] w-[250px] pt-3 pb-4 pl-4 pr-3 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-0.5">
                          <span className="text-sm text-serva-gray-600">
                            ••••{pm.last4}
                          </span>
                        </div>
                        <span className="text-xs text-serva-gray-400">
                          Expires {String(pm.exp_month).padStart(2, "0")}/
                          {pm.exp_year}
                        </span>
                      </div>
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
          <div className="w-full min-w-[400px]">
            <AddPaymentMethodForm
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : (
          <div className="pt-3">
            {hasCards ? (
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
