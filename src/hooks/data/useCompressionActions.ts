import { useMutation } from "@tanstack/react-query";
import { encoderService } from "@/services/api";

export function useStartCompression() {
  return useMutation({
    mutationFn: () => encoderService.startCompression(),
  });
}

export function useCancelCompression() {
  return useMutation({
    mutationFn: () => encoderService.cancelCompression(),
  });
}

export function usePauseCompression() {
  return useMutation({
    mutationFn: () => encoderService.pauseCompression(),
  });
}

export function useResumeCompression() {
  return useMutation({
    mutationFn: () => encoderService.resumeCompression(),
  });
}
