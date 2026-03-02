import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "h-[85px] w-full overflow-hidden relative shrink-0",
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(194,234,83,0.08) 20%, rgba(189,255,227,0.12) 40%, rgba(169,183,252,0.10) 60%, rgba(252,202,236,0.08) 80%, transparent 100%)",
          maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
        }}
      />
    </footer>
  );
}

export { Footer, type FooterProps };
