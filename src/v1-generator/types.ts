export interface V1GeneratorInput {
  keyword: string;
  language: string;
  category: string;
  location: string;
  authority: boolean;
  mode: string;
  wordcount?: number;
}

export interface DryRunOptions {
  logHtml?: boolean;
  logSeoReport?: boolean;
}
