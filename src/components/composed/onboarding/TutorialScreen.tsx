import encoderAnimationUrl from "@/assets/videos/Servamind_EncoderAnimation.mp4";
import modelChangeUrl from "@/assets/videos/Servamind_ModelChange.mp4";

interface TutorialScreenProps {
  substep: 0 | 1 | 2 | 3;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

interface StepConfig {
  title: string;
  description: string;
  video: string | null;
  illustration: "upload" | "secure" | null;
}

const STEPS: StepConfig[] = [
  {
    title: "Upload your files",
    description: "Add any data you plan to use for AI training or experiments.",
    video: null,
    illustration: "upload",
  },
  {
    title: "Encode your files once",
    description: "Servamind encodes your files into a compact, reusable format — just once.",
    video: encoderAnimationUrl,
    illustration: null,
  },
  {
    title: "Reuse the files across models",
    description: "Use your encoded files with any AI model, as many times as you need.",
    video: modelChangeUrl,
    illustration: null,
  },
  {
    title: "Your files stay secure by design",
    description:
      "Servamind encrypts and deterministically encodes your files so you can reuse them safely across models without exposing or rebuilding your data.",
    video: null,
    illustration: "secure",
  },
];

function UploadIllustration() {
  return (
    <div className="relative w-full h-[201px] rounded-[12px] bg-light-300 overflow-hidden">
      <img
        alt=""
        className="absolute inset-0 w-full h-full object-cover rounded-[12px]"
        src="/tutorial-upload.png"
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-end">
        <img
          alt=""
          className="w-[52px] h-[52px] object-contain -rotate-[5deg]"
          src="/tutorial-word.png"
        />
        <img
          alt=""
          className="w-[48px] h-[48px] object-contain rotate-[2deg] -ml-5"
          src="/tutorial-indesign.png"
        />
        <div className="relative -ml-3">
          <img
            alt=""
            className="w-[41px] h-[50px] object-contain rotate-[11deg]"
            src="/tutorial-pdf.png"
          />
          <img
            alt=""
            className="absolute -top-[18px] -right-[14px] w-[47px] h-[47px] object-contain rotate-[11deg]"
            src="/tutorial-closedhand.svg"
          />
        </div>
      </div>
    </div>
  );
}

function SecureIllustration() {
  return (
    <div className="relative w-full h-[201px] rounded-[12px] bg-light-300 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 min-w-[200%] min-h-[200%] object-cover"
          src="/tutorial-secure.png"
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-[38px] h-[44px] border-[7px] border-white rounded-t-full mx-auto -mb-5" />
          <img
            alt=""
            className="w-[48px] h-[48px]"
            src="/tutorial-lock.svg"
          />
        </div>
      </div>
    </div>
  );
}

function TutorialScreen({ substep, onNext, onSkip, onComplete }: TutorialScreenProps) {
  const step = STEPS[substep];
  const isLast = substep === 3;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-serva-gray-600 leading-[1.1] tracking-[-0.6px]">
        How Servamind works
      </h2>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-serva-gray-600">
          {step.title}
        </p>
        <p className="text-xs text-serva-gray-400 leading-normal">
          {step.description}
        </p>
      </div>

      {step.video && (
        <div className="w-full h-[201px] rounded-[12px] overflow-hidden bg-light-300">
          <video
            key={step.video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={step.video} type="video/mp4" />
          </video>
        </div>
      )}

      {step.illustration === "upload" && <UploadIllustration />}
      {step.illustration === "secure" && <SecureIllustration />}

      <div className="flex items-center justify-end gap-2.5">
        {!isLast && (
          <button
            type="button"
            onClick={onSkip}
            className="h-9 px-3 rounded-[8px] bg-light-300 text-sm font-semibold text-serva-gray-600 hover:bg-light-200 transition-colors cursor-pointer"
          >
            Skip
          </button>
        )}
        <button
          type="button"
          onClick={isLast ? onComplete : onNext}
          className="h-9 px-3 rounded-[8px] bg-core-purple text-sm font-semibold text-light-200 hover:bg-core-purple/90 active:bg-core-purple/80 transition-colors cursor-pointer"
        >
          {isLast ? "Start encoding" : "Continue"}
        </button>
      </div>
    </div>
  );
}

TutorialScreen.displayName = "TutorialScreen";

export { TutorialScreen, type TutorialScreenProps };
