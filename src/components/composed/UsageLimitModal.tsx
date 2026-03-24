import { Dialog } from "@/components/ui/Dialog";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { formatFileSize } from "@/services/file";
import { useIsMobile } from "@/hooks/utility/useIsMobile";

const GB = 1_073_741_824;
const TB = 1_099_511_627_776;

/** Always format in GB so all three columns are directly comparable. */
function formatGB(bytes: number): string {
  const gb = bytes / GB;
  if (gb >= 1000) return `${Math.round(gb).toLocaleString()} GB`;
  if (gb >= 1) return `${Math.round(gb)} GB`;
  return formatFileSize(bytes); // fall back for small uploads (MB/KB)
}

interface UsageLimitModalProps {
  open: boolean;
  currentUsageBytes: number;
  uploadBytes: number;
  quotaLimitBytes: number;
  overageRate: number;
  onClose: () => void;
  onRemoveFiles: () => void;
  onContinue: () => void;
}

function UsageLimitModal({
  open,
  currentUsageBytes,
  uploadBytes,
  quotaLimitBytes,
  overageRate,
  onClose,
  onRemoveFiles,
  onContinue,
}: UsageLimitModalProps) {
  const isMobile = useIsMobile();
  const afterUploadBytes = currentUsageBytes + uploadBytes;
  const overageBytes = afterUploadBytes - quotaLimitBytes;
  const estimatedCost = Math.max(0, (overageBytes / GB) * overageRate);
  const quotaLabel = quotaLimitBytes >= TB
    ? `${(quotaLimitBytes / TB).toFixed(0)} TB`
    : formatGB(quotaLimitBytes);

  const content = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-serva-gray-600">
          This upload exceeds your free {quotaLabel}
        </p>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-light-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-6 items-center text-xs">
                <div className="flex flex-col gap-3">
                  <span className="text-serva-gray-300">Current usage</span>
                  <span className="font-medium text-serva-gray-600">
                    {formatGB(currentUsageBytes)}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-serva-gray-300">This upload</span>
                  <span className="font-medium text-serva-gray-600">
                    +{formatFileSize(uploadBytes)}
                  </span>
                </div>
              </div>

              <span className="text-lg text-serva-gray-600">=</span>

              <div className="flex flex-col gap-3 text-xs">
                <span className="text-serva-gray-300">After upload</span>
                <span className="font-medium text-[#971114]">
                  {formatGB(afterUploadBytes)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-serva-gray-400">
            Continue encoding with pay-as-you-go pricing, or remove files.
          </p>
          <p className="text-xs font-semibold text-serva-gray-400">
            ${overageRate.toFixed(3)} per GB · This upload ≈ ${Math.max(1, Math.round(estimatedCost))}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" size="md" className="bg-light-300" onClick={onRemoveFiles}>
          Remove files
        </Button>
        <Button variant="primary" size="md" onClick={onContinue}>
          Continue with payment method
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet open={open} onClose={onClose} className="p-6">
        {content}
      </BottomSheet>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} className="max-w-[468px] p-6">
      {content}
    </Dialog>
  );
}

UsageLimitModal.displayName = "UsageLimitModal";

export { UsageLimitModal, type UsageLimitModalProps };
