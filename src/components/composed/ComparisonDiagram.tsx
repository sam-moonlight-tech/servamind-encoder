import { cn } from "@/lib/utils";

interface ComparisonDiagramProps {
  className?: string;
}

/** Right-pointing arrow connector — responsive size */
function Arrow() {
  return (
    <svg viewBox="0 0 22 7" fill="none" className="shrink-0 w-3 md:w-[22px] h-auto">
      <path d="M18 0.353516L21 3.35352L18 6.35352" stroke="#614F62" />
      <path d="M0 3.35352H20.8133" stroke="#614F62" strokeLinejoin="round" />
    </svg>
  );
}

/** Branching connector: one input splitting into 3 outputs — responsive */
function BranchConnector() {
  return (
    <svg viewBox="0 0 25 78" fill="none" className="shrink-0 w-3 md:w-[25px] h-auto">
      <path d="M20.375 0.353516L23.375 3.35352L20.375 6.35352" stroke="#614F62" />
      <path d="M19.9932 35.8223L22.9932 38.8223L19.9932 41.8223" stroke="#614F62" />
      <path d="M0 38.8223H23M23 3.22852H13.4932V74.2285L23 74.228" stroke="#614F62" />
      <path d="M19.9932 71.291L22.9932 74.291L19.9932 77.291" stroke="#614F62" />
    </svg>
  );
}

/** Monospace step label — responsive sizing */
function StepLabel({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "highlight" | "serva";
}) {
  if (variant === "serva") {
    return (
      <div className="relative flex items-center justify-center mb-2 md:mb-3">
        <div className="absolute left-2 md:left-3 right-2 md:right-3 top-[15px] md:top-[19px] h-4 md:h-5 bg-[#a1d76e] rounded-[5px] md:rounded-[6px]" />
        <div className="absolute left-1 md:left-1.5 right-1 md:right-1.5 top-[8px] md:top-[10px] h-5 md:h-6 bg-[#74bd2d] rounded-[6px] md:rounded-[7px]" />
        <div className="relative flex items-center gap-1 md:gap-2 h-6 md:h-7 px-2 md:px-3 rounded-[6px] md:rounded-[8px] font-mono text-[9px] md:text-xs tracking-[0.8px] md:tracking-[1.2px] whitespace-nowrap bg-serva-green text-light-300">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 md:gap-2 h-6 md:h-7 px-2 md:px-3 rounded-[6px] md:rounded-[8px] font-mono text-[9px] md:text-xs tracking-[0.8px] md:tracking-[1.2px] whitespace-nowrap",
        variant === "default" && "bg-light-300 text-serva-gray-600",
        variant === "highlight" && "bg-light-200 text-serva-gray-600"
      )}
    >
      {children}
    </div>
  );
}

/** Circle icon for Model A */
function CircleIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0 text-core-purple md:w-3 md:h-3">
      <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Triangle icon for Model B */
function TriangleIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" className="shrink-0 text-core-purple md:w-3 md:h-3">
      <path d="M6 1 L11 11 L1 11 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Square icon for Model C */
function SquareIcon() {
  return (
    <div className="size-[10px] md:size-[12px] shrink-0 border-[1.5px] border-core-purple" />
  );
}

/** Encode icon used next to .SERVA label */
function EncodeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 18 18" fill="none" className="shrink-0 md:w-[14px] md:h-[14px]">
      <path d="M8.94995 0.100342C11.2713 0.100342 13.4573 0.988655 15.1179 2.60425H16.4558V4.25464C17.3304 5.64821 17.7996 7.26413 17.7996 8.94995C17.7996 10.6354 17.3319 12.2508 16.4558 13.6443V17.615H10.7615C10.1723 17.7363 9.56728 17.7996 8.94995 17.7996C8.33262 17.7996 7.72764 17.7363 7.13843 17.615H1.44409V13.6443C0.569795 12.2509 0.100342 10.6355 0.100342 8.94995C0.100342 7.26413 0.569512 5.64821 1.44409 4.25464V2.60425H2.78198C4.44258 0.988656 6.62865 0.100342 8.94995 0.100342ZM14.9177 15.4802C14.2098 16.1277 13.4157 16.6502 12.5603 17.033H15.6941L14.9177 15.4802ZM3.25073 14.9392C4.36477 16.0006 5.7221 16.7166 7.19604 17.033H10.7019C12.1755 16.7167 13.5322 15.9987 14.6462 14.9392L8.94897 3.54565L3.25073 14.9392ZM2.20581 17.033H5.3396C4.48312 16.65 3.68929 16.128 2.9812 15.4802L2.20581 17.033ZM2.02612 16.0916L2.54468 15.0544C2.36325 14.8632 2.18937 14.6665 2.02612 14.4626V16.0916ZM15.8738 14.4626C15.711 14.6669 15.537 14.8637 15.3542 15.0544L15.8738 16.0916V14.4626ZM3.02319 3.18628C2.6471 3.57113 2.31425 3.98597 2.02612 4.42651V13.4705C2.2624 13.8307 2.52939 14.1737 2.823 14.4978L8.48022 3.18628H3.02319ZM15.0759 14.4978C15.3697 14.1736 15.6374 13.8309 15.8738 13.4705V4.42651C15.5839 3.98741 15.251 3.57104 14.8767 3.18628H9.41968L15.0759 14.4978ZM1.44409 5.47046C0.944059 6.54633 0.68042 7.72708 0.68042 8.94995C0.68042 10.1725 0.944301 11.3528 1.44409 12.4285V5.47046ZM16.4539 12.4285C16.9537 11.3525 17.2185 10.171 17.2185 8.94995C17.2185 7.72705 16.9539 6.54635 16.4539 5.47046V12.4285ZM8.94995 0.681396C6.98975 0.681396 5.13446 1.36006 3.65015 2.6062H14.2488C12.7645 1.36177 10.9098 0.681396 8.94995 0.681396Z" fill="white" stroke="white" strokeWidth="0.2"/>
    </svg>
  );
}

/** One row of the "Without Servamind" flow */
function WithoutRow({
  icon,
  modelLabel,
}: {
  icon: React.ReactNode;
  modelLabel: string;
}) {
  return (
    <div className="flex items-center gap-1 md:gap-2">
      <StepLabel>DATA SET</StepLabel>
      <Arrow />
      <StepLabel variant="highlight">PREPROCESS</StepLabel>
      <Arrow />
      <StepLabel>
        {icon}
        {modelLabel}
      </StepLabel>
    </div>
  );
}

function ComparisonDiagram({ className }: ComparisonDiagramProps) {
  return (
    <div className={cn("flex flex-col items-center gap-12 mt-10 pb-12 md:px-0", className)}>
      {/* Section heading */}
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-2xl md:text-xl font-semibold text-serva-gray-600 tracking-[-0.6px] leading-[1.2] text-center">
          Then never preprocess the data again
        </h3>
        <p className="text-sm text-serva-gray-400 text-center leading-[1.4] tracking-[-0.42px] max-w-[371px]">
          Instead of rebuilding preprocessing for each pipeline, load your .serva
          files directly into the workflow you already use.
        </p>
      </div>

      {/* Comparison cards */}
      <div className="flex flex-col md:flex-row items-stretch gap-4 w-full md:w-auto">
        {/* Without Servamind */}
        <div className="bg-white border border-light-200 rounded-2xl p-4 md:p-8 flex flex-col items-center gap-4 md:gap-6">
          <p className="text-sm font-semibold text-serva-gray-600 tracking-[-0.42px] text-center">
            Without Servamind
          </p>
          <div className="flex flex-col gap-1.5 md:gap-2">
            <WithoutRow icon={<CircleIcon />} modelLabel="TRAIN MODEL A" />
            <WithoutRow icon={<TriangleIcon />} modelLabel="TRAIN MODEL B" />
            <WithoutRow icon={<SquareIcon />} modelLabel="TRAIN MODEL C" />
          </div>
        </div>

        {/* With Servamind */}
        <div className="bg-white border border-light-200 rounded-2xl p-4 md:p-8 flex flex-col items-center gap-4 md:gap-6">
          <p className="text-sm font-semibold text-serva-gray-600 tracking-[-0.42px] text-center">
            With Servamind
          </p>
          <div className="flex items-center gap-1 md:gap-2 justify-center">
            <StepLabel>DATA SET</StepLabel>
            <Arrow />
            <StepLabel variant="serva">
              .SERVA
              <EncodeIcon />
            </StepLabel>
            <BranchConnector />
            <div className="flex flex-col gap-1.5 md:gap-2">
              <StepLabel>
                <CircleIcon />
                TRAIN MODEL A
              </StepLabel>
              <StepLabel>
                <TriangleIcon />
                TRAIN MODEL B
              </StepLabel>
              <StepLabel>
                <SquareIcon />
                TRAIN MODEL C
              </StepLabel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ComparisonDiagram, type ComparisonDiagramProps };
