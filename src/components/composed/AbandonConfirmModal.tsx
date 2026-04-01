import { Dialog } from "@/components/ui/Dialog";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { useIsMobile } from "@/hooks/utility/useIsMobile";

interface AbandonConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function AbandonConfirmModal({ open, onClose, onConfirm }: AbandonConfirmModalProps) {
  const isMobile = useIsMobile();

  const content = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-serva-gray-600">
          Abandon current session?
        </p>
        <p className="text-xs text-serva-gray-400 leading-normal">
          Your files and encoding progress will be lost. This can't be undone.
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" size="md" className="bg-light-300" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" size="md" onClick={onConfirm}>
          Abandon session
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
    <Dialog open={open} onClose={onClose} className="max-w-[400px] p-6">
      {content}
    </Dialog>
  );
}

AbandonConfirmModal.displayName = "AbandonConfirmModal";

export { AbandonConfirmModal, type AbandonConfirmModalProps };
