interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_META_PIXEL_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}