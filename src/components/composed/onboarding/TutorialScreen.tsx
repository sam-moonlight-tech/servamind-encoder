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
}

const STEPS: StepConfig[] = [
  {
    title: "Upload your files",
    description: "Drag and drop or browse to upload any file type you want to encode.",
    video: null,
  },
  {
    title: "Encode your files once",
    description: "Servamind encodes your files into a compact, reusable format — just once.",
    video: encoderAnimationUrl,
  },
  {
    title: "Reuse the files across models",
    description: "Use your encoded files with any AI model, as many times as you need.",
    video: modelChangeUrl,
  },
  {
    title: "Your files stay secure by design",
    description: "Your data is encrypted and never stored on our servers beyond processing.",
    video: null,
  },
];

function TutorialScreen({ substep, onNext, onSkip, onComplete }: TutorialScreenProps) {
  const step = STEPS[substep];
  const isLast = substep === 3;

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-xs font-medium text-serva-gray-300 tracking-wide uppercase mb-2">
        How Servamind works
      </p>

      <div className="flex items-center gap-1.5 mb-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 w-6 rounded-full transition-colors ${
              i <= substep ? "bg-serva-purple" : "bg-light-200"
            }`}
          />
        ))}
      </div>

      {step.video && (
        <div className="w-full rounded-[12px] overflow-hidden bg-light-300 mb-6 aspect-video">
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

      {!step.video && (
        <div className="w-full rounded-[12px] bg-light-300 mb-6 aspect-video flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-light-200 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#630066"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {substep === 0 && (
                <>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </>
              )}
              {substep === 3 && (
                <>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </>
              )}
            </svg>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-serva-gray-600 leading-tight mb-2">
        {step.title}
      </h2>

      <p className="text-sm text-serva-gray-400 leading-relaxed mb-8">
        {step.description}
      </p>

      <div className="w-full flex flex-col gap-3">
        <button
          type="button"
          onClick={isLast ? onComplete : onNext}
          className="w-full rounded-[12px] bg-[#1C011E] text-white font-medium py-3 text-sm hover:bg-[#1C011E]/90 active:bg-[#1C011E]/80 transition-colors cursor-pointer"
        >
          {isLast ? "Start encoding" : "Next"}
        </button>

        {!isLast && (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm font-medium text-serva-gray-300 hover:text-serva-gray-400 cursor-pointer transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

TutorialScreen.displayName = "TutorialScreen";

export { TutorialScreen, type TutorialScreenProps };
