import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/config/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkflowProvider } from "@/contexts/WorkflowContext";
import { useFeatureFlags } from "@/hooks/utility";
import { routes, systemDownRoutes } from "@/routes";

function AppContent() {
  const { systemDown } = useFeatureFlags();
  const router = createBrowserRouter(systemDown ? systemDownRoutes : routes);
  return <RouterProvider router={router} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WorkflowProvider>
          <AppContent />
        </WorkflowProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
