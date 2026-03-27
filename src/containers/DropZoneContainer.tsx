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
import type { FileTableItem, ProcessType } from "@/types/domain.types";

type FileStatus = "ready" | "waiting" | "encoding" | "encoded" | "uploading" | "complete" | "error";

interface EncodingFileResult {
  encodedSize: number;
  durationMs: number;
}

interface CachedFileState {
  files: File[];
  fileStatuses: Map<string, FileStatus>;
  encodingResults: Map<string, EncodingFileResult>;
  encodingIndex: number;
}

const fileStateCache = new Map<ProcessType, CachedFileState>();

function DropZoneContainer() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: encodeAsync } = useEncode();
  const { mutateAsync: decodeAsync } = useDecode();
  const { data: usage } = useUsage();
  const { process, hasFile, setStage, setProcess, setHasFile, addFileResult, isUploading, setIsUploading } = useWorkflow();

  // Restore from cache if this process has persisted files
  const cached = hasFile ? fileStateCache.get(process) : undefined;

  const [files, setFiles] = useState<File[]>(() => cached?.files ?? []);
  const [fileStatuses, setFileStatuses] = useState<Map<string, FileStatus>>(() => cached?.fileStatuses ?? new Map());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [showPaymentRequiredModal, setShowPaymentRequiredModal] = useState(false);
  const [encodingResults, setEncodingResults] = useState<Map<string, EncodingFileResult>>(() => cached?.encodingResults ?? new Map());
  const [encodingIndex, setEncodingIndex] = useState(() => cached?.encodingIndex ?? 0);
  const [fileProgress, setFileProgress] = useState<Map<string, number>>(new Map());
  const [fileErrors, setFileErrors] = useState<Map<string, string>>(new Map());
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  // Keep a ref to latest state for the unmount cleanup
  const stateRef = useRef({ files, fileStatuses, encodingResults, encodingIndex });
  stateRef.current = { files, fileStatuses, encodingResults, encodingIndex };

  // Save local file state to cache on unmount so it persists across tab switches
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (stateRef.current.files.length > 0) {
        fileStateCache.set(process, { ...stateRef.current });
      } else {
        fileStateCache.delete(process);
      }
    };
  }, [process]);

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

  const startSimulatedProgress = useCallback((file: File) => {
    const key = fileKey(file);
    setFileProgress((prev) => { const next = new Map(prev); next.set(key, 0); return next; });
    // Clear any existing timer
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = setInterval(() => {
      setFileProgress((prev) => {
        const current = prev.get(key) ?? 0;
        if (current >= 90) {
          // Slow down near the end — don't go past 90 until real completion
          return prev;
        }
        const next = new Map(prev);
        // Ease: bigger jumps early, smaller near 90
        const increment = Math.max(1, Math.round((90 - current) * 0.08));
        next.set(key, Math.min(90, current + increment));
        return next;
      });
    }, 200);
  }, []);

  const stopSimulatedProgress = useCallback((file: File) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    const key = fileKey(file);
    setFileProgress((prev) => { const next = new Map(prev); next.set(key, 100); return next; });
  }, []);

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
      setIsUploading(true);
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
          startSimulatedProgress(file);
          try {
            const start = performance.now();
            const result = await encodeAsync({
              file,
              fileReference: crypto.randomUUID(),
              idempotencyKey: crypto.randomUUID(),
              userPassword: privateKey,
            });
            const durationMs = performance.now() - start;
            stopSimulatedProgress(file);
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
              setIsUploading(false);
              setShowPaymentRequiredModal(true);
              return;
            }
            stopSimulatedProgress(file);
            setStatus(file, "error");
            const msg = err instanceof ApiError ? err.message : (err instanceof Error ? err.message : null);
            if (msg) setFileErrors((prev) => new Map(prev).set(fileKey(file), `Encoding failed: ${msg}`));
          }
        }
        setProcess("compress");
      } else {
        let idx = 0;
        for (const file of files) {
          idx++;
          setEncodingIndex(idx);
          setStatus(file, "encoding");
          startSimulatedProgress(file);
          try {
            const start = performance.now();
            const result = await decodeAsync({
              file,
              fileReference: crypto.randomUUID(),
              userPassword: privateKey,
            });
            const durationMs = performance.now() - start;
            stopSimulatedProgress(file);
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
              setIsUploading(false);
              setShowPaymentRequiredModal(true);
              return;
            }
            stopSimulatedProgress(file);
            setStatus(file, "error");
            const msg = err instanceof ApiError ? err.message : (err instanceof Error ? err.message : null);
            if (msg) setFileErrors((prev) => new Map(prev).set(fileKey(file), `Decoding failed: ${msg}`));
          }
        }
        setProcess("decompress");
      }

      setIsUploading(false);
      if (hasSuccess) {
        queryClient.invalidateQueries({ queryKey: queryKeys.usage });
        setFiles([]);
        setFileStatuses(new Map());
        setEncodingResults(new Map());
        setFileProgress(new Map());
        setEncodingIndex(0);
        setStage("download");
      }
      // If no files succeeded, stay on the upload stage showing per-file errors
      // (the global error stage is only for unscoped errors like network failures)
    },
    [files, encodeAsync, decodeAsync, setStage, setProcess, addFileResult, setStatus, setIsUploading, queryClient, startSimulatedProgress, stopSimulatedProgress]
  );

  const handleClear = useCallback(() => {
    setFiles([]);
    setFileStatuses(new Map());
    setEncodingResults(new Map());
    setFileProgress(new Map());
    setFileErrors(new Map());
    setEncodingIndex(0);
    fileStateCache.delete(process);
    setHasFile(false);
  }, [setHasFile, process]);

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
    navigate("/settings/billing/payment-methods?return=/");
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
      const key = fileKey(file);
      const currentStatus = fileStatuses.get(key);
      const fileError = !validation.valid
        ? (validation.message ?? null)
        : currentStatus === "error"
          ? (fileErrors.get(key) ?? null)
          : null;
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
        encodingProgress: fileProgress.get(key),
        encodedSize: result ? formatFileSize(result.encodedSize) : undefined,
        reductionPercent:
          result && file.size > 0
            ? Math.round(((file.size - result.encodedSize) / file.size) * 100)
            : undefined,
        durationSeconds: result ? result.durationMs / 1000 : undefined,
      };
    });
  }, [files, fileStatuses, encodingResults, fileProgress, fileErrors]);

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
        uploading={isUploading}
        encodingProgress={isUploading ? { current: encodingIndex, total: files.length } : undefined}
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
