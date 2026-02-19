import { AppShell } from "@/components/layout";
import { EXTERNAL_LINKS } from "@/config/constants";

function SystemDownPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-bold font-display text-serva-gray-600 mb-4">
          System Maintenance
        </h1>
        <p className="text-lg text-serva-gray-400 mb-6 max-w-md">
          Servamind is currently undergoing maintenance. Please check back
          shortly.
        </p>
        <a
          href={EXTERNAL_LINKS.CONTACT}
          target="_blank"
          rel="noopener noreferrer"
          className="text-serva-purple hover:underline"
        >
          Contact Support
        </a>
      </div>
    </AppShell>
  );
}

export { SystemDownPage };
