import encoderAnimationUrl from "@/assets/videos/Servamind_EncoderAnimation.mp4";
import modelChangeUrl from "@/assets/videos/Servamind_ModelChange.mp4";
import uploadIllustrationUrl from "@/assets/images/tutorial-upload.webp";
import secureIllustrationUrl from "@/assets/images/tutorial-secure.webp";

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
      "Servamind encrypts and encodes your files so you can reuse them safely across models without exposing or rebuilding your data.",
    video: null,
    illustration: "secure",
  },
];

function UploadIllustration() {
  return (
    <img
      alt="Upload your files"
      className="w-full h-[201px] rounded-[8px] object-cover"
      src={uploadIllustrationUrl}
    />
  );
}

function SecureIllustration() {
  return (
    <img
      alt="Your files stay secure"
      className="w-full h-[201px] rounded-[8px] object-cover"
      src={secureIllustrationUrl}
    />
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
            src={step.video}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
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
