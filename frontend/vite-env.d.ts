/// <reference types="vite/client" />

// Optional: add typings for your custom env vars
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // add more here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


