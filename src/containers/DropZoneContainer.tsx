import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UploadStageView, PrivateKeyModal, UsageLimitModal } from "@/components/composed";
import { useDropZone } from "@/hooks/behavior";
import { useFileValidation } from "@/hooks/behavior";
import { useEncode, useDecode, useUsage } from "@/hooks/data";
import { queryKeys } from "@/hooks/data/keys";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { ApiError } from "@/services/api";
import { getFileTypeLabel, formatFileSize, validateFileSize } from "@/services/file";
import type { FileTableItem } from "@/types/domain.types";

type FileStatus = "ready" | "waiting" | "encoding" | "encoded" | "uploading" | "complete" | "error";

interface EncodingFileResult {
  encodedSize: number;
  durationMs: number;
}

function DropZoneContainer() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileStatuses, setFileStatuses] = useState<Map<string, FileStatus>>(new Map());
  const [uploading, setUploading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [showPaymentRequiredModal, setShowPaymentRequiredModal] = useState(false);
  const [encodingResults, setEncodingResults] = useState<Map<string, EncodingFileResult>>(new Map());
  const [encodingIndex, setEncodingIndex] = useState(0);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: encodeAsync } = useEncode();
  const { mutateAsync: decodeAsync } = useDecode();
  const { data: usage } = useUsage();
  const { process, stage, hasFile, setStage, setProcess, setHasFile, addFileResult } = useWorkflow();

  // Clear local file state when the workflow resets (e.g. switching encode/decode)
  useEffect(() => {
    if (stage === "upload" && !uploading && files.length > 0 && !hasFile) {
      setFiles([]);
      setFileStatuses(new Map());
      setEncodingResults(new Map());
      setEncodingIndex(0);
    }
  }, [stage, uploading, hasFile]); // eslint-disable-line react-hooks/exhaustive-deps

  const firstFile = files[0];
  const { canCompress, canDecompress, sizeError } = useFileValidation(firstFile);

  function fileKey(file: File) {
    return `${file.name}:${file.size}`;
  }

  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    setFiles((prev) => {
      const existingKeys = new Set(prev.map((f) => `${f.name}:${f.size}`));
      const newFiles = selectedFiles.filter(
        (f) => !existingKeys.has(`${f.name}:${f.size}`)
      );
      if (newFiles.length === 0) return prev;
      return [...prev, ...newFiles];
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
      setEncodingIndex(0);
      setEncodingResults(new Map());

      // Set all files to waiting
      setFileStatuses(() => {
        const map = new Map<string, FileStatus>();
        files.forEach((f) => map.set(fileKey(f), "waiting"));
        return map;
      });

      let hasSuccess = false;

      if (compress) {
        let idx = 0;
        for (const file of files) {
          idx++;
          setEncodingIndex(idx);
          setStatus(file, "encoding");
          try {
            const start = performance.now();
            const result = await encodeAsync({
              file,
              fileReference: crypto.randomUUID(),
              idempotencyKey: crypto.randomUUID(),
              userPassword: privateKey,
            });
            const durationMs = performance.now() - start;
            setStatus(file, "encoded");

            setEncodingResults((prev) => {
              const next = new Map(prev);
              next.set(fileKey(file), {
                encodedSize: result.encodedSize ?? 0,
                durationMs,
              });
              return next;
            });

            addFileResult({
              fileName: file.name,
              originalSize: file.size,
              encodedSize: result.encodedSize,
              fileId: result.init.file_id,
              downloadUrl: result.init.download_url,
              durationMs,
            });
            hasSuccess = true;
          } catch (err) {
            if (err instanceof ApiError && err.isPaymentMethodRequired) {
              setUploading(false);
              setShowPaymentRequiredModal(true);
              return;
            }
            setStatus(file, "error");
          }
        }
        setProcess("compress");
      } else {
        let idx = 0;
        for (const file of files) {
          idx++;
          setEncodingIndex(idx);
          setStatus(file, "encoding");
          try {
            const start = performance.now();
            const result = await decodeAsync({
              file,
              fileReference: crypto.randomUUID(),
              userPassword: privateKey,
            });
            const durationMs = performance.now() - start;
            setStatus(file, "complete");
            addFileResult({
              fileName: result.stream.original_filename || file.name,
              originalSize: file.size,
              encodedSize: null,
              fileId: result.stream.file_id || "",
              downloadUrl: result.stream.download_url || "",
              durationMs,
            });
            hasSuccess = true;
          } catch (err) {
            if (err instanceof ApiError && err.isPaymentMethodRequired) {
              setUploading(false);
              setShowPaymentRequiredModal(true);
              return;
            }
            setStatus(file, "error");
          }
        }
        setProcess("decompress");
      }

      setUploading(false);
      if (hasSuccess) {
        queryClient.invalidateQueries({ queryKey: queryKeys.usage });
        setFiles([]);
        setFileStatuses(new Map());
        setEncodingResults(new Map());
        setEncodingIndex(0);
        setStage("download");
      }
      // If no files succeeded, stay on the upload stage showing per-file errors
      // (the global error stage is only for unscoped errors like network failures)
    },
    [files, encodeAsync, decodeAsync, setStage, setProcess, addFileResult, setStatus, queryClient, navigate]
  );

  const handleClear = useCallback(() => {
    setFiles([]);
    setFileStatuses(new Map());
    setHasFile(false);
  }, [setHasFile]);

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      if (next.length === 0) {
        setHasFile(false);
      }
      return next;
    });
  }, [setHasFile]);

  const handleAddMore = useCallback(() => {
    addMoreInputRef.current?.click();
  }, []);

  const handleAddMoreChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (selected && selected.length > 0) {
        handleFileSelect(Array.from(selected));
      }
      e.target.value = "";
    },
    [handleFileSelect]
  );

  const totalUploadBytes = useMemo(
    () => files.reduce((sum, f) => sum + f.size, 0),
    [files]
  );

  const exceedsQuota = process === "compress"
    && usage
    && usage.quota_limit_bytes !== null
    && usage.usage_this_month_bytes + totalUploadBytes > usage.quota_limit_bytes;

  const handleStart = useCallback(() => {
    if (exceedsQuota) {
      setShowUsageLimitModal(true);
    } else {
      setShowKeyModal(true);
    }
  }, [exceedsQuota]);

  const handleUsageLimitContinue = useCallback(() => {
    setShowUsageLimitModal(false);
    setShowKeyModal(true);
  }, []);

  const handleUsageLimitRemove = useCallback(() => {
    setShowUsageLimitModal(false);
    handleClear();
  }, [handleClear]);

  const handlePaymentRequiredContinue = useCallback(() => {
    setShowPaymentRequiredModal(false);
    navigate("/settings?section=billing&tab=payment-methods&return=/");
  }, [navigate]);

  const handlePaymentRequiredRemove = useCallback(() => {
    setShowPaymentRequiredModal(false);
    handleClear();
  }, [handleClear]);

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
      const key = fileKey(file);
      const currentStatus = fileStatuses.get(key);
      const status: FileTableItem["status"] = fileError
        ? "error"
        : currentStatus ?? "ready";
      const result = encodingResults.get(key);

      return {
        name: status === "encoded" ? file.name.replace(/\.[^.]+$/, ".serva") : file.name,
        typeLabel: getFileTypeLabel(file),
        formattedSize: formatFileSize(file.size),
        status,
        sizeError: fileError,
        encodedSize: result ? formatFileSize(result.encodedSize) : undefined,
        reductionPercent:
          result && file.size > 0
            ? Math.round(((file.size - result.encodedSize) / file.size) * 100)
            : undefined,
        durationSeconds: result ? result.durationMs / 1000 : undefined,
      };
    });
  }, [files, fileStatuses, encodingResults]);

  return (
    <>
      <input
        ref={addMoreInputRef}
        type="file"
        multiple
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
        encodingProgress={uploading ? { current: encodingIndex, total: files.length } : undefined}
        isDragging={isDragging}
        onFileSelect={handleFileSelect}
        onClear={handleClear}
        onAddMore={handleAddMore}
        onStart={handleStart}
        onRemove={handleRemove}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <PrivateKeyModal
        open={showKeyModal}
        mode={process === "decompress" ? "decrypt" : "encrypt"}
        onClose={() => setShowKeyModal(false)}
        onConfirm={handleKeyConfirm}
      />
      {usage && usage.quota_limit_bytes !== null && (
        <UsageLimitModal
          open={showUsageLimitModal}
          currentUsageBytes={usage.usage_this_month_bytes}
          uploadBytes={totalUploadBytes}
          quotaLimitBytes={usage.quota_limit_bytes}
          overageRate={0.005}
          onClose={() => setShowUsageLimitModal(false)}
          onRemoveFiles={handleUsageLimitRemove}
          onContinue={handleUsageLimitContinue}
        />
      )}
      {usage && usage.quota_limit_bytes !== null && (
        <UsageLimitModal
          open={showPaymentRequiredModal}
          currentUsageBytes={usage.usage_this_month_bytes}
          uploadBytes={totalUploadBytes}
          quotaLimitBytes={usage.quota_limit_bytes}
          overageRate={0.005}
          onClose={() => setShowPaymentRequiredModal(false)}
          onRemoveFiles={handlePaymentRequiredRemove}
          onContinue={handlePaymentRequiredContinue}
        />
      )}
    </>
  );
}

export { DropZoneContainer };
