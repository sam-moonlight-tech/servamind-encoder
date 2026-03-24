import { useEffect, useState } from "react";

/** Must match Tailwind's `md:` breakpoint (768px) */
const MOBILE_BREAKPOINT = 767;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;

function getInitialValue(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(MOBILE_QUERY).matches;
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(getInitialValue);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

export { useIsMobile, MOBILE_BREAKPOINT };
