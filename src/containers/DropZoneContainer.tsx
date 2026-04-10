import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UploadStageView, PrivateKeyModal, UsageLimitModal, FileTypeAlertModal } from "@/components/composed";
import { useDropZone } from "@/hooks/behavior";
import { useFileValidation } from "@/hooks/behavior";
import { useEncode, useDecode, useUsage, usePaymentMethods } from "@/hooks/data";
import { queryKeys } from "@/hooks/data/keys";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { ApiError, encoderService } from "@/services/api";
import { getFileTypeLabel, formatFileSize, validateFileSize, isCompressedFile } from "@/services/file";
import type { FileResult, FileTableItem, ProcessType } from "@/types/domain.types";

type FileStatus = "ready" | "waiting" | "encoding" | "encoded" | "uploading" | "complete" | "error";

interface EncodingFileResult {
  encodedSize: number;
  durationMs: number;
}

interface CachedFileState {
  files: File[];
  fileStatuses: Map<string, FileStatus>;
  encodingResults: Map<string, EncodingFileResult>;
}

const fileStateCache = new Map<ProcessType, CachedFileState>();

function DropZoneContainer() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: encodeAsync } = useEncode();
  const { mutateAsync: decodeAsync } = useDecode();
  const { data: usage } = useUsage();
  const { data: paymentMethodsData } = usePaymentMethods();
  const { process, resetCount, setStage, setProcess, setHasFile, addFileResult, isUploading, setIsUploading } = useWorkflow();

  // Restore from cache if this process has persisted files
  const cached = fileStateCache.get(process);
  const initialFiles = cached?.files ?? [];

  // Sync hasFile on mount — the previous process may have left it stale
  // useLayoutEffect prevents a flash of the wrong header before correction
  useLayoutEffect(() => {
    setHasFile(initialFiles.length > 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [files, setFiles] = useState<File[]>(() => initialFiles);
  const [fileStatuses, setFileStatuses] = useState<Map<string, FileStatus>>(() => cached?.fileStatuses ?? new Map<string, FileStatus>());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [showPaymentRequiredModal, setShowPaymentRequiredModal] = useState(false);
  const [showFileTypeAlert, setShowFileTypeAlert] = useState(false);
  const [encodingResults, setEncodingResults] = useState<Map<string, EncodingFileResult>>(() => cached?.encodingResults ?? new Map());
  const [fileProgress, setFileProgress] = useState<Map<string, number>>(new Map());
  const [fileErrors, setFileErrors] = useState<Map<string, string>>(new Map());
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const cancelledKeysRef = useRef<Set<string>>(new Set());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const fileRefsRef = useRef<Map<string, { fileReference: string; idempotencyKey?: string }>>(new Map());

  // When a reset is triggered (e.g. abandon session), clear all local state
  const initialResetCount = useRef(resetCount);
  useEffect(() => {
    if (resetCount !== initialResetCount.current) {
      setFiles([]);
      setFileStatuses(new Map());
      setEncodingResults(new Map());
      setFileProgress(new Map());
      setFileErrors(new Map());
      fileStateCache.delete(process);
      fileStateCache.delete(process === "compress" ? "decompress" : "compress");
      initialResetCount.current = resetCount;
    }
  }, [resetCount, process]);

  // Keep a ref to latest state for the unmount cleanup
  const stateRef = useRef({ files, fileStatuses, encodingResults });
  useEffect(() => {
    stateRef.current = { files, fileStatuses, encodingResults };
  });

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
    if (selectedFiles.length === 0) return;

    // In encode mode, filter out .serva files and warn — but allow non-.serva files through
    if (process === "compress" && selectedFiles.some((f) => isCompressedFile(f))) {
      setShowFileTypeAlert(true);
      selectedFiles = selectedFiles.filter((f) => !isCompressedFile(f));
      if (selectedFiles.length === 0) return;
    }

    // In decode mode, reject non-.serva files with a dialog
    if (process === "decompress" && selectedFiles.some((f) => !isCompressedFile(f))) {
      setShowFileTypeAlert(true);
      return;
    }

    setFiles((prev) => {
      const existingKeys = new Set(prev.map((f) => `${f.name}:${f.size}`));
      const newFiles = selectedFiles.filter(
        (f) => !existingKeys.has(`${f.name}:${f.size}`)
      );
      if (newFiles.length === 0) return prev;
      return [...prev, ...newFiles];
    });

    setHasFile(true);
  }, [setHasFile, process]);

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
      setEncodingResults(new Map());
      cancelledKeysRef.current = new Set();
      abortControllersRef.current = new Map();
      fileRefsRef.current = new Map();

      // Set all files to waiting
      setFileStatuses(() => {
        const map = new Map<string, FileStatus>();
        files.forEach((f) => map.set(fileKey(f), "waiting"));
        return map;
      });

      let hasSuccess = false;
      const orderedResults: FileResult[] = [];

      if (compress) {
        for (const file of files) {
          // Skip files cancelled while waiting
          if (cancelledKeysRef.current.has(fileKey(file))) continue;
          setStatus(file, "encoding");
          startSimulatedProgress(file);
          const encodeController = new AbortController();
          abortControllersRef.current.set(fileKey(file), encodeController);
          const fileReference = crypto.randomUUID();
          const idempotencyKey = crypto.randomUUID();
          fileRefsRef.current.set(fileKey(file), { fileReference, idempotencyKey });
          try {
            const start = performance.now();
            const result = await encodeAsync({
              file,
              fileReference,
              idempotencyKey,
              userPassword: privateKey,
              signal: encodeController.signal,
            });
            const durationMs = performance.now() - start;
            abortControllersRef.current.delete(fileKey(file));
            // Discard result if cancelled while in-flight
            if (cancelledKeysRef.current.has(fileKey(file))) {
              stopSimulatedProgress(file);
              continue;
            }
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

            orderedResults.push({
              fileName: file.name,
              originalSize: file.size,
              encodedSize: result.encodedSize,
              fileId: result.init.file_id,
              downloadUrl: result.init.download_url,
              durationMs,
              originalSha256Hex: result.originalSha256Hex,
              decodedSha256Hex: result.decodedSha256Hex,
              roundtripHashesMatch: result.roundtripHashesMatch,
            });
            hasSuccess = true;
          } catch (err) {
            abortControllersRef.current.delete(fileKey(file));
            if (cancelledKeysRef.current.has(fileKey(file))) {
              stopSimulatedProgress(file);
              continue;
            }
            if (err instanceof ApiError && err.isPaymentMethodRequired) {
              stopSimulatedProgress(file);
              // Reset this file and all remaining "waiting" files back to ready
              setFileStatuses((prev) => {
                const next = new Map(prev);
                for (const [k, s] of next) {
                  if (s === "encoding" || s === "waiting") next.set(k, "ready");
                }
                return next;
              });
              setFileProgress(new Map());
              setIsUploading(false);
              setShowPaymentRequiredModal(true);
              return;
            }
            stopSimulatedProgress(file);
            setStatus(file, "error");
            const msg = err instanceof ApiError ? err.message : (err instanceof Error ? err.message : "Unknown error");
            setFileErrors((prev) => new Map(prev).set(fileKey(file), `Encoding failed: ${msg}`));
            orderedResults.push({
              fileName: file.name,
              originalSize: file.size,
              encodedSize: null,
              fileId: "",
              downloadUrl: "",
              durationMs: null,
              error: `Encoding failed: ${msg}`,
            });
          }
        }
        setProcess("compress");
      } else {
        for (const file of files) {
          // Skip files cancelled while waiting
          if (cancelledKeysRef.current.has(fileKey(file))) continue;
          setStatus(file, "encoding");
          startSimulatedProgress(file);
          const decodeController = new AbortController();
          abortControllersRef.current.set(fileKey(file), decodeController);
          const fileReference = crypto.randomUUID();
          fileRefsRef.current.set(fileKey(file), { fileReference });
          try {
            const start = performance.now();
            const result = await decodeAsync({
              file,
              fileReference,
              userPassword: privateKey,
              signal: decodeController.signal,
            });
            const durationMs = performance.now() - start;
            abortControllersRef.current.delete(fileKey(file));
            // Discard result if cancelled while in-flight
            if (cancelledKeysRef.current.has(fileKey(file))) {
              stopSimulatedProgress(file);
              continue;
            }
            stopSimulatedProgress(file);
            setStatus(file, "complete");
            orderedResults.push({
              fileName: result.stream.original_filename || file.name,
              originalSize: file.size,
              encodedSize: null,
              fileId: result.stream.file_id || "",
              downloadUrl: result.stream.download_url || "",
              durationMs,
            });
            hasSuccess = true;
          } catch (err) {
            abortControllersRef.current.delete(fileKey(file));
            if (cancelledKeysRef.current.has(fileKey(file))) {
              stopSimulatedProgress(file);
              continue;
            }
            if (err instanceof ApiError && err.isPaymentMethodRequired) {
              stopSimulatedProgress(file);
              setFileStatuses((prev) => {
                const next = new Map(prev);
                for (const [k, s] of next) {
                  if (s === "encoding" || s === "waiting") next.set(k, "ready");
                }
                return next;
              });
              setFileProgress(new Map());
              setIsUploading(false);
              setShowPaymentRequiredModal(true);
              return;
            }
            stopSimulatedProgress(file);
            setStatus(file, "error");
            const msg = err instanceof ApiError ? err.message : (err instanceof Error ? err.message : "Unknown error");
            setFileErrors((prev) => new Map(prev).set(fileKey(file), `Decoding failed: ${msg}`));
            orderedResults.push({
              fileName: file.name,
              originalSize: file.size,
              encodedSize: null,
              fileId: "",
              downloadUrl: "",
              durationMs: null,
              error: `Decoding failed: ${msg}`,
            });
          }
        }
        setProcess("decompress");
      }

      setIsUploading(false);
      if (hasSuccess) {
        queryClient.invalidateQueries({ queryKey: queryKeys.usage });
        for (const result of orderedResults) {
          addFileResult(result);
        }
        // Synchronously clear stateRef before setStage triggers unmount — the
        // unmount cleanup reads stateRef to decide whether to persist to cache,
        // but effects (which normally update stateRef) don't run on the unmount
        // render, so stateRef would otherwise hold stale mid-encoding state.
        stateRef.current = { files: [], fileStatuses: new Map(), encodingResults: new Map() };
        setFiles([]);
        setFileStatuses(new Map());
        setEncodingResults(new Map());
        setFileProgress(new Map());
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
    fileStateCache.delete(process);
    setHasFile(false);
  }, [setHasFile, process]);

  const handleRemove = useCallback((index: number) => {
    const { files: currentFiles, fileStatuses: currentStatuses } = stateRef.current;
    const file = currentFiles[index];
    if (!file) return;

    const key = fileKey(file);
    const status = currentStatuses.get(key);

    if (status === "encoding" || status === "waiting") {
      // In-flight or queued: abort the request, notify backend, and remove row
      cancelledKeysRef.current.add(key);
      abortControllersRef.current.get(key)?.abort();
      abortControllersRef.current.delete(key);

      // Fire-and-forget backend cancel to revoke tokens / release quota
      const refs = fileRefsRef.current.get(key);
      if (refs) {
        if (process === "compress") {
          encoderService.encodeCancel({
            file_reference: refs.fileReference,
            idempotency_key: refs.idempotencyKey,
          }).catch(() => {});
        } else {
          encoderService.decodeCancel({
            file_reference: refs.fileReference,
          }).catch(() => {});
        }
        fileRefsRef.current.delete(key);
      }

      setFiles((prev) => {
        const next = [...prev];
        next.splice(index, 1);
        if (next.length === 0) setHasFile(false);
        return next;
      });
      setFileStatuses((prev) => {
        const next = new Map(prev);
        next.delete(key);
        return next;
      });
    } else {
      // Pre-encoding (ready/error): just remove
      setFiles((prev) => {
        const next = [...prev];
        next.splice(index, 1);
        if (next.length === 0) setHasFile(false);
        return next;
      });
    }
  }, [setHasFile, process]);

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

  const hasPaymentMethod = paymentMethodsData?.has_payment_method ?? false;

  const handleUsageLimitContinue = useCallback(() => {
    setShowUsageLimitModal(false);
    if (hasPaymentMethod) {
      setShowKeyModal(true);
    } else {
      navigate("/settings/billing/payment-methods?return=/");
    }
  }, [hasPaymentMethod, navigate]);

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
        encodingProgress={isUploading ? {
          current: files.filter(f => { const s = fileStatuses.get(fileKey(f)); return s === "encoding" || s === "encoded" || s === "complete" || s === "error"; }).length,
          total: files.length,
        } : undefined}
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
      <FileTypeAlertModal
        open={showFileTypeAlert}
        processType={process}
        onClose={() => setShowFileTypeAlert(false)}
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
          hasPaymentMethod={hasPaymentMethod}
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
