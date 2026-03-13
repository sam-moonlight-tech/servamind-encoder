import { ServamindLogo } from "../ServamindLogo";

interface CheckEmailScreenProps {
  email: string;
  onUseAnotherEmail: () => void;
  onMockVerify?: () => void;
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="76" height="47" viewBox="0 0 76 47" fill="none">
      <g clipPath="url(#clip0_1138_3825)">
        <path d="M0 0V47H76V0H0ZM38 29.4516L6.53885 3.45017H69.4568L37.9957 29.4516H38ZM23.0944 21.6197L3.47349 41.1088V5.40384L23.0944 21.6197ZM25.7777 23.8364L38 33.9368L50.2224 23.8364L70.069 43.5498H5.93099L25.7777 23.8364ZM52.9056 21.6197L72.5265 5.40384V41.1088L52.9056 21.6197Z" fill="#614F62" />
      </g>
      <defs>
        <clipPath id="clip0_1138_3825">
          <rect width="76" height="47" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function CheckEmailScreen({ email, onUseAnotherEmail, onMockVerify }: CheckEmailScreenProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="flex items-center gap-3">
        <ServamindLogo />
        <span className="px-1.5 py-1 text-[11px] font-bold tracking-[-0.33px] uppercase bg-[#1c011e] text-white rounded-[2px] font-mono leading-[1.4]">
          BETA
        </span>
      </div>

      <h1 className="text-xl font-semibold text-serva-gray-600 leading-[1.1] tracking-[-0.6px]">
        Check your email to continue
      </h1>

      <div className="w-full rounded-[8px] border border-light-200 bg-light-300 py-9 flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-normal text-serva-gray-400">
            We sent you a link to
          </p>
          <p className="text-sm font-semibold text-serva-gray-600">
            {email}
          </p>
        </div>
        <MailIcon />
      </div>

      <button
        type="button"
        onClick={onUseAnotherEmail}
        className="text-sm font-normal text-serva-gray-600 underline cursor-pointer"
      >
        Use another email
      </button>

      <p className="text-xs font-normal text-serva-gray-200">
        By continuing, you agree to Servamind&apos;s Privacy Policy.
      </p>

      {onMockVerify && (
        <button
          type="button"
          onClick={onMockVerify}
          className="px-4 py-2 rounded-[8px] border border-dashed border-serva-gray-200 text-xs font-mono text-serva-gray-300 hover:border-serva-purple hover:text-serva-purple transition-colors cursor-pointer"
        >
          [debug] Simulate email verify
        </button>
      )}
    </div>
  );
}

CheckEmailScreen.displayName = "CheckEmailScreen";

export { CheckEmailScreen, type CheckEmailScreenProps };
