import { ServamindIcon } from "./ServamindIcon";

interface WelcomeScreenProps {
  onContinue: () => void;
}

function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      <ServamindIcon size={32} />

      <h1 className="text-xl font-semibold text-serva-gray-600 leading-[1.1] tracking-[-0.6px]">
        Welcome to Servamind
      </h1>

      <p className="text-sm font-normal text-serva-gray-600 leading-[1.4] tracking-[-0.42px]">
        Now, you can use the same data across any
        <br />
        model without rewriting your pipeline.
      </p>

      <div className="w-[310px] rounded-[8px] bg-[#1C011E] p-4">
        <p className="text-sm font-normal text-white leading-[1.4] tracking-[-0.42px]">
          While in free beta, you can encode
          <br />
          up to 1 TB of data per month,{" "}
          <span className="text-holo-gradient font-medium">on us!</span>
        </p>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="h-9 px-3 rounded-[8px] bg-core-purple text-light-200 font-semibold text-sm hover:bg-core-purple/90 active:bg-core-purple/80 transition-colors cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
}

WelcomeScreen.displayName = "WelcomeScreen";

export { WelcomeScreen, type WelcomeScreenProps };
