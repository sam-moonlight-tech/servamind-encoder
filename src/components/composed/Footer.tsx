import { cn } from "@/lib/utils";
import { EXTERNAL_LINKS } from "@/config/constants";

interface FooterProps {
  className?: string;
}

function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "flex flex-col items-center gap-2 py-6 text-sm text-serva-gray-400",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <a
          href={EXTERNAL_LINKS.TERMS}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-serva-purple transition-colors"
        >
          Terms of Use
        </a>
        <span>|</span>
        <a
          href={EXTERNAL_LINKS.PRIVACY}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-serva-purple transition-colors"
        >
          Privacy Policy
        </a>
      </div>
      <a
        href={EXTERNAL_LINKS.COMPANY}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-serva-purple transition-colors"
      >
        Servamind, Inc.
      </a>
    </footer>
  );
}

export { Footer, type FooterProps };
