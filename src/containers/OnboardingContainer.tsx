import { useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboardingFlow } from "@/hooks/behavior/useOnboardingFlow";
import { OnboardingFlow } from "@/components/composed/onboarding";
import { authService } from "@/services/api";
import { env } from "@/config/env";

function OnboardingContainer() {
  const { isAuthenticated, user, signIn } = useAuth();
  const {
    step,
    completed,
    termsAccepted,
    goToCheckEmail,
    goToWelcome,
    goToLogin,
    goToPrivacy,
    goToTutorial,
    nextTutorialStep,
    acceptTerms,
    completeOnboarding,
  } = useOnboardingFlow({
    userId: user?.id,
    termsAcceptedAt: user?.termsAcceptedAt,
    onboardingSeen: user?.onboardingSeen,
  });

  const handleEmailSubmit = useCallback(
    async (email: string) => {
      try {
        if (env.authProvider !== "mock") {
          await authService.sendEmailLink({ email });
        }
        goToCheckEmail(email);
      } catch {
        // TODO: surface error to user
      }
    },
    [goToCheckEmail]
  );

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      try {
        await signIn({ googleToken: credential });
        goToWelcome();
      } catch {
        // TODO: surface error to user
      }
    },
    [signIn, goToWelcome]
  );

  const handleUseAnotherEmail = useCallback(() => {
    goToLogin();
  }, [goToLogin]);

  const handleMockVerify = useCallback(async () => {
    try {
      await signIn({ emailToken: "mock_email_token" });
      goToWelcome();
    } catch {
      // TODO: surface error to user
    }
  }, [signIn, goToWelcome]);

  // Welcome → Privacy (first-time) or directly to Tutorial (returning user
  // who already accepted TOS but abandoned before finishing the tutorial).
  const handleWelcomeContinue = useCallback(() => {
    if (termsAccepted) {
      goToTutorial();
    } else {
      goToPrivacy();
    }
  }, [termsAccepted, goToPrivacy, goToTutorial]);

  // Privacy continue: record TOS acceptance immediately (local + backend),
  // then advance. This is the fix for the re-prompt bug — TOS is persisted
  // the moment the user clicks Continue, not at the end of the tutorial.
  const handlePrivacyContinue = useCallback(() => {
    acceptTerms();
    goToTutorial();
  }, [acceptTerms, goToTutorial]);

  // When already authenticated, skip login/check-email → go to welcome
  useEffect(() => {
    if (isAuthenticated && !completed && step.screen === "login") {
      goToWelcome();
    }
  }, [isAuthenticated, completed, step.screen, goToWelcome]);

  // When logged out, reset to login screen so returning users don't see onboarding
  useEffect(() => {
    if (!isAuthenticated && step.screen !== "login") {
      goToLogin();
    }
  }, [isAuthenticated, step.screen, goToLogin]);

  // Don't show if authenticated + already completed onboarding
  if (isAuthenticated && completed) return null;

  // Still on login screen but about to transition — don't flash login
  if (isAuthenticated && step.screen === "login") return null;

  return (
    <OnboardingFlow
      step={step}
      onEmailSubmit={handleEmailSubmit}
      onGoogleCredential={handleGoogleCredential}
      onUseAnotherEmail={handleUseAnotherEmail}
      onMockVerify={env.authProvider === "mock" ? handleMockVerify : undefined}
      onWelcomeContinue={handleWelcomeContinue}
      onPrivacyContinue={handlePrivacyContinue}
      onTutorialNext={nextTutorialStep}
      onTutorialSkip={completeOnboarding}
      onTutorialComplete={completeOnboarding}
    />
  );
}

OnboardingContainer.displayName = "OnboardingContainer";

export { OnboardingContainer };
