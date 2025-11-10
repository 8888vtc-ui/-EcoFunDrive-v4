// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - GÉNÉRATEUR BASE CONNAISSANCES CHATBOT
// Création dynamique de base connaissances pour chatbot
// ═══════════════════════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk';
import type { KnowledgeBase, ExtractedEntities } from '../../types/chatbot';

export class KnowledgeGenerator {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: import.meta.env.ANTHROPIC_API_KEY || ''
    });
  }

  async generateKnowledgeBase(keyword: string, generatedContent: string, entities?: ExtractedEntities): Promise<KnowledgeBase> {
    const prompt = `
BASE sur le contenu généré pour "${keyword}", crée une base de connaissances structurée pour le chatbot VTC Tesla.

CONTENU GÉNÉRÉ :
${generatedContent.substring(0, 3000)}...

${entities ? `ENTITÉS EXTRAITES :\n${JSON.stringify(entities, null, 2)}` : ''}

INFORMATIONS ENTREPRISE :
- Service : VTC Tesla Premium Côte d'Azur
- Contact : +33 6 16 55 28 11
- WhatsApp : https://wa.me/33616552811
- Site : https://ecofundrive.com
- Flotte : Tesla Model 3, Model S, Model X
- Services : Transferts aéroport, événements, tourisme, affaires
- Zone : Côte d'Azur (Nice, Monaco, Cannes, Saint-Tropez)

CRÉE BASE CONNAISSANCES COMPLÈTE :

1. FAQ PRINCIPALES (10 questions) :
   Questions fréquentes avec réponses précises
   Inclure prix, durée, disponibilité, services

2. INFORMATIONS PRATIQUES :
   Prix par destination/type
   Durées estimées trajets
   Disponibilités et horaires
   Options véhicules

3. SERVICES SPÉCIFIQUES "${keyword}" :
   Détails services spécialisés
   Avantages concurrentiels
   Options personnalisation

4. OBJECTIONS ET RÉPONSES :
   5 objections principales avec réponses convaincantes
   Techniques de persuasion adaptées

5. INFORMATIONS COMPLÉMENTAIRES :
   Conseils pratiques
   Informations locales
   Services additionnels

FORMAT JSON PRÉCIS :
{
  "keyword": "${keyword}",
  "faq": [
    {
      "question": "Question fréquente 1",
      "answer": "Réponse détaillée 1",
      "category": "pricing|service|logistics|vehicle|contact",
      "keywords": ["mot1", "mot2"],
      "priority": "high|medium|low",
      "followup_questions": ["Question1", "Question2"]
    }
  ],
  "practical_info": {
    "pricing": {
      "base_rates": {
        "nice_monaco": "80€",
        "nice_cannes": "100€",
        "airport_transfer": "60€"
      },
      "factors": ["distance", "time", "demand", "vehicle_type"],
      "payment_methods": ["carte", "espèces", "crypto", "entreprise"]
    },
    "duration": {
      "nice_monaco": "25 minutes",
      "nice_cannes": "30 minutes",
      "airport_downtown": "20 minutes"
    },
    "availability": {
      "operating_hours": "24/7",
      "booking_advance": "Dernière minute",
      "cancellation": "Gratuit jusqu'à 2h avant",
      "guarantee": "Ponctualité garantie ou remboursé"
    },
    "vehicles": {
      "model_3": "4 passagers, 3 valises",
      "model_s": "4 passagers, 4 valises", 
      "model_x": "6 passagers, 5 valises",
      "features": ["climatisation", "wifi", "bouteilles eau", "chargeurs usb"]
    }
  },
  "services": [
    {
      "name": "Service spécial ${keyword}",
      "description": "Description détaillée",
      "included": ["Item1", "Item2"],
      "optional": ["Option1", "Option2"],
      "price_range": "min-max€"
    }
  ],
  "objections": [
    {
      "objection": "prix_élevé",
      "response": "Réponse conviction prix",
      "technique": "value_demonstration|comparison|guarantee",
      "evidence": ["preuve1", "preuve2"]
    }
  ],
  "additional_info": [
    {
      "type": "conseil|information|service",
      "title": "Titre information",
      "content": "Contenu détaillé",
      "usefulness": "client_benefit"
    }
  ],
  "metadata": {
    "generated_at": "timestamp",
    "total_faqs": 10,
    "coverage_score": 0.95,
    "last_updated": "timestamp"
  }
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 4000,
        temperature: 0.5,
        messages: [{ role: "user", content: prompt }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return this.validateAndEnhanceKnowledge(parsed, keyword);
        }
      }
      
      throw new Error('Failed to parse knowledge base');
    } catch (error) {
      console.error('Error generating knowledge base:', error);
      return this.generateFallbackKnowledge(keyword);
    }
  }

  private validateAndEnhanceKnowledge(knowledge: any, keyword: string): KnowledgeBase {
    const enhanced = { ...knowledge };
    
    // Validation et enrichissement
    if (!enhanced.faq || enhanced.faq.length === 0) {
      enhanced.faq = this.generateDefaultFAQ(keyword);
    }
    
    if (!enhanced.practical_info) {
      enhanced.practical_info = this.generateDefaultPracticalInfo();
    }
    
    // Métadonnées
    enhanced.metadata = {
      generated_at: new Date().toISOString(),
      total_faqs: enhanced.faq?.length || 0,
      coverage_score: 0.95,
      last_updated: new Date().toISOString(),
      version: '3.0'
    };
    
    return enhanced;
  }

  private generateDefaultFAQ(keyword: string): any[] {
    return [
      {
        question: `Quel est le prix d'un VTC ${keyword} ?`,
        answer: `Nos tarifs pour ${keyword} sont calculés en temps réel selon distance et demande. Comptez entre 60€ et 300€ pour un service premium avec Tesla.`,
        category: "pricing",
        keywords: ["prix", "coût", "tarif", keyword],
        priority: "high",
        followup_questions: ["Pour quelle destination ?", "Quand souhaitez-vous voyager ?"]
      },
      {
        question: "Comment réserver un VTC Tesla ?",
        answer: "Réservez facilement via WhatsApp au +33 6 16 55 28 11 ou directement via notre chatbot. Service disponible 24/7.",
        category: "service",
        keywords: ["réserver", "booking", "réservation"],
        priority: "high",
        followup_questions: ["Pour quand ?", "Combien de passagers ?"]
      },
      {
        question: "Les VTC sont-ils disponibles 24/7 ?",
        answer: "Oui ! Notre service est disponible 24h/24 et 7j/7. Réservation possible jusqu'à dernière minute.",
        category: "logistics",
        keywords: ["disponibilité", "24/7", "horaires"],
        priority: "medium",
        followup_questions: ["Pour quelle heure ?", "Quelle destination ?"]
      }
    ];
  }

  private generateDefaultPracticalInfo(): any {
    return {
      pricing: {
        base_rates: {
          nice_monaco: "80€",
          nice_cannes: "100€",
          airport_transfer: "60€"
        },
        factors: ["distance", "time", "demand", "vehicle_type"],
        payment_methods: ["carte", "espèces", "crypto", "entreprise"]
      },
      duration: {
        nice_monaco: "25 minutes",
        nice_cannes: "30 minutes",
        airport_downtown: "20 minutes"
      },
      availability: {
        operating_hours: "24/7",
        booking_advance: "Dernière minute",
        cancellation: "Gratuit jusqu'à 2h avant",
        guarantee: "Ponctualité garantie ou remboursé"
      },
      vehicles: {
        model_3: "4 passagers, 3 valises",
        model_s: "4 passagers, 4 valises", 
        model_x: "6 passagers, 5 valises",
        features: ["climatisation", "wifi", "bouteilles eau", "chargeurs usb"]
      }
    };
  }

  private generateFallbackKnowledge(keyword: string): KnowledgeBase {
    return {
      keyword,
      faq: this.generateDefaultFAQ(keyword),
      practical_info: this.generateDefaultPracticalInfo(),
      services: [
        {
          name: `Service spécial ${keyword}`,
          description: `Service VTC premium adapté à vos besoins ${keyword}`,
          included: ["Véhicule Tesla", "Chauffeur professionnel", "Wi-Fi gratuit"],
          optional: ["Champagne", "Journaux", "Enfants"],
          price_range: "60-300€"
        }
      ],
      objections: [
        {
          objection: "prix_élevé",
          response: "Notre service premium inclut véhicule Tesla, chauffeur professionnel et garantie ponctualité",
          technique: "value_demonstration",
          evidence: ["Tesla premium", "Chauffeur expert", "Service 24/7"]
        }
      ],
      additional_info: [
        {
          type: "conseil",
          title: "Conseil voyage",
          content: "Réservez à l'avance pour meilleurs tarifs et disponibilité garantie",
          usefulness: "économie et tranquillité"
        }
      ],
      metadata: {
        generated_at: new Date().toISOString(),
        total_faqs: 3,
        coverage_score: 0.7,
        last_updated: new Date().toISOString(),
        version: '3.0-fallback'
      }
    };
  }

  async updateKnowledgeWithNewInfo(keyword: string, newInfo: string): Promise<Partial<KnowledgeBase>> {
    const prompt = `
Mets à jour la base connaissances pour "${keyword}" avec ces nouvelles informations :

NOUVELLES INFORMATIONS :
${newInfo}

Génère les mises à jour nécessaires :
- Nouvelles FAQ si pertinent
- Informations pratiques modifiées
- Services additionnels
- Prix ou disponibilités mis à jour

FORMAT JSON :
{
  "updates": {
    "new_faqs": [...],
    "updated_pricing": {...},
    "new_services": [...],
    "urgent_info": "Information urgente si applicable"
  }
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 2000,
        temperature: 0.5,
        messages: [{ role: "user", content: prompt }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (error) {
      console.error('Error updating knowledge base:', error);
    }

    return {
      updates: {
        urgent_info: "Nouvelles informations en cours de traitement",
        new_faqs: [],
        updated_pricing: {},
        new_services: []
      }
    };
  }
}
