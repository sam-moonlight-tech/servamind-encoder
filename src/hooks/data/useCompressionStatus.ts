import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { encoderService } from "@/services/api";
import { useSession } from "./useSession";
import { POLLING_INTERVAL } from "@/config/constants";

export function useCompressionStatus() {
  const { data: fileReceipts } = useSession();
  const hasReceipts = !!fileReceipts && fileReceipts.length > 0;

  return useQuery({
    queryKey: queryKeys.compressionStatus,
    queryFn: () => encoderService.getCompressionStatus(fileReceipts![0]),
    refetchInterval: POLLING_INTERVAL,
    enabled: hasReceipts,
  });
}
