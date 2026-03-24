import { useState, useCallback, useEffect, useRef, type FormEvent } from "react";
import { ServamindLogo } from "../ServamindLogo";
import { env } from "@/config/env";

interface LoginScreenProps {
  onEmailSubmit: (email: string) => void;
  onGoogleCredential: (credential: string) => void;
}

function Divider() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-light-200" />
      <span className="text-sm font-medium text-serva-gray-300 tracking-wide">
        or
      </span>
      <div className="flex-1 h-px bg-light-200" />
    </div>
  );
}

interface GoogleApi {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
      }) => void;
      renderButton: (element: HTMLElement, config: {
        theme: string;
        size: string;
        width: number;
        shape: string;
        text: string;
      }) => void;
    };
  };
}

function LoginScreen({ onEmailSubmit, onGoogleCredential }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (email.trim()) {
        onEmailSubmit(email.trim());
      }
    },
    [email, onEmailSubmit]
  );

  useEffect(() => {
    const el = googleBtnRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const initGoogle = () => {
      const google = (window as unknown as { google?: GoogleApi }).google;
      if (!google) return;

      google.accounts.id.initialize({
        client_id: env.googleClientId,
        callback: (response) => {
          onGoogleCredential(response.credential);
        },
      });

      google.accounts.id.renderButton(el, {
        theme: "filled_black",
        size: "large",
        width: container.offsetWidth,
        shape: "pill",
        text: "continue_with",
      });
    };

    // If the script already loaded, initialize immediately
    if ((window as unknown as { google?: GoogleApi }).google) {
      initGoogle();
      return;
    }

    // Otherwise wait for it to load
    const script = document.querySelector<HTMLScriptElement>(
      'script[src*="accounts.google.com/gsi/client"]'
    );
    if (script) {
      script.addEventListener("load", initGoogle);
      return () => script.removeEventListener("load", initGoogle);
    }
  }, [onGoogleCredential]);

  return (
    <div ref={containerRef} className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-6">
        <ServamindLogo />
        <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#1c011e] text-white rounded-[3px] font-mono">
          Beta
        </span>
      </div>

      <h1 className="text-3xl font-bold text-serva-gray-600 leading-tight mb-8">
        Turn your files into
        <br />
        reusable AI&#8209;ready data
      </h1>

      <form onSubmit={handleSubmit} className="w-full mb-6 relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Personal or work email"
          className="w-full rounded-[12px] border border-[#EAEAEA] px-4 py-3 pr-14 text-base md:text-sm text-serva-gray-600 placeholder:text-serva-gray-400 focus:border-2 focus:border-serva-purple focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-serva-purple flex items-center justify-center hover:bg-serva-purple/90 active:bg-serva-purple/80 transition-all duration-200 cursor-pointer ${email.trim() ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>

      <div className="w-full mb-6">
        <Divider />
      </div>

      <div ref={googleBtnRef} className="w-full flex justify-center" />

      <p className="mt-8 text-xs text-serva-gray-300 leading-relaxed">
        By continuing, you agree to Servamind&apos;s{" "}
        <a href="#" className="underline text-serva-gray-600">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

LoginScreen.displayName = "LoginScreen";

export { LoginScreen, type LoginScreenProps };
