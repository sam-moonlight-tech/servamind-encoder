import { cn } from "@/lib/utils";

type SidebarItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
};

type SidebarSection = {
  label: string;
  items: SidebarItem[];
};

interface SidebarProps {
  sections: SidebarSection[];
  activeKey: string;
  onSelect: (key: string) => void;
  className?: string;
}

function EncodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 10v2.667A1.334 1.334 0 0 1 12.667 14H3.333A1.334 1.334 0 0 1 2 12.667V10" />
      <polyline points="4.667 6.667 8 10 11.333 6.667" />
      <line x1="8" y1="10" x2="8" y2="2" />
    </svg>
  );
}

function DecodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 10v2.667A1.334 1.334 0 0 1 12.667 14H3.333A1.334 1.334 0 0 1 2 12.667V10" />
      <polyline points="11.333 5.333 8 2 4.667 5.333" />
      <line x1="8" y1="2" x2="8" y2="10" />
    </svg>
  );
}

const DATA_SECTIONS: SidebarSection[] = [
  {
    label: "DATA",
    items: [
      { key: "encode", label: "Encode", icon: <EncodeIcon /> },
      { key: "decode", label: "Decode", icon: <DecodeIcon /> },
    ],
  },
];

const SETTINGS_SECTIONS: SidebarSection[] = [
  {
    label: "SETTINGS",
    items: [
      { key: "profile", label: "Your profile" },
      { key: "billing", label: "Billing" },
    ],
  },
];

function Sidebar({ sections, activeKey, onSelect, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-[184px] shrink-0 py-6 px-3 flex flex-col",
        className
      )}
    >
      {sections.map((section) => (
        <div key={section.label} className="mb-6">
          <p className="font-mono text-xs tracking-[0.48px] text-serva-gray-300 px-2 mb-2">
            {section.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelect(item.key)}
                className={cn(
                  "flex items-center gap-2 h-[32px] px-2 rounded-[4px] text-sm transition-colors cursor-pointer w-full text-left",
                  activeKey === item.key
                    ? "bg-light-200 text-serva-gray-600 font-medium"
                    : "text-serva-gray-400 hover:bg-light-200/50 hover:text-serva-gray-600"
                )}
              >
                {item.icon && (
                  <span className="flex items-center justify-center w-4 h-4">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

export { Sidebar, DATA_SECTIONS, SETTINGS_SECTIONS, type SidebarProps };
