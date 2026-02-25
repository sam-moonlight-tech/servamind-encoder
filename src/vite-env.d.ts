/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_API_URL: string;
  readonly VITE_BACKEND_API_URL: string;
  readonly VITE_AUTH_PROVIDER: string;
  readonly VITE_ENABLE_GOOGLE_DRIVE_UPLOAD: string;
  readonly VITE_SHOW_GOOGLE_DRIVE_UPLOAD: string;
  readonly VITE_SHOW_UPLOAD_METRICS: string;
  readonly VITE_SHOW_COMPRESSION_METRICS: string;
  readonly VITE_SYSTEM_DOWN: string;
  readonly VITE_DEMO_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
