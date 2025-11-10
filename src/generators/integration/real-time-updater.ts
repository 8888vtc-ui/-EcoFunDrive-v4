// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - MISE À JOUR TEMPS RÉEL
// Synchronisation automatique contenu ↔ chatbot
// ═══════════════════════════════════════════════════════════

import type { ContentChanges, UpdatedResponses } from '../../types/chatbot';

export class RealTimeUpdater {
  constructor() {
  }

  async updateChatbotWithNewContent(pageKeyword: string, newContent: string): Promise<void> {
    console.log(`🔄 Mise à jour chatbot pour: ${pageKeyword}`);

    try {
      // 1. Détecter changements dans contenu
      const changes = this.detectContentChanges(pageKeyword, newContent);
      console.log(`📊 Changements détectés: ${changes.changes.length}`);

      // 2. Générer nouvelles réponses chatbot
      const newResponses = await this.generateUpdatedResponses(changes);
      console.log(`💬 Nouvelles réponses générées: ${Object.keys(newResponses).length}`);

      // 3. Mettre à jour base connaissances
      await this.updateKnowledgeBase(pageKeyword, newResponses);

      // 4. Notifier chatbot actif
      await this.notifyActiveChats(pageKeyword, changes);

      // 5. Logger synchronisation
      this.logSyncUpdate(pageKeyword, changes);

      console.log(`✅ Chatbot mis à jour pour: ${pageKeyword}`);

    } catch (error) {
      console.error('❌ Erreur mise à jour chatbot:', error);
      throw error;
    }
  }

  private detectContentChanges(pageKeyword: string, newContent: string): ContentChanges {
    const changes: ContentChanges = {
      pageKeyword,
      changes: []
    };

    // Détecter changements de prix
    const priceChanges = this.detectPriceChanges(newContent);
    if (priceChanges.length > 0) {
      changes.changes.push(...priceChanges);
    }

    // Détecter changements de services
    const serviceChanges = this.detectServiceChanges(newContent);
    if (serviceChanges.length > 0) {
      changes.changes.push(...serviceChanges);
    }

    // Détecter changements de disponibilité
    const availabilityChanges = this.detectAvailabilityChanges(newContent);
    if (availabilityChanges.length > 0) {
      changes.changes.push(...availabilityChanges);
    }

    // Détecter changements d'information
    const infoChanges = this.detectInformationChanges(newContent);
    if (infoChanges.length > 0) {
      changes.changes.push(...infoChanges);
    }

    return changes;
  }

  private detectPriceChanges(content: string): any[] {
    const changes: any[] = [];
    
    // Patterns de prix
    const pricePatterns = [
      { pattern: /(\d+)€/g, type: 'price_eur' },
      { pattern: /(\d+)\s*euros?/gi, type: 'price_euros' },
      { pattern: /(\d+)\s*eur/gi, type: 'price_eur' }
    ];

    pricePatterns.forEach(({ pattern, type }) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const price = match.replace(/[^\d]/g, '');
          changes.push({
            type: 'price',
            oldValue: null,
            newValue: `${price}€`,
            impact: price > '100' ? 'high' : 'medium',
            price_type: type
          });
        });
      }
    });

    return changes;
  }

  private detectServiceChanges(content: string): any[] {
    const changes: any[] = [];
    
    // Services à surveiller
    const serviceKeywords = [
      'transfert aéroport',
      'service 24/7',
      'réservation dernière minute',
      'voiture Tesla',
      'chauffeur professionnel',
      'wifi gratuit',
      'bouteilles eau',
      'chargeurs usb'
    ];

    serviceKeywords.forEach(service => {
      if (content.toLowerCase().includes(service)) {
        changes.push({
          type: 'service',
          oldValue: null,
          newValue: service,
          impact: 'medium',
          service_name: service
        });
      }
    });

    return changes;
  }

  private detectAvailabilityChanges(content: string): any[] {
    const changes: any[] = [];
    
    // Indicateurs de disponibilité
    const availabilityPatterns = [
      { pattern: /disponible.*immédiatement/i, status: 'immediate', impact: 'high' },
      { pattern: /disponible.*maintenant/i, status: 'now', impact: 'high' },
      { pattern: /réservation.*dernière.*minute/i, status: 'last_minute', impact: 'medium' },
      { pattern: /24\/7|24h.*24/i, status: '24_7', impact: 'medium' },
      { pattern: /plus.*que.*(\d+).*véhicules/i, status: 'limited', impact: 'high' }
    ];

    availabilityPatterns.forEach(({ pattern, status, impact }) => {
      const match = content.match(pattern);
      if (match) {
        changes.push({
          type: 'availability',
          oldValue: null,
          newValue: status,
          impact,
          availability_status: status,
          matched_text: match[0]
        });
      }
    });

    return changes;
  }

  private detectInformationChanges(content: string): any[] {
    const changes: any[] = [];
    
    // Informations importantes
    const infoPatterns = [
      { pattern: /nouveau.*service|service.*nouveau/i, type: 'new_service', impact: 'high' },
      { pattern: /promotion|offre.*spéciale|réduction/i, type: 'promotion', impact: 'high' },
      { pattern: /événement.*spécial|spécial.*événement/i, type: 'event', impact: 'medium' },
      { pattern: /temporairement.*indisponible|indisponible.*temporairement/i, type: 'unavailable', impact: 'high' },
      { pattern: /horaires.*modifiés|modifiés.*horaires/i, type: 'schedule_change', impact: 'medium' }
    ];

    infoPatterns.forEach(({ pattern, type, impact }) => {
      const match = content.match(pattern);
      if (match) {
        changes.push({
          type: 'information',
          oldValue: null,
          newValue: match[0],
          impact,
          info_type: type,
          details: match[0]
        });
      }
    });

    return changes;
  }

  private async generateUpdatedResponses(changes: ContentChanges): Promise<UpdatedResponses> {
    console.log('💬 Génération réponses mises à jour...');

    const responses: UpdatedResponses = {
      greeting: [],
      pricing: [],
      services: [],
      urgency: []
    };

    // Générer réponses pour les changements de prix
    const priceChanges = changes.changes.filter(c => c.type === 'price');
    if (priceChanges.length > 0) {
      responses.pricing = [
        `💰 Nouveaux tarifs disponibles ! ${priceChanges.map(c => c.newValue).join(' - ')}`,
        `📊 Mise à jour prix : ${priceChanges[0].newValue} - Réservation maintenant !`,
        `💡 Tarif actualisé : ${priceChanges[0].newValue} pour service premium`
      ];
    }

    // Générer réponses pour les changements de services
    const serviceChanges = changes.changes.filter(c => c.type === 'service');
    if (serviceChanges.length > 0) {
      responses.services = [
        `🚗 Nouveau service : ${serviceChanges[0].newValue} !`,
        `✨ Découvrez notre service : ${serviceChanges[0].newValue}`,
        `🎯 Service additionnel : ${serviceChanges[0].newValue}`
      ];
    }

    // Générer réponses pour les changements de disponibilité
    const availabilityChanges = changes.changes.filter(c => c.type === 'availability');
    if (availabilityChanges.length > 0) {
      responses.urgency = [
        `⚡ ${availabilityChanges[0].matched_text} - Réservez maintenant !`,
        `🔥 Disponibilité : ${availabilityChanges[0].newValue} - Action immédiate !`,
        `📢 Mise à jour : ${availabilityChanges[0].matched_text}`
      ];
    }

    // Générer réponses d'accueil générales
    const highImpactChanges = changes.changes.filter(c => c.impact === 'high');
    if (highImpactChanges.length > 0) {
      responses.greeting = [
        `👋 Bonjour ! Nouveautés disponibles : ${highImpactChanges.length} mises à jour`,
        `🆕 Service mis à jour : Découvrez nos nouveautés !`,
        `✨ Mise à jour du jour : ${highImpactChanges[0].newValue}`
      ];
    }

    return responses;
  }

  private async updateKnowledgeBase(pageKeyword: string, responses: UpdatedResponses): Promise<void> {
    console.log('📚 Mise à jour base connaissances...');

    try {
      // Simuler mise à jour base de connaissances
      const updateData = {
        keyword: pageKeyword,
        new_responses: responses,
        updated_at: new Date().toISOString(),
        response_count: Object.values(responses).flat().length
      };

      console.log(`✅ Base connaissances mise à jour: ${updateData.response_count} nouvelles réponses`);
      
      // Dans une vraie implémentation, ceci would sauvegarder en base de données
      // await this.knowledgeBase.update(pageKeyword, updateData);

    } catch (error) {
      console.error('❌ Erreur mise à jour base connaissances:', error);
      throw error;
    }
  }

  private async notifyActiveChats(pageKeyword: string, changes: ContentChanges): Promise<void> {
    console.log('📢 Notification chats actifs...');

    try {
      // Identifier les changements à haute priorité
      const highPriorityChanges = changes.changes.filter(c => c.impact === 'high');
      
      if (highPriorityChanges.length > 0) {
        // Préparer notification
        const notification = {
          pageKeyword,
          changes: highPriorityChanges,
          message: `🆕 Mise à jour importante : ${highPriorityChanges[0].newValue}`,
          timestamp: new Date().toISOString(),
          requires_immediate_action: highPriorityChanges.some(c => c.type === 'availability')
        };

        console.log(`📬 Notification envoyée: ${notification.message}`);
        
        // Dans une vraie implémentation:
        // await this.chatbotService.broadcastUpdate(notification);
        // await this.websocketManager.notifyClients(notification);
      }

    } catch (error) {
      console.error('❌ Erreur notification chats:', error);
      // Ne pas throw pour ne pas bloquer le processus
    }
  }

  private logSyncUpdate(pageKeyword: string, changes: ContentChanges): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      pageKeyword,
      changesCount: changes.changes.length,
      highImpactCount: changes.changes.filter(c => c.impact === 'high').length,
      changeTypes: [...new Set(changes.changes.map(c => c.type))],
      syncDuration: Date.now() - new Date().getTime()
    };

    console.log('📊 Log synchronisation:', logEntry);
    
    // Dans une vraie implémentation:
    // await this.analyticsService.trackSyncUpdate(logEntry);
    // await this.logger.info('Chatbot sync update', logEntry);
  }

  // Méthode de surveillance continue
  async startContinuousMonitoring(keywords: string[]): Promise<void> {
    console.log(`🔍 Démarrage monitoring continu pour ${keywords.length} keywords`);

    const monitoringInterval = setInterval(async () => {
      for (const keyword of keywords) {
        try {
          // Vérifier si le contenu a changé
          const hasChanges = await this.checkForContentChanges(keyword);
          
          if (hasChanges) {
            console.log(`🔄 Changements détectés pour: ${keyword}`);
            // Mettre à jour automatiquement
            // await this.updateChatbotWithNewContent(keyword, newContent);
          }
        } catch (error) {
          console.error(`❌ Erreur monitoring ${keyword}:`, error);
        }
      }
    }, 60000); // Vérifier chaque minute

    // Arrêter le monitoring après 24h (pour la démo)
    setTimeout(() => {
      clearInterval(monitoringInterval);
      console.log('⏹️ Monitoring continu arrêté');
    }, 24 * 60 * 60 * 1000);
  }

  private async checkForContentChanges(_keyword: string): Promise<boolean> {
    // Simuler vérification de changements
    // Dans une vraie implémentation, ceci vérifierait:
    // - Modifications de fichiers
    // - Changements en base de données
    // - Mises à jour API
    // - Changements manuels
    
    return Math.random() > 0.8; // 20% de chance de changements pour la démo
  }

  // Méthode de mise à jour manuelle
  async forceUpdate(pageKeyword: string, updateData: any): Promise<void> {
    console.log(`🔄 Mise à jour forcée pour: ${pageKeyword}`);

    try {
      const changes: ContentChanges = {
        pageKeyword,
        changes: [
          {
            type: 'information',
            oldValue: null,
            newValue: updateData.message || 'Mise à jour manuelle',
            impact: updateData.impact || 'medium'
          }
        ]
      };

      const responses = await this.generateUpdatedResponses(changes);
      await this.updateKnowledgeBase(pageKeyword, responses);
      await this.notifyActiveChats(pageKeyword, changes);
      this.logSyncUpdate(pageKeyword, changes);

      console.log(`✅ Mise à jour forcée terminée pour: ${pageKeyword}`);

    } catch (error) {
      console.error('❌ Erreur mise à jour forcée:', error);
      throw error;
    }
  }
}
