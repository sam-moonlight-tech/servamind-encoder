import { useCallback, useMemo, useRef, useState } from "react";
import { UploadStageView, PrivateKeyModal } from "@/components/composed";
import { useDropZone } from "@/hooks/behavior";
import { useFileValidation } from "@/hooks/behavior";
import { useEncode, useDecode } from "@/hooks/data";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { getFileTypeLabel, formatFileSize, validateFileSize } from "@/services/file";
import type { FileTableItem } from "@/types/domain.types";

type FileStatus = "ready" | "uploading" | "complete" | "error";

function DropZoneContainer() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileStatuses, setFileStatuses] = useState<Map<string, FileStatus>>(new Map());
  const [uploading, setUploading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: encodeAsync } = useEncode();
  const { mutateAsync: decodeAsync } = useDecode();
  const { process, setStage, setProcess, setHasFile, addFileResult } = useWorkflow();

  const firstFile = files[0];
  const { canCompress, canDecompress, sizeError } = useFileValidation(firstFile);

  function fileKey(file: File) {
    return `${file.name}:${file.size}`;
  }

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFiles((prev) => {
      const key = `${selectedFile.name}:${selectedFile.size}`;
      const alreadyAdded = prev.some((f) => `${f.name}:${f.size}` === key);
      if (alreadyAdded) return prev;
      return [...prev, selectedFile];
    });
    setHasFile(true);
  }, [setHasFile]);

  const {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useDropZone(handleFileSelect);

  const setStatus = useCallback((file: File, status: FileStatus) => {
    setFileStatuses((prev) => {
      const next = new Map(prev);
      next.set(fileKey(file), status);
      return next;
    });
  }, []);

  const handleUpload = useCallback(
    async (compress: boolean, privateKey: string) => {
      if (files.length === 0) return;
      setUploading(true);

      try {
        if (compress) {
          for (const file of files) {
            setStatus(file, "uploading");
            const result = await encodeAsync({
              file,
              fileReference: crypto.randomUUID(),
              idempotencyKey: crypto.randomUUID(),
              userPassword: privateKey,
            });
            setStatus(file, "complete");
            addFileResult({
              fileName: file.name,
              originalSize: file.size,
              encodedSize: result.encodedSize,
              fileId: result.init.file_id,
              downloadUrl: result.init.download_url,
            });
          }
          setProcess("compress");
        } else {
          for (const file of files) {
            setStatus(file, "uploading");
            await decodeAsync({
              file,
              fileReference: crypto.randomUUID(),
              userPassword: privateKey,
            });
            setStatus(file, "complete");
            addFileResult({
              fileName: file.name,
              originalSize: file.size,
              encodedSize: null,
              fileId: "",
              downloadUrl: "",
            });
          }
          setProcess("decompress");
        }

        setUploading(false);
        setFiles([]);
        setFileStatuses(new Map());
        setStage("download");
      } catch {
        setUploading(false);
        setStage("error");
      }
    },
    [files, encodeAsync, decodeAsync, setStage, setProcess, addFileResult, setStatus]
  );

  const handleClear = useCallback(() => {
    setFiles([]);
    setFileStatuses(new Map());
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
    return files.map((file) => {
      const validation = validateFileSize(file);
      const fileError = validation.valid ? null : (validation.message ?? null);
      const uploadStatus = fileStatuses.get(fileKey(file));
      const status: FileTableItem["status"] = fileError
        ? "error"
        : uploadStatus ?? "ready";

      return {
        name: file.name,
        typeLabel: getFileTypeLabel(file),
        formattedSize: formatFileSize(file.size),
        status,
        sizeError: fileError,
      };
    });
  }, [files, fileStatuses]);

  return (
    <>
      <input
        ref={addMoreInputRef}
        type="file"
        className="hidden"
        onChange={handleAddMoreChange}
      />
      <UploadStageView
        file={firstFile}
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
