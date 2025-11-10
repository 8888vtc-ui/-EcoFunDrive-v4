// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - TYPES CHATBOT
// Définitions de types pour système conversationnel
// ═══════════════════════════════════════════════════════════

export interface ExtractedEntities {
  departure?: string;
  destination?: string;
  date?: string;
  time?: string;
  passengers?: number;
  vehicleType?: string;
  urgency?: 'immediate' | 'within_30min' | 'same_day' | 'custom';
  budget?: number;
  specialRequests?: string[];
}

export interface ConversationScenario {
  keyword: string;
  contentType: string;
  scenarios: {
    greeting: Array<{
      text: string;
      variables: string[];
      next_intent: string;
    }>;
    qualification: Array<{
      question: string;
      type: 'destination' | 'date' | 'passengers' | 'vehicle' | 'urgency';
      required: boolean;
    }>;
    pricing: Array<{
      text: string;
      price_range: string;
      factors: string[];
    }>;
    booking: Array<{
      step: number;
      text: string;
      action: 'collect_info' | 'confirm' | 'payment';
    }>;
    urgency: Array<{
      text: string;
      availability: 'immediate' | 'within_30min' | 'custom';
      incentive: string;
    }>;
    objections: Array<{
      objection: string;
      response: string;
      technique: string;
    }>;
    upselling: Array<{
      offer: string;
      price: string;
      value: string;
    }>;
    conversion: Array<{
      cta: string;
      message: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    facebook_review: Array<{
      timing: 'after_booking' | 'follow_up_24h' | 'reminder_48h';
      message: string;
      incentive: string;
      link: string;
    }>;
  };
  metadata: {
    generated_at: string;
    coherence_score: number;
    conversion_optimized: boolean;
    version: string;
  };
}

export interface KnowledgeBase {
  keyword: string;
  faq: Array<{
    question: string;
    answer: string;
    category: 'pricing' | 'service' | 'logistics' | 'vehicle' | 'contact';
    keywords: string[];
    priority: 'high' | 'medium' | 'low';
    followup_questions: string[];
  }>;
  practical_info: {
    pricing: {
      base_rates: Record<string, string>;
      factors: string[];
      payment_methods: string[];
    };
    duration: Record<string, string>;
    availability: {
      operating_hours: string;
      booking_advance: string;
      cancellation: string;
      guarantee: string;
    };
    vehicles: {
      model_3: string;
      model_s: string;
      model_x: string;
      features: string[];
    };
  };
  services: Array<{
    name: string;
    description: string;
    included: string[];
    optional: string[];
    price_range: string;
  }>;
  objections: Array<{
    objection: string;
    response: string;
    technique: string;
    evidence: string[];
  }>;
  additional_info: Array<{
    type: 'conseil' | 'information' | 'service';
    title: string;
    content: string;
    usefulness: string;
  }>;
  metadata: {
    generated_at: string;
    total_faqs: number;
    coverage_score: number;
    last_updated: string;
    version: string;
  };
}

export interface ChatbotGeneration {
  scenarios: ConversationScenario;
  responses: string[];
  flows: ConversationFlow[];
  generatedAt: Date;
  coherenceScore: number;
}

export interface ConversationFlow {
  id: string;
  name: string;
  steps: ConversationStep[];
  entry_points: string[];
  exit_points: string[];
}

export interface ConversationStep {
  id: string;
  type: 'question' | 'response' | 'action' | 'conditional';
  content: string;
  next_steps: string[];
  conditions?: Record<string, any>;
  actions?: string[];
}

export interface Message {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  entities?: ExtractedEntities;
  intent?: string;
}

export interface ConversationState {
  current_step: string;
  collected_info: Partial<ExtractedEntities>;
  intent_history: string[];
  conversion_score: number;
}

export interface ChatbotAnalytics {
  conversation_id: string;
  user_id: string;
  intent: string;
  duration: number;
  messages_count: number;
  converted: boolean;
  convertedValue: number;
  satisfaction_score?: number;
}

export interface SyncedContent {
  webContent: any;
  chatbotScenarios: any;
  syncMetadata: {
    lastSync: Date;
    entityCount: number;
    scenarioCount: number;
    coherenceScore: number;
  };
}

export interface ContentChanges {
  pageKeyword: string;
  changes: Array<{
    type: 'price' | 'service' | 'availability' | 'information';
    oldValue: any;
    newValue: any;
    impact: 'high' | 'medium' | 'low';
    matched_text?: string;
    [key: string]: any;
  }>;
}

export interface UpdatedResponses {
  greeting: string[];
  pricing: string[];
  services: string[];
  urgency: string[];
}

export interface BotOptimization {
  type: 'response_improvement' | 'flow_optimization' | 'new_intent';
  intent?: string;
  suggestion: string;
  potential_impact: string;
}

export interface FullConversation {
  id: string;
  userId: string;
  messages: Message[];
  primaryIntent: string;
  duration: number;
  converted: boolean;
  convertedValue: number;
  startedAt: Date;
  endedAt: Date;
}

export type IntentType = 'BOOKING' | 'PRICING' | 'INFORMATION' | 'SUPPORT' | 'URGENT' | 'UNKNOWN';

export interface WebEntities {
  destinations: string[];
  prices: Record<string, string>;
  services: string[];
  features: string[];
  urgency: string[];
}

export interface MappedScenarios {
  pricing: any[];
  booking: any[];
  services: any[];
  urgency: any[];
}

export interface FacebookReview {
  timing: 'after_booking' | 'follow_up_24h' | 'reminder_48h';
  message: string;
  incentive: string;
  link: string;
}
