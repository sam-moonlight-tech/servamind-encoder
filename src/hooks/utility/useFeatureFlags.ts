import { useMemo } from "react";
import { env } from "@/config/env";
import type { FeatureFlags } from "@/types/domain.types";

export function useFeatureFlags(): FeatureFlags {
  return useMemo(() => env.featureFlags, []);
}
