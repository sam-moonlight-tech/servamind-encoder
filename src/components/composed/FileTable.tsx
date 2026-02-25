import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { FileTableItem } from "@/types/domain.types";

interface FileTableProps {
  files: FileTableItem[];
  className?: string;
}

function DocumentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-serva-gray-400 shrink-0"
    >
      <path d="M11.667 2.5H5.833A1.667 1.667 0 004.167 4.167v11.666A1.667 1.667 0 005.833 17.5h8.334a1.667 1.667 0 001.666-1.667V6.667L11.667 2.5z" />
      <path d="M11.667 2.5v4.167h4.166" />
    </svg>
  );
}

function FileTable({ files, className }: FileTableProps) {
  return (
    <div className={cn("border border-[#EAEAEA] rounded-[7px] overflow-hidden", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F5F5F5] text-left text-serva-gray-400 text-xs font-medium">
            <th className="px-4 py-3 w-2/5">File</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {files.map((item) => (
            <tr key={item.name} className="border-t border-[#EAEAEA]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <DocumentIcon />
                  <span className="text-serva-gray-600 truncate">{item.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-serva-gray-400">{item.typeLabel}</td>
              <td className="px-4 py-3 text-serva-gray-400">{item.formattedSize}</td>
              <td className="px-4 py-3">
                {item.status === "error" && (
                  <span className="text-red-500 text-xs">{item.sizeError}</span>
                )}
                {item.status === "ready" && <Badge>Ready</Badge>}
                {item.status === "uploading" && (
                  <span className="text-serva-purple text-xs font-medium">Uploading...</span>
                )}
                {item.status === "complete" && (
                  <span className="text-green-600 text-xs font-medium">Complete</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { FileTable, type FileTableProps };
