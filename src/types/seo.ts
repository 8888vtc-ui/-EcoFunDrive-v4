// ECOFUNDRIVE V3 - Types SEO
// Définitions de types pour l'ensemble du système SEO

// Types pour la structure de contenu
export interface ContentStructure {
  title: string;
  metaDescription: string;
  keywords: string[];
  sections: ContentSection[];
  totalWordCount: number;
  estimatedReadTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tone: string;
  targetAudience: string;
}

export interface ContentSection {
  title: string;
  wordCount: number;
  keywords?: string[];
  type: 'introduction' | 'content' | 'conclusion' | 'faq';
  content?: string;
  html?: string;
}

// Types pour les résultats de génération
export interface GenerationSection {
  title: string;
  content: string;
  html: string;
  wordCount: number;
  keywords: string[];
  type: 'introduction' | 'content' | 'conclusion' | 'faq';
  readabilityScore: number;
  hasCallToAction?: boolean;
  internalLinks?: string[];
  images?: GeneratedImage[];
}

// Types pour les images
export interface GeneratedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  size: number; // en KB
  format: 'webp' | 'avif' | 'jpg';
  attribution?: string;
  prompt: string;
  model: string;
}

// Types pour les pages SEO
export interface PageSEO {
  url: string;
  title?: string;
  description?: string;
  keywords?: string[];
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: PageImage[];
  noIndex?: boolean;
  noFollow?: boolean;
  noArchive?: boolean;
  noSnippet?: boolean;
  noImageIndex?: boolean;
  notranslate?: boolean;
  ogType?: 'website' | 'article' | 'product' | 'service';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app';
  twitterImage?: string;
  imageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  schemaType?: 'WebPage' | 'LocalBusiness' | 'Service' | 'Article';
  queryParams?: Record<string, string>;
  languages?: string[];
}

export interface PageImage {
  url: string;
  title?: string;
  caption?: string;
}

// Types pour la configuration SEO fondamentale
export interface SEOFundamentalConfig {
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  ogImage: string;
  twitterCard: string;
  favicon: string;
  language: string;
  author: string;
  keywords: string[];
}

// Types pour la validation SEO
export interface SEOIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  impact: string;
  solution: string;
  location?: string;
  snippet?: string;
}

export interface SEOMetrics {
  wordCount: number;
  keywordDensity: number;
  readabilityScore: number;
  titleLength: number;
  metaDescriptionLength: number;
  headingCount: {
    h1: number;
    h2: number;
    h3: number;
  };
  imageCount: number;
  internalLinks: number;
  externalLinks: number;
}

export interface SEOResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  issues: SEOIssue[];
  metrics: SEOMetrics;
  recommendations: string[];
  passedChecks: string[];
  failedChecks: string[];
}

// Types pour le pipeline
export interface GenerationMetrics {
  generationTime: number;
  totalTime: number;
  wordCount: number;
  imageCount: number;
  seoScore: number;
  attempts: number;
}

export interface GenerationResult {
  keyword: string;
  structure: ContentStructure;
  sections: GenerationSection[];
  images: GeneratedImage[];
  content: string;
  seoResult: SEOResult;
  metrics: GenerationMetrics;
  status: 'success' | 'partial' | 'failed';
  url?: string;
  timestamp?: string;
}

// Types pour la configuration
export interface PipelineConfig {
  maxAttempts: number;
  minSEOScore: number;
  enableImages: boolean;
  enableOptimization: boolean;
  parallelGeneration: boolean;
  timeoutMs?: number;
}

export interface SEOConfig {
  content: {
    minWords: number;
    maxWords: number;
    keywordDensityMin: number;
    keywordDensityMax: number;
    readabilityMin: number;
  };
  title: {
    minLength: number;
    maxLength: number;
    keywordPosition: number;
  };
  metaDescription: {
    minLength: number;
    maxLength: number;
  };
  headings: {
    h1: { min: number; max: number };
    h2: { min: number; max: number };
    h3: { min: number; max: number };
  };
  images: {
    minCount: number;
    maxCount: number;
    altRequired: boolean;
    maxSizeKB: number;
  };
  links: {
    internalMin: number;
    internalMax: number;
    externalMin: number;
    externalMax: number;
  };
}

// Types pour les APIs
export interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface ReplicateConfig {
  apiKey: string;
  model: string;
  input: Record<string, any>;
}

// Types pour le monitoring
export interface PerformanceMetrics {
  timestamp: string;
  keyword: string;
  generationTime: number;
  seoScore: number;
  wordCount: number;
  imageCount: number;
  attempts: number;
  cost: number;
  status: string;
}

export interface BatchStats {
  total: number;
  successful: number;
  successRate: number;
  averageSEOScore: number;
  totalWords: number;
  averageWords: number;
  totalTime: number;
  averageTime: number;
  costEstimate: number;
}

// Types pour les erreurs
export interface GenerationError {
  type: 'api_error' | 'validation_error' | 'timeout' | 'rate_limit' | 'unknown';
  message: string;
  details?: any;
  timestamp: string;
  retryable: boolean;
}

// Types pour le cache
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // en secondes
  maxSize: number; // nombre d'entrées
  strategy: 'lru' | 'fifo' | 'lfu';
}

// Types pour les templates
export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  category: 'structure' | 'content' | 'optimization' | 'validation';
}

export interface ImagePromptTemplate {
  id: string;
  name: string;
  template: string;
  style: string;
  aspectRatio: string;
  quality: number;
}

// Types pour le déploiement
export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  siteUrl: string;
  netlifyToken: string;
  netlifySiteId: string;
  enableEdgeCache: boolean;
  imageQuality: number;
}

export interface DeploymentResult {
  url: string;
  status: 'success' | 'failed';
  deployId: string;
  timestamp: string;
  metrics?: {
    buildTime: number;
    deployTime: number;
    size: number;
  };
}

// Types pour les événements
export interface GenerationEvent {
  type: 'start' | 'progress' | 'complete' | 'error';
  keyword: string;
  step: string;
  progress: number;
  data?: any;
  timestamp: string;
}

export interface MonitoringEvent {
  type: 'performance' | 'error' | 'warning' | 'info';
  message: string;
  data?: any;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Types utilitaires
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Types pour les enums
export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum Grade {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F'
}

// Types pour les constantes
export const DEFAULT_CONFIG: PipelineConfig = {
  maxAttempts: 2,
  minSEOScore: 90,
  enableImages: true,
  enableOptimization: true,
  parallelGeneration: true,
  timeoutMs: 300000 // 5 minutes
};

export const SEO_RULES: SEOConfig = {
  content: {
    minWords: 2000,
    maxWords: 2600,
    keywordDensityMin: 0.8,
    keywordDensityMax: 1.2,
    readabilityMin: 70
  },
  title: {
    minLength: 30,
    maxLength: 60,
    keywordPosition: 0
  },
  metaDescription: {
    minLength: 120,
    maxLength: 160
  },
  headings: {
    h1: { min: 1, max: 1 },
    h2: { min: 4, max: 8 },
    h3: { min: 6, max: 16 }
  },
  images: {
    minCount: 3,
    maxCount: 6,
    altRequired: true,
    maxSizeKB: 250
  },
  links: {
    internalMin: 5,
    internalMax: 10,
    externalMin: 1,
    externalMax: 3
  }
};

export default {
  DEFAULT_CONFIG,
  SEO_RULES,
  Severity,
  Status,
  Grade
};
