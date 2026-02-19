import { Navigate, type RouteObject } from "react-router-dom";
import { EncoderPage } from "@/pages/EncoderPage";
import { SystemDownPage } from "@/pages/SystemDownPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <EncoderPage />,
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
