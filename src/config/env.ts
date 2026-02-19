function toBoolean(value: string | undefined): boolean {
  return value === "true";
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  authProvider: (import.meta.env.VITE_AUTH_PROVIDER as string) || "mock",
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  featureFlags: {
    enableGoogleDrive: toBoolean(
      import.meta.env.VITE_ENABLE_GOOGLE_DRIVE_UPLOAD
    ),
    showGoogleDriveUpload: toBoolean(
      import.meta.env.VITE_SHOW_GOOGLE_DRIVE_UPLOAD
    ),
    showUploadMetrics: toBoolean(import.meta.env.VITE_SHOW_UPLOAD_METRICS),
    showCompressionMetrics: toBoolean(
      import.meta.env.VITE_SHOW_COMPRESSION_METRICS
    ),
    systemDown: toBoolean(import.meta.env.VITE_SYSTEM_DOWN),
    demoMode: toBoolean(import.meta.env.VITE_DEMO_MODE),
  },
} as const;
