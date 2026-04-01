import { Dialog } from "@/components/ui/Dialog";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { useIsMobile } from "@/hooks/utility/useIsMobile";
import type { ProcessType } from "@/types/domain.types";

interface FileTypeAlertModalProps {
  open: boolean;
  processType: ProcessType;
  onClose: () => void;
}

function FileTypeAlertModal({ open, processType, onClose }: FileTypeAlertModalProps) {
  const isMobile = useIsMobile();

  const title =
    processType === "compress"
      ? ".serva files cannot be encoded"
      : "Only .serva files can be decoded";

  const description =
    processType === "compress"
      ? "The file you selected is already a .serva file. Switch to decode mode to decode it."
      : "Only .serva files can be decoded. Switch to encode mode to encode this file.";

  const content = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-serva-gray-600">
          {title}
        </p>
        <p className="text-xs text-serva-gray-400 leading-normal">
          {description}
        </p>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" size="md" onClick={onClose}>
          Got it
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

FileTypeAlertModal.displayName = "FileTypeAlertModal";

export { FileTypeAlertModal, type FileTypeAlertModalProps };
