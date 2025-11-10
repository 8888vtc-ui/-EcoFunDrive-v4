// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - GÉNÉRATEUR RÉPONSES CHATBOT
// Génération IA de réponses contextuelles intelligentes
// ═══════════════════════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk';
import type { ExtractedEntities } from '../../types/chatbot';

export class ResponseGenerator {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: import.meta.env.ANTHROPIC_API_KEY || ''
    });
  }

  async generateContextualResponses(keyword: string, entities: ExtractedEntities): Promise<string[]> {
    const prompt = `
Génère 5 réponses conversationnelles contextuelles pour un chatbot VTC Tesla basées sur :

KEYWORD : ${keyword}
ENTITIES : ${JSON.stringify(entities, null, 2)}

Génère des réponses naturelles qui :
1. Répondent directement à la demande
2. Incluent les entités extraites
3. Proposent une action concrète
4. Maintiennent le ton premium
5. Encouragent la conversion

FORMAT JSON :
{
  "responses": [
    {
      "text": "Réponse contextuelle 1",
      "entities_used": ["destination", "date"],
      "next_action": "booking|pricing|whatsapp"
    }
  ]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 2000,
        temperature: 0.6,
        messages: [{ role: "user", content: prompt }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed.responses.map((r: any) => r.text);
        }
      }
    } catch (error) {
      console.error('Error generating contextual responses:', error);
    }

    return [
      `Parfait ! VTC Tesla ${keyword} disponible. Confirmez-vous pour ${entities.destination || 'votre destination'} ?`,
      `Excellent choix ! Je prépare votre trajet ${keyword}. Préférez-vous WhatsApp pour finaliser ?`,
      `Service VTC Premium ${keyword} confirmé. Souhaitez-vous un devis personnalisé ?`
    ];
  }
}
