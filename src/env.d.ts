/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly ANTHROPIC_API_KEY?: string;
  readonly OPENAI_API_KEY?: string;
  readonly REPLICATE_API_KEY?: string;
  readonly SHARP_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}