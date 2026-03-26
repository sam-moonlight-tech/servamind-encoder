import { Navigate, type RouteObject } from "react-router-dom";
import { EncoderPage } from "@/pages/EncoderPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { SystemDownPage } from "@/pages/SystemDownPage";
import { ProtectedRoute } from "@/components/layout";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <EncoderPage />,
  },
  {
    path: "/settings/*",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export const systemDownRoutes: RouteObject[] = [
  {
    path: "*",
    element: <SystemDownPage />,
  },
];
