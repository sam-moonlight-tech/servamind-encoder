import { useState, useCallback, useEffect } from "react";
import { authService } from "@/services/api";

// LocalStorage keys are scoped by user id so flags from one account cannot
// be inherited by another account in the same browser (e.g. after account
// deletion + re-signup). The "anon" bucket is used before sign-in.
const termsAcceptedKey = (userId: string | undefined) =>
  `serva_terms_accepted:${userId ?? "anon"}`;
const tutorialSeenKey = (userId: string | undefined) =>
  `serva_tutorial_seen:${userId ?? "anon"}`;

type OnboardingStep =
  | { screen: "login" }
  | { screen: "check-email"; email: string }
  | { screen: "welcome" }
  | { screen: "privacy" }
  | { screen: "tutorial"; substep: 0 | 1 | 2 | 3 };

function readLocalFlag(key: string): boolean {
  return localStorage.getItem(key) === "true";
}

interface OnboardingFlowInput {
  userId?: string;
  termsAcceptedAt?: string | null;
  onboardingSeen?: boolean;
}

function useOnboardingFlow({
  userId,
  termsAcceptedAt,
  onboardingSeen,
}: OnboardingFlowInput = {}) {
  const [step, setStep] = useState<OnboardingStep>({ screen: "login" });
  // Per-user localStorage cache so flags survive page reloads even before
  // the backend write round-trips. Backend values are the cross-device
  // source of truth and are OR'd in below.
  const [localTermsAccepted, setLocalTermsAccepted] = useState(() =>
    readLocalFlag(termsAcceptedKey(userId))
  );
  const [localTutorialSeen, setLocalTutorialSeen] = useState(() =>
    readLocalFlag(tutorialSeenKey(userId))
  );

  // Derived flags — true if either local cache or backend says so.
  // A completed tutorial (onboarding_seen) implies TOS acceptance, since the
  // Privacy screen is the only path to the tutorial in the flow.
  const termsAccepted =
    localTermsAccepted || onboardingSeen === true || termsAcceptedAt != null;
  const tutorialCompleted = localTutorialSeen || onboardingSeen === true;

  // Mirror backend → localStorage cache (write-only; no React state updates
  // inside the effect body, per react-hooks/set-state-in-effect).
  useEffect(() => {
    if (termsAcceptedAt != null) {
      localStorage.setItem(termsAcceptedKey(userId), "true");
    }
  }, [userId, termsAcceptedAt]);

  useEffect(() => {
    if (onboardingSeen === true) {
      localStorage.setItem(tutorialSeenKey(userId), "true");
    }
  }, [userId, onboardingSeen]);

  const goToCheckEmail = useCallback((email: string) => {
    setStep({ screen: "check-email", email });
  }, []);

  const goToWelcome = useCallback(() => {
    setStep({ screen: "welcome" });
  }, []);

  const goToLogin = useCallback(() => {
    setStep({ screen: "login" });
  }, []);

  const goToPrivacy = useCallback(() => {
    setStep({ screen: "privacy" });
  }, []);

  const goToTutorial = useCallback(() => {
    setStep({ screen: "tutorial", substep: 0 });
  }, []);

  const nextTutorialStep = useCallback(() => {
    setStep((prev) => {
      if (prev.screen !== "tutorial") return prev;
      if (prev.substep < 3) {
        return {
          screen: "tutorial",
          substep: (prev.substep + 1) as 0 | 1 | 2 | 3,
        };
      }
      return prev;
    });
  }, []);

  const skipToLastTutorial = useCallback(() => {
    setStep({ screen: "tutorial", substep: 3 });
  }, []);

  const acceptTerms = useCallback(() => {
    localStorage.setItem(termsAcceptedKey(userId), "true");
    setLocalTermsAccepted(true);
    // Fire-and-forget — persist to backend so other devices/sessions skip TOS.
    authService.acceptTerms().catch(() => {});
  }, [userId]);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(tutorialSeenKey(userId), "true");
    setLocalTutorialSeen(true);
    // Fire-and-forget — persist to backend so other devices/sessions skip tutorial.
    authService.updateOnboardingSeen({ seen: true }).catch(() => {});
  }, [userId]);

  return {
    step,
    termsAccepted,
    tutorialCompleted,
    completed: termsAccepted && tutorialCompleted,
    goToCheckEmail,
    goToWelcome,
    goToLogin,
    goToPrivacy,
    goToTutorial,
    nextTutorialStep,
    skipToLastTutorial,
    acceptTerms,
    completeOnboarding,
  };
}

export { useOnboardingFlow, type OnboardingStep };
