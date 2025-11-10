// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - GÉNÉRATEUR FLOWS CONVERSATIONNELS
// Création de flows conversationnels optimisés conversion
// ═══════════════════════════════════════════════════════════

import type { ConversationFlow } from '../../types/chatbot';

export class FlowGenerator {
  async generateConversationFlows(keyword: string): Promise<ConversationFlow[]> {
    const flows: ConversationFlow[] = [
      {
        id: 'booking_flow',
        name: `Flow Réservation ${keyword}`,
        steps: [
          {
            id: 'welcome',
            type: 'response' as const,
            content: `👋 Bienvenue ! Service VTC Tesla Premium pour ${keyword}. Quelle destination ?`,
            next_steps: ['collect_destination'],
            actions: ['show_vehicle_options']
          },
          {
            id: 'collect_destination',
            type: 'question' as const,
            content: '📍 Quelle est votre destination exacte ?',
            next_steps: ['collect_date'],
            conditions: { required: ['destination'] } as const
          },
          {
            id: 'collect_date',
            type: 'question' as const,
            content: '📅 Pour quelle date et heure ?',
            next_steps: ['collect_passengers'],
            conditions: { required: ['date', 'time'] } as const
          },
          {
            id: 'collect_passengers',
            type: 'question' as const,
            content: '👥 Combien de passagers ? (1-6)',
            next_steps: ['calculate_price'],
            conditions: { required: ['passengers'] } as const
          },
          {
            id: 'calculate_price',
            type: 'response' as const,
            content: '💰 Je calcule votre tarif personnalisé...',
            next_steps: ['show_price'],
            actions: ['calculate_pricing']
          },
          {
            id: 'show_price',
            type: 'response' as const,
            content: '✅ Tarif calculé : {price}€ - Durée : {duration} minutes',
            next_steps: ['confirm_booking'],
            actions: ['show_vehicle_image']
          },
          {
            id: 'confirm_booking',
            type: 'question' as const,
            content: 'Confirmez-vous la réservation ?',
            next_steps: ['whatsapp_transfer', 'collect_payment'],
            conditions: { required: ['confirmation'] } as const
          },
          {
            id: 'whatsapp_transfer',
            type: 'action' as const,
            content: '📱 Transfert vers WhatsApp pour finalisation...',
            next_steps: [],
            actions: ['open_whatsapp', 'send_booking_details']
          }
        ],
        entry_points: ['welcome'],
        exit_points: ['whatsapp_transfer', 'collect_payment']
      },
      {
        id: 'pricing_flow',
        name: `Flow Devis ${keyword}`,
        steps: [
          {
            id: 'pricing_welcome',
            type: 'response' as const,
            content: `💰 Devis gratuit pour ${keyword}. Dites-moi votre trajet !`,
            next_steps: ['get_route']
          },
          {
            id: 'get_route',
            type: 'question' as const,
            content: '📍 Départ et destination ?',
            next_steps: ['show_pricing_options'],
            conditions: { required: ['departure', 'destination'] } as const
          },
          {
            id: 'show_pricing_options',
            type: 'response' as const,
            content: '🚗 Options disponibles :\n• Model 3 : {price_model3}€\n• Model S : {price_models}€',
            next_steps: ['suggest_whatsapp'],
            actions: ['show_comparison']
          },
          {
            id: 'suggest_whatsapp',
            type: 'question' as const,
            content: 'Souhaitez-vous recevoir le devis complet par WhatsApp ?',
            next_steps: ['send_whatsapp_quote'],
            conditions: { required: ['whatsapp_preference'] } as const
          }
        ],
        entry_points: ['pricing_welcome'],
        exit_points: ['send_whatsapp_quote']
      }
    ];

    return flows;
  }

  generateUrgencyFlow(keyword: string): ConversationFlow {
    return {
      id: 'urgency_flow',
      name: `Flow Urgence ${keyword}`,
      steps: [
        {
          id: 'urgency_detected',
          type: 'response' as const,
          content: '🚗 DÉTECTION URGENCE ! Véhicule disponible immédiatement',
          next_steps: ['get_urgent_destination'],
          actions: ['show_live_availability', 'start_5min_timer']
        },
        {
          id: 'get_urgent_destination',
          type: 'question' as const,
          content: '📍 Destination immédiate ?',
          next_steps: ['confirm_urgent_booking'],
          conditions: { required: ['destination'], timeout: '2min' } as const
        },
        {
          id: 'confirm_urgent_booking',
          type: 'response' as const,
          content: '⚡ RÉSERVATION URGENTE CONFIRMÉE ! Chauffeur en route...',
          next_steps: ['whatsapp_immediate'],
          actions: ['send_driver_location', 'start_tracking']
        }
      ],
      entry_points: ['urgency_detected'],
      exit_points: ['whatsapp_immediate']
    };
  }
}
