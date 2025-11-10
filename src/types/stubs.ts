// ECOFUNDRIVE V3 - Types Stubs pour Dépendances Manquantes
// Permet au code de compiler sans les dépendances installées

// Stub pour @anthropic-ai/sdk
export declare class Anthropic {
  constructor(options: { apiKey: string });
  messages: {
    create: (params: any) => Promise<any>;
  };
}

// Stub pour OpenAI
export declare class OpenAI {
  constructor(options: { apiKey: string });
  chat: {
    completions: {
      create: (params: any) => Promise<any>;
    };
  };
  images: {
    generate: (params: any) => Promise<any>;
  };
}

// Stub pour Replicate
export declare class Replicate {
  constructor(options: { auth: string });
  run: (model: string, options: { input: any }) => Promise<any>;
}

// Stub pour Sharp
export declare class Sharp {
  constructor(input: Buffer);
  resize(width: number, height: number, options?: any): Sharp;
  webp(options?: any): Sharp;
  toBuffer(): Promise<Buffer>;
  metadata(): Promise<{ width?: number; height?: number; format?: string }>;
}

export const sharp = Sharp;

// Stub pour Zod
export declare namespace z {
  function object(schema: any): any;
  function string(): any;
  function number(): any;
  function boolean(): any;
  function array(schema: any): any;
  function enum_<T extends string>(values: T[]): any;
  function optional(schema: any): any;
  function min(value: number): any;
  function max(value: number): any;
  function url(): any;
  type infer<T> = T;
  function parse<T>(schema: T, data: any): any;
}

// Stub pour Cheerio
export declare function cheerio(html: string): any;

// Stub pour process (Node.js)
declare global {
  const process: {
    env: Record<string, string | undefined>;
    cwd: () => string;
    exit: (code?: number) => never;
    argv: string[];
    on(event: string, listener: (...args: any[]) => void): void;
  };
  
  const Buffer: {
    from(input: ArrayBuffer | string): Buffer;
  };
  
  type Buffer = ArrayBuffer & {
    toString(): string;
  };
}

// Stub pour dotenv
export declare function config(): void;

export {};
