import type { OnboardingStep } from "@/hooks/behavior/useOnboardingFlow";
import { OnboardingShell } from "./OnboardingShell";
import { LoginScreen } from "./LoginScreen";
import { CheckEmailScreen } from "./CheckEmailScreen";
import { WelcomeScreen } from "./WelcomeScreen";
import { TutorialScreen } from "./TutorialScreen";
import { PrivacyConsentScreen } from "./PrivacyConsentScreen";

interface OnboardingFlowProps {
  step: OnboardingStep;
  onEmailSubmit: (email: string) => void;
  onGoogleCredential: (credential: string) => void;
  onUseAnotherEmail: () => void;
  onMockVerify?: () => void;
  onWelcomeContinue: () => void;
  onPrivacyContinue: () => void;
  onTutorialNext: () => void;
  onTutorialSkip: () => void;
  onTutorialComplete: () => void;
}

function OnboardingFlow({
  step,
  onEmailSubmit,
  onGoogleCredential,
  onUseAnotherEmail,
  onMockVerify,
  onWelcomeContinue,
  onPrivacyContinue,
  onTutorialNext,
  onTutorialSkip,
  onTutorialComplete,
}: OnboardingFlowProps) {
  return (
    <OnboardingShell>
      {step.screen === "login" && (
        <LoginScreen
          onEmailSubmit={onEmailSubmit}
          onGoogleCredential={onGoogleCredential}
        />
      )}
      {step.screen === "check-email" && (
        <CheckEmailScreen
          email={step.email}
          onUseAnotherEmail={onUseAnotherEmail}
          onMockVerify={onMockVerify}
        />
      )}
      {step.screen === "welcome" && (
        <WelcomeScreen onContinue={onWelcomeContinue} />
      )}
      {step.screen === "privacy" && (
        <PrivacyConsentScreen onContinue={onPrivacyContinue} />
      )}
      {step.screen === "tutorial" && (
        <TutorialScreen
          substep={step.substep}
          onNext={onTutorialNext}
          onSkip={onTutorialSkip}
          onComplete={onTutorialComplete}
        />
      )}
    </OnboardingShell>
  );
}

OnboardingFlow.displayName = "OnboardingFlow";

export { OnboardingFlow, type OnboardingFlowProps };
