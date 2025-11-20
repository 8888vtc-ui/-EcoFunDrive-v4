// ECOFUNDRIVE V3 - Types Stubs pour Dépendances Manquantes
// Permet au code de compiler sans les dépendances installées

// Stub pour @anthropic-ai/sdk
export class Anthropic {
  constructor(_options: { apiKey: string }) {}
  messages = {
    create: async (_params: any): Promise<any> => ({}),
  };
}

// Stub pour OpenAI
export class OpenAI {
  constructor(_options: { apiKey: string }) {}

  chat = {
    completions: {
      create: async (_params: any): Promise<any> => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                semanticRelevance: 80,
                readabilityScore: 75,
                keywordVariations: [],
                contentGaps: [],
                recommendations: [],
                metrics: {},
              }),
            },
          },
        ],
      }),
    },
  };

  images = {
    generate: async (_params: any): Promise<any> => ({
      data: [{ url: 'https://example.com/placeholder-image.webp' }],
    }),
  };
}

// Stub pour Replicate
export class Replicate {
  constructor(_options: { auth: string }) {}

  async run(_model: string, _options: { input: any }): Promise<any> {
    return ['https://example.com/replicate-placeholder.webp'];
  }
}

// Stub pour Sharp
export class Sharp {
  constructor(_input: Buffer) {}

  resize(_width: number, _height: number, _options?: any): Sharp {
    return this;
  }

  webp(_options?: any): Sharp {
    return this;
  }

  async toBuffer(): Promise<Buffer> {
    return Buffer.from('');
  }

  async metadata(): Promise<{ width?: number; height?: number; format?: string }> {
    return {};
  }
}

export const sharp = Sharp;

// Stub pour Zod
function createBaseSchema() {
  const base: any = {};
  base.min = (_value: number) => base;
  base.max = (_value: number) => base;
  base.optional = () => base;
  base.url = () => base;
  return base;
}

export const z = {
  object(schema: any) {
    const base: any = createBaseSchema();
    base._schema = schema;
    base.parse = (data: any) => data;
    return base;
  },
  string() {
    return createBaseSchema();
  },
  number() {
    return createBaseSchema();
  },
  boolean() {
    return createBaseSchema();
  },
  array(_schema: any) {
    return createBaseSchema();
  },
  enum_<T extends string>(_values: T[]) {
    return createBaseSchema();
  },
  // Certains fichiers utilisent z.enum([...]) sans underscore
  enum<T extends string>(_values: T[]) {
    return createBaseSchema();
  },
  optional(schema: any) {
    // Forme fonctionnelle z.optional(schema)
    const base: any = createBaseSchema();
    base._inner = schema;
    return base;
  },
  parse<T>(_schema: T, data: any) {
    return data;
  },
};

export namespace z {
  export type infer<T> = T;
}

// Stub pour Cheerio
export function cheerio(_html: string): any {
  // Fonction racine $ utilisée comme sélecteur principal
  const root: any = (_selector: string) => {
    // Objet noeud simplifié pour les sélections comme $('h1')
    const node: any = {};
    node.length = 0;
    node.text = () => '';
    node.attr = (_name: string) => undefined;
    node.each = (_fn: any) => {};
    return node;
  };

  // Permet aussi l'usage direct $('title').text() sans re-sélection
  root.text = () => '';
  root.attr = (_name: string) => undefined;
  root.each = (_fn: any) => {};

  return root;
}

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
export function config(): void {}

export {};
