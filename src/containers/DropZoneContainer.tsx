import { useCallback, useMemo, useRef, useState } from "react";
import { UploadStageView, PrivateKeyModal } from "@/components/composed";
import { useDropZone } from "@/hooks/behavior";
import { useFileValidation } from "@/hooks/behavior";
import { useFileUpload } from "@/hooks/data";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { computeSha256, getFileTypeLabel, formatFileSize } from "@/services/file";
import type { FileTableItem } from "@/types/domain.types";

function DropZoneContainer() {
  const [file, setFile] = useState<File>();
  const [hash, setHash] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useFileUpload();
  const { process, setStage, setProcess, setHasFile } = useWorkflow();
  const { canCompress, canDecompress, sizeError } = useFileValidation(
    file,
    hash
  );

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setHasFile(true);
    const checksum = await computeSha256(selectedFile);
    setHash(checksum);
  }, [setHasFile]);

  const {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useDropZone(handleFileSelect);

  const handleUpload = useCallback(
    (compress: boolean, privateKey: string) => {
      if (!file || !hash) return;
      setUploading(true);

      mutate({
        file,
        checksum: hash,
        compress,
        privateKey,
        onComplete: () => {
          setUploading(false);
          setFile(undefined);
          setHash(undefined);
          setStage("processing");
          setProcess(compress ? "compress" : "decompress");
        },
      });
    },
    [file, hash, mutate, setStage, setProcess]
  );

  const handleClear = useCallback(() => {
    setFile(undefined);
    setHash(undefined);
    setHasFile(false);
  }, [setHasFile]);

  const handleAddMore = useCallback(() => {
    addMoreInputRef.current?.click();
  }, []);

  const handleAddMoreChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
      e.target.value = "";
    },
    [handleFileSelect]
  );

  const handleStart = useCallback(() => {
    setShowKeyModal(true);
  }, []);

  const handleKeyConfirm = useCallback(
    (privateKey: string) => {
      setShowKeyModal(false);
      handleUpload(process === "compress", privateKey);
    },
    [handleUpload, process]
  );

  const canStart = process === "compress" ? canCompress : canDecompress;

  const fileTableItems: FileTableItem[] = useMemo(() => {
    if (!file) return [];
    return [
      {
        name: file.name,
        typeLabel: getFileTypeLabel(file),
        formattedSize: formatFileSize(file.size),
        status: sizeError ? "error" as const : "ready" as const,
        sizeError,
      },
    ];
  }, [file, sizeError]);

  return (
    <>
      <input
        ref={addMoreInputRef}
        type="file"
        className="hidden"
        onChange={handleAddMoreChange}
      />
      <UploadStageView
        file={file}
        sizeError={sizeError}
        fileTableItems={fileTableItems}
        processType={process}
        canStart={canStart}
        uploading={uploading}
        isDragging={isDragging}
        onFileSelect={handleFileSelect}
        onClear={handleClear}
        onAddMore={handleAddMore}
        onStart={handleStart}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <PrivateKeyModal
        open={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onConfirm={handleKeyConfirm}
      />
    </>
  );
}

export { DropZoneContainer };
