/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PUBLIC_KEY_STRIPE: string;
    readonly VITE_CORS_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
