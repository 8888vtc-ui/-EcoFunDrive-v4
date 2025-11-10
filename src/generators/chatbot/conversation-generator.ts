// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - GÉNÉRATEUR CONVERSATIONNEL CHATBOT
// Génération IA de scénarios conversationnels complets
// ═══════════════════════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk';
import type { ConversationScenario, ExtractedEntities } from '../../types/chatbot';

export class ConversationGenerator {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: import.meta.env.ANTHROPIC_API_KEY || ''
    });
  }

  async generateConversationScenarios(keyword: string, contentType: string, generatedContent?: string): Promise<ConversationScenario> {
    const prompt = `
GÉNÈRE des scénarios conversationnels complets pour un chatbot VTC Tesla spécialisé "${keyword}".

CONTEXTE :
- Service : VTC Tesla Premium Côte d'Azur
- Cible : Clients luxe seeking transport premium
- Conversion : WhatsApp + Réservation directe
- Ton : Professionnel, chaleureux, efficace, premium
- Contact WhatsApp : +33 6 16 55 28 11

${generatedContent ? `CONTENU WEB GÉNÉRÉ :\n${generatedContent.substring(0, 2000)}...` : ''}

GÉNÈRE SCÉNARIOS COMPLETS :

1. ACCUEIL (3 variantes) :
   - Message d'accueil chaleureux
   - Mention service Tesla premium
   - Question ouverture conversation

2. QUALIFICATION (5 questions clés) :
   - Destination/trajet souhaité
   - Date et heure de départ
   - Nombre de passagers
   - Type de véhicule préféré
   - Urgence/besoin immédiat

3. PRICING (réponses dynamiques) :
   - Prix pour "${keyword}" 
   - Transparence tarification
   - Comparaison avec concurrents
   - Options de paiement

4. BOOKING (flow réservation) :
   - Étapes réservation
   - Confirmation détails
   - Options personnalisation
   - Suivi réservation

5. URGENCY (si disponibilité immédiate) :
   - Messages urgence
   - Temps réponse garanti
   - Véhicules disponibles
   - Priorité client

6. OBJECTIONS (5 objections principales) :
   - Prix trop élevé
   - Préfère autre transport
   - Besoin de réfléchir
   - Pas sûr de la fiabilité
   - Veut comparer d'abord

7. UPSELLING (3 propositions) :
   - Services additionnels
   - Upgrades véhicule
   - Forfaits spéciaux
   - Services exclusifs

8. CONVERSION (CTA finaux) :
   - WhatsApp direct
   - Réservation immédiate
   - Devis personnalisé
   - Contact prioritaire

FORMAT JSON PRÉCIS :
{
  "keyword": "${keyword}",
  "contentType": "${contentType}",
  "scenarios": {
    "greeting": [
      {
        "text": "Message accueil 1",
        "variables": ["{client_name}"],
        "next_intent": "qualification"
      }
    ],
    "qualification": [
      {
        "question": "Question qualification 1",
        "type": "destination|date|passengers|vehicle|urgency",
        "required": true
      }
    ],
    "pricing": [
      {
        "text": "Réponse prix dynamique",
        "price_range": "min-max",
        "factors": ["demand", "time", "distance"]
      }
    ],
    "booking": [
      {
        "step": 1,
        "text": "Étape réservation",
        "action": "collect_info|confirm|payment"
      }
    ],
    "urgency": [
      {
        "text": "Message urgence",
        "availability": "immediate|within_30min|custom",
        "incentive": "discount|priority|guarantee"
      }
    ],
    "objections": [
      {
        "objection": "prix_élevé",
        "response": "Réponse objection prix",
        "technique": "value_comparison|guarantee|alternative"
      }
    ],
    "upselling": [
      {
        "offer": "Service additionnel",
        "price": "coût supplémentaire",
        "value": "bénéfice client"
      }
    ],
    "conversion": [
      {
        "cta": "WhatsApp direct",
        "message": "https://wa.me/33616552811?text=...",
        "priority": "high|medium|low"
      }
    ]
  },
  "metadata": {
    "generated_at": "timestamp",
    "coherence_score": 0.95,
    "conversion_optimized": true
  }
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 4000,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        // Nettoyer et parser le JSON
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return this.validateAndEnhanceScenarios(parsed);
        }
      }
      
      throw new Error('Failed to parse conversation scenarios');
    } catch (error) {
      console.error('Error generating conversation scenarios:', error);
      return this.generateFallbackScenarios(keyword, contentType);
    }
  }

  private validateAndEnhanceScenarios(scenarios: any): ConversationScenario {
    // Validation et enrichissement des scénarios
    const enhanced = { ...scenarios };
    
    // Ajouter variables par défaut si manquantes
    if (!enhanced.scenarios.greeting[0].variables) {
      enhanced.scenarios.greeting[0].variables = ['{client_name}'];
    }
    
    // Ajouter métadonnées
    enhanced.metadata = {
      generated_at: new Date().toISOString(),
      coherence_score: 0.95,
      conversion_optimized: true,
      version: '3.0'
    };
    
    return enhanced;
  }

  private generateFallbackScenarios(keyword: string, contentType: string): ConversationScenario {
    return {
      keyword,
      contentType,
      scenarios: {
        greeting: [
          {
            text: `👋 Bonjour ! Service VTC Tesla Premium pour ${keyword}. Comment puis-je vous aider ?`,
            variables: ['{client_name}'],
            next_intent: 'qualification'
          }
        ],
        qualification: [
          {
            question: `Quelle destination pour votre trajet ${keyword} ?`,
            type: 'destination',
            required: true
          },
          {
            question: 'Pour quelle date et heure ?',
            type: 'date',
            required: true
          }
        ],
        pricing: [
          {
            text: `💰 Tarif ${keyword} : calculé en temps réel selon distance et demande`,
            price_range: '50-300',
            factors: ['distance', 'time', 'demand']
          }
        ],
        booking: [
          {
            step: 1,
            text: 'Parfait ! Je prépare votre réservation...',
            action: 'collect_info'
          }
        ],
        urgency: [
          {
            text: '🚗 Véhicule disponible immédiatement !',
            availability: 'immediate',
            incentive: 'priority_service'
          }
        ],
        objections: [
          {
            objection: 'prix_élevé',
            response: 'Notre service premium inclut véhicule Tesla, chauffeur professionnel et garantie ponctualité',
            technique: 'value_comparison'
          }
        ],
        upselling: [
          {
            offer: 'Service champagne à bord',
            price: '+50€',
            value: 'Expérience luxe garantie'
          }
        ],
        conversion: [
          {
            cta: 'WhatsApp direct',
            message: `https://wa.me/33616552811?text=Bonjour%20je%20souhaite%20${keyword}`,
            priority: 'high'
          }
        ],
        facebook_review: [
          {
            timing: 'after_booking',
            message: '🎉 MERCI pour votre réservation !\n\n⭐ UN DERNIER SERVICE :\n\nAidez les autres à nous découvrir !\n\nUn avis Facebook nous aide énormément :\n👉 https://facebook.com/fastcab.vtc/reviews\n\n🎁 VOTRE AVIS = 5% RÉDUCTION\nSur votre prochain trajet VTC Tesla !\n\nMerci pour votre confiance 🙏',
            incentive: '5% réduction',
            link: 'https://facebook.com/fastcab.vtc/reviews'
          },
          {
            timing: 'follow_up_24h',
            message: '🌟 BONJOUR de ECOFUNDRIVE !\n\nVotre avis Facebook compte énormément !\n\n⏰ 30 secondes suffisent :\n👉 https://facebook.com/fastcab.vtc/reviews\n\n🎁 Code promo: AVIS5 (valable 30 jours)',
            incentive: 'Code AVIS5',
            link: 'https://facebook.com/fastcab.vtc/reviews'
          },
          {
            timing: 'reminder_48h',
            message: '🎁 DERNIÈRE OFFRE SPÉCIALE !\n\nAvis Facebook = RÉDUCTION 10% ⭐\n\n👉 https://facebook.com/fastcab.vtc/reviews\n⏰ Offre expire dans 48h\n\nVotre avis aide d\'autres clients comme vous !',
            incentive: '10% réduction',
            link: 'https://facebook.com/fastcab.vtc/reviews'
          }
        ]
      },
      metadata: {
        generated_at: new Date().toISOString(),
        coherence_score: 0.8,
        conversion_optimized: true,
        version: '3.0-fallback'
      }
    };
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
