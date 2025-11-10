// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - PONT CONTEXTUEL CONTENU ↔ CHATBOT
// Synchronisation intelligente entre contenu web et chatbot
// ═══════════════════════════════════════════════════════════

import type { ConversationScenario, SyncedContent, MappedScenarios, WebEntities } from '../../types/chatbot';

export class ContextBridge {
  async syncContentWithChatbot(generatedContent: any, chatbotScenarios: ConversationScenario): Promise<SyncedContent> {
    console.log('🔄 Synchronisation contenu ↔ chatbot...');

    // Extraction entités du contenu web
    const webEntities = this.extractWebEntities(generatedContent);
    
    // Mapping avec scénarios chatbot
    const mappedScenarios = this.mapWebToChatbot(webEntities, chatbotScenarios);
    
    // Génération variations contextuelles
    const contextualVariations = await this.generateContextualVariations(webEntities, mappedScenarios);
    
    const syncedContent: SyncedContent = {
      webContent: generatedContent,
      chatbotScenarios: contextualVariations,
      syncMetadata: {
        lastSync: new Date(),
        entityCount: Object.keys(webEntities).length,
        scenarioCount: Object.keys(contextualVariations).length,
        coherenceScore: this.calculateCoherence(generatedContent, contextualVariations)
      }
    };

    console.log(`✅ Synchronisation terminée: ${syncedContent.syncMetadata.entityCount} entités, ${syncedContent.syncMetadata.scenarioCount} scénarios`);
    
    return syncedContent;
  }

  private extractWebEntities(content: any): WebEntities {
    const entities: WebEntities = {
      destinations: this.extractDestinations(content),
      prices: this.extractPrices(content),
      services: this.extractServices(content),
      features: this.extractFeatures(content),
      urgency: this.extractUrgency(content)
    };

    console.log(`📊 Entités extraites: ${JSON.stringify(entities, null, 2)}`);
    return entities;
  }

  private extractDestinations(content: any): string[] {
    // Extraction intelligente des destinations
    const destinations: string[] = [];
    
    if (content.keyword) {
      destinations.push(content.keyword);
    }
    
    // Patterns de destinations Côte d'Azur
    const destinationPatterns = [
      /nice|niça/i,
      /monaco|moneghetti/i,
      /cannes|cannet/i,
      /saint.*tropez|st.*tropez/i,
      /antibes|juan.*les.*pins/i,
      /menton|roquebrune/i,
      /aéroport.*nice|nice.*airport/i
    ];

    const text = content.content + ' ' + content.description;
    
    destinationPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        destinations.push(...matches.map(m => m.toLowerCase()));
      }
    });

    return [...new Set(destinations)]; // Déduplication
  }

  private extractPrices(content: any): Record<string, string> {
    const prices: Record<string, string> = {};
    
    // Patterns de prix
    const pricePatterns = [
      /(\d+)€/g,
      /(\d+)\s*euros?/gi,
      /(\d+)\s*eur/gi
    ];

    const text = content.content || '';
    
    pricePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match: string, index: number) => {
          const price = match.replace(/[^\d]/g, '');
          prices[`price_${index}`] = `${price}€`;
        });
      }
    });

    // Prix par défaut si aucun trouvé
    if (Object.keys(prices).length === 0) {
      prices.default = "60-300€";
    }

    return prices;
  }

  private extractServices(content: any): string[] {
    const services: string[] = [];
    
    // Services VTC communs
    const servicePatterns = [
      /transfert|transfer/i,
      /aéroport|airport/i,
      /gare|station/i,
      /hôtel|hotel/i,
      /restaurant/i,
      /événement|event/i,
      /affaire|business/i,
      /tourisme|tour/i,
      /première.*classe|first.*class/i,
      /luxe|luxury/i
    ];

    const text = content.content + ' ' + (content.sections?.join(' ') || '');
    
    servicePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        services.push(...matches.map(m => m.toLowerCase()));
      }
    });

    return [...new Set(services)];
  }

  private extractFeatures(content: any): string[] {
    const features: string[] = [];
    
    // Features Tesla/VTC
    const featurePatterns = [
      /tesla|model.*3|model.*s|model.*x/i,
      /wifi|connexion/i,
      /climatisation|air.*conditioning/i,
      /chargeur|usb|charging/i,
      /bouteille.*eau|water/i,
      /chauffeur|driver/i,
      /disponible.*24\/7|24\/7.*available/i,
      /réservation|booking/i,
      /paiement|payment/i
    ];

    const text = content.content + ' ' + content.description;
    
    featurePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        features.push(...matches.map(m => m.toLowerCase()));
      }
    });

    return [...new Set(features)];
  }

  private extractUrgency(content: any): string[] {
    const urgency: string[] = [];
    
    // Indicateurs d'urgence
    const urgencyPatterns = [
      /immédiat|immediate/i,
      /dernière.*minute|last.*minute/i,
      /urgence|urgent/i,
      /disponible.*maintenant|available.*now/i,
      /rapide|fast|quick/i
    ];

    const text = content.content + ' ' + content.description;
    
    urgencyPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        urgency.push(...matches.map(m => m.toLowerCase()));
      }
    });

    return [...new Set(urgency)];
  }

  private mapWebToChatbot(entities: WebEntities, scenarios: ConversationScenario): MappedScenarios {
    const mapped: MappedScenarios = {
      pricing: this.enhancePricingScenarios(entities.prices, scenarios.scenarios.pricing),
      booking: this.enhanceBookingScenarios(entities.destinations, scenarios.scenarios.booking),
      services: this.enhanceServiceScenarios(entities.services, scenarios.scenarios.greeting),
      urgency: this.enhanceUrgencyScenarios(entities.urgency, scenarios.scenarios.urgency)
    };

    console.log(`🗺️ Scénarios mappés: ${Object.keys(mapped).length} catégories`);
    return mapped;
  }

  private enhancePricingScenarios(prices: Record<string, string>, pricingScenarios: any[]): any[] {
    return pricingScenarios.map(scenario => ({
      ...scenario,
      text: scenario.text.replace(/{price_range}/g, Object.values(prices).join(' - ')),
      dynamic_pricing: prices
    }));
  }

  private enhanceBookingScenarios(destinations: string[], bookingScenarios: any[]): any[] {
    return bookingScenarios.map(scenario => ({
      ...scenario,
      destinations: destinations,
      text: scenario.text.replace(/{destination}/g, destinations.join(', '))
    }));
  }

  private enhanceServiceScenarios(services: string[], greetingScenarios: any[]): any[] {
    return greetingScenarios.map(scenario => ({
      ...scenario,
      services: services,
      text: scenario.text.replace(/{services}/g, services.join(', '))
    }));
  }

  private enhanceUrgencyScenarios(urgency: string[], urgencyScenarios: any[]): any[] {
    return urgencyScenarios.map(scenario => ({
      ...scenario,
      urgency_indicators: urgency,
      text: scenario.text.replace(/{urgency}/g, urgency.join(', '))
    }));
  }

  private async generateContextualVariations(entities: WebEntities, mappedScenarios: MappedScenarios): Promise<any> {
    const variations: any = {
      ...mappedScenarios,
      contextual_responses: this.generateContextualResponses(entities),
      dynamic_ctas: this.generateDynamicCTAs(entities),
      personalized_messages: this.generatePersonalizedMessages(entities)
    };

    console.log('🎨 Variations contextuelles générées');
    return variations;
  }

  private generateContextualResponses(entities: WebEntities): string[] {
    const responses: string[] = [];
    
    // Réponses basées sur les destinations
    if (entities.destinations.length > 0) {
      responses.push(`📍 Service VTC disponible pour: ${entities.destinations.join(', ')}`);
    }
    
    // Réponses basées sur les prix
    if (Object.keys(entities.prices).length > 0) {
      responses.push(`💰 Tarifs: ${Object.values(entities.prices).join(' - ')}`);
    }
    
    // Réponses basées sur les services
    if (entities.services.length > 0) {
      responses.push(`🚗 Services: ${entities.services.join(', ')}`);
    }

    return responses;
  }

  private generateDynamicCTAs(entities: WebEntities): any[] {
    const ctas: any[] = [];
    
    // CTA WhatsApp personnalisé
    ctas.push({
      type: 'whatsapp',
      text: '📱 Réserver par WhatsApp',
      message: `https://wa.me/33616552811?text=Bonjour%20VTC%20${entities.destinations[0] || 'Côte d\'Azur'}`,
      priority: 'high'
    });
    
    // CTA Devis si prix détectés
    if (Object.keys(entities.prices).length > 0) {
      ctas.push({
        type: 'quote',
        text: '💰 Devis personnalisé',
        action: 'show_pricing_calculator',
        priority: 'medium'
      });
    }

    return ctas;
  }

  private generatePersonalizedMessages(entities: WebEntities): string[] {
    const messages: string[] = [];
    
    // Message personnalisé selon destination principale
    if (entities.destinations.length > 0) {
      const mainDestination = entities.destinations[0];
      messages.push(`🚗 VTC Tesla Premium pour ${mainDestination} - Service immédiat disponible !`);
    }
    
    // Message selon services détectés
    if (entities.services.includes('aéroport')) {
      messages.push('✈️ Transfert aéroport : Chauffeur attend votre arrivée !');
    }
    
    if (entities.services.includes('luxe')) {
      messages.push('💎 Service luxe : Véhicules Tesla premium avec chauffeurs professionnels.');
    }

    return messages;
  }

  private calculateCoherence(webContent: any, _chatbotScenarios: any): number {
    // Calcul score de cohérence entre contenu web et scénarios chatbot
    let coherenceScore = 0.5; // Base score
    
    // Bonus si destinations correspondent
    const webDestinations = this.extractDestinations(webContent);
    if (webDestinations.length > 0) {
      coherenceScore += 0.2;
    }
    
    // Bonus si prix sont cohérents
    const webPrices = this.extractPrices(webContent);
    if (Object.keys(webPrices).length > 0) {
      coherenceScore += 0.15;
    }
    
    // Bonus si services correspondent
    const webServices = this.extractServices(webContent);
    if (webServices.length > 2) {
      coherenceScore += 0.15;
    }
    
    return Math.min(coherenceScore, 1.0); // Maximum 1.0
  }
}
