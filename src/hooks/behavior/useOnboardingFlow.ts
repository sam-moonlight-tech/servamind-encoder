import { useState, useCallback, useEffect } from "react";
import { authService } from "@/services/api";

const ONBOARDING_COMPLETE_KEY = "serva_onboarding_complete";

type OnboardingStep =
  | { screen: "login" }
  | { screen: "check-email"; email: string }
  | { screen: "welcome" }
  | { screen: "tutorial"; substep: 0 | 1 | 2 | 3 };

function isOnboardingComplete(): boolean {
  return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true";
}

function useOnboardingFlow(onboardingSeen?: boolean) {
  const [step, setStep] = useState<OnboardingStep>({ screen: "login" });
  const [completed, setCompleted] = useState(isOnboardingComplete);

  // Sync with backend flag — if backend says onboarding was seen, mark complete locally
  useEffect(() => {
    if (onboardingSeen && !completed) {
      localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
      setCompleted(true);
    }
  }, [onboardingSeen]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToCheckEmail = useCallback((email: string) => {
    setStep({ screen: "check-email", email });
  }, []);

  const goToWelcome = useCallback(() => {
    setStep({ screen: "welcome" });
  }, []);

  const goToLogin = useCallback(() => {
    setStep({ screen: "login" });
  }, []);

  const goToTutorial = useCallback(() => {
    setStep({ screen: "tutorial", substep: 0 });
  }, []);

  const nextTutorialStep = useCallback(() => {
    setStep((prev) => {
      if (prev.screen !== "tutorial") return prev;
      if (prev.substep < 3) {
        return { screen: "tutorial", substep: (prev.substep + 1) as 0 | 1 | 2 | 3 };
      }
      return prev;
    });
  }, []);

  const skipToLastTutorial = useCallback(() => {
    setStep({ screen: "tutorial", substep: 3 });
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
    setCompleted(true);
    // Fire-and-forget — persist to backend so other devices/sessions skip onboarding
    authService.updateOnboardingSeen({ seen: true }).catch(() => {});
  }, []);

  return {
    step,
    completed,
    goToCheckEmail,
    goToWelcome,
    goToLogin,
    goToTutorial,
    nextTutorialStep,
    skipToLastTutorial,
    completeOnboarding,
  };
}

export { useOnboardingFlow, type OnboardingStep };
