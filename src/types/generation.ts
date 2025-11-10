// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - TYPES GÉNÉRATION UNIFIÉE
// Définitions pour système génération IA + chatbot
// ═══════════════════════════════════════════════════════════

export interface GenerationOptions {
  language: string;
  targetAudience: 'premium' | 'business' | 'tourist';
  conversionFocus: 'whatsapp' | 'booking' | 'affiliation';
  includeChatbot: boolean;
  seoOptimization: boolean;
  imageGeneration: boolean;
}

export interface UnifiedGenerationResult {
  id: string;
  keyword: string;
  generatedAt: Date;
  webContent: WebContent;
  chatbotContent: ChatbotContent;
  seoFacebookContent: SEOFacebookContent;
  images: GeneratedImage[];
  metadata: GenerationMetadata;
}

export interface WebContent {
  keyword: string;
  title: string;
  description: string;
  content: string;
  sections: string[];
  seo: SEOData;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  openGraph?: OpenGraphData;
  structuredData?: StructuredData;
}

export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
}

export interface StructuredData {
  type: string;
  data: Record<string, any>;
}

export interface ChatbotContent {
  scenarios: any;
  knowledge: any;
  flows: any[];
  synced: any;
}

export interface SEOFacebookContent {
  pageContent: {
    title: string;
    description: string;
    content: string;
    structuredData: string;
    metaTags: any;
  };
  facebookIntegration: {
    reviewWidgets: string;
    socialProof: string;
    reviewPrompts: any;
    schemaMarkup: string;
  };
  localSEO: {
    facebookOptimized: boolean;
    socialSignals: any;
    reviewBacklinks: any[];
  };
}

export interface GeneratedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  size?: number;
  format?: string;
}

export interface GenerationMetadata {
  keyword: string;
  generatedAt: string;
  version: string;
  features: string[];
  coherenceScore?: number;
  conversionOptimized?: boolean;
  chatbotIntegrated?: boolean;
  seoScore?: number;
  conversionScore?: number;
  optimized?: boolean;
}

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
    [key: string]: any;
  }>;
}

export interface UpdatedResponses {
  greeting: string[];
  pricing: string[];
  services: string[];
  urgency: string[];
}

export interface GenerationResult {
  id: string;
  keyword: string;
  content: string;
  metadata: {
    generatedAt: Date;
    wordCount: number;
    seoScore: number;
    coherenceScore: number;
  };
}

export interface ImageGenerationResult {
  url: string;
  alt: string;
  width: number;
  height: number;
  size: number;
  format: string;
  optimized: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export interface OptimizationResult {
  originalScore: number;
  optimizedScore: number;
  improvements: string[];
  appliedChanges: string[];
}

export interface GenerationPipelineConfig {
  maxRetries: number;
  timeout: number;
  batchSize: number;
  rateLimitDelay: number;
  enableCache: boolean;
  enableOptimization: boolean;
}

export interface ContentAnalytics {
  pageViews: number;
  engagementRate: number;
  conversionRate: number;
  bounceRate: number;
  timeOnPage: number;
  chatbotInteractions: number;
  generatedAt: Date;
}

export interface PerformanceMetrics {
  generationTime: number;
  apiCallsCount: number;
  tokensUsed: number;
  cost: number;
  successRate: number;
  errorRate: number;
}

export interface AITestResult {
  testName: string;
  passed: boolean;
  score: number;
  details: string;
  recommendations: string[];
}
