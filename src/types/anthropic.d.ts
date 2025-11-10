// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - DÉCLARATIONS ANTHROPIC
// Résolution des erreurs d'imports @anthropic-ai/sdk
// ═══════════════════════════════════════════════════════════

declare module '@anthropic-ai/sdk' {
  export default class Anthropic {
    constructor(options: { apiKey: string });
    messages: {
      create(params: {
        model: string;
        max_tokens: number;
        temperature?: number;
        messages: Array<{ role: string; content: string }>;
      }): Promise<{
        content: Array<{
          type: 'text';
          text: string;
        }>;
      }>;
    };
  }
}
