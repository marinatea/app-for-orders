
interface ImportMetaEnv {
  NEXT_PUBLIC_SANITY_API_VERSION: string;
  NEXT_PUBLIC_SANITY_DATASET: string;
  NEXT_PUBLIC_SANITY_PROJECT_ID: string;
  NEXT_PUBLIC_SANITY_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
