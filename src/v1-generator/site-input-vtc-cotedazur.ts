export interface V1SiteProfileInput {
  projectName: string;
  entityType: 'micro' | 'company' | 'freelance' | 'association' | 'other';
  company: {
    name: string;
    siret?: string;
    siren?: string;
    legalForm?: string;
    activity: string;
  };
  headquarters: {
    address: string;
    postalCode: string;
    city: string;
    department?: string;
    region?: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp?: string;
  };
  seoLanguages: {
    primary: string;
    languages: { code: string; pages: number }[];
  };
  about?: string;
  zones?: string[];
  targetAudience?: string;
  aiSummary?: string;
  mainGoal?: 'devis' | 'appels' | 'whatsapp' | 'presence' | 'autre';
  mainCtaText?: string;
  availability?: string;
  pricingVisibility?: 'show' | 'from' | 'hidden';
  pricingPositioning?: 'market' | 'premium' | 'accessible';
  pricingNotes?: string;
  tone: 'pro' | 'warm' | 'premium' | 'expert' | 'dynamic' | 'story' | 'natural' | 'business';
  tracking: {
    gtm?: string;
    ga4?: string;
    pixel?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
  reviews: {
    source?: string;
    rating?: number;
    total?: number;
    text?: string;
  };
  options: {
    dryRun: boolean;
    enableSeoAudit: boolean;
    enableChatbot: boolean;
    enableAiSeoSnippets: boolean;
  };
}

export const vtcCoteAzurTestSite: V1SiteProfileInput = {
  projectName: 'ECOFUNDRIVE - Chauffeur privé Côte d\'Azur',
  entityType: 'company',
  company: {
    name: 'DAVID CHEMLA (ECOFUN DRIVE)',
    siret: '91224469600015',
    siren: '912244696',
    legalForm: 'SAS, société par actions simplifiée',
    activity:
      "Service de VTC et chauffeur privé haut de gamme 100 % électrique sur la Côte d'Azur, de Marseille à Monaco (13/83/06), spécialisé dans les longs transferts de luxe et la mise à disposition.",
  },
  headquarters: {
    address: 'MARINA BAIE DES ANGES - LE DUCAL - APP 1001 AVENUE DE LA BATTERIE',
    postalCode: '06270',
    city: 'Villeneuve-Loubet',
    department: 'Alpes-Maritimes (06)',
    region: 'Provence-Alpes-Côte d\'Azur',
    country: 'France',
  },
  contact: {
    email: '8888vtc@gmail.com',
    phone: '+33 6 16 55 28 11',
    whatsapp: 'https://wa.me/33616552811',
  },
  seoLanguages: {
    primary: 'fr',
    languages: [
      { code: 'fr', pages: 28 },
      { code: 'en', pages: 12 },
    ],
  },
  about:
    "Chauffeur VTC depuis plus de 5 ans, je connais parfaitement la Côte d'Azur et les lieux les plus prisés entre Marseille et Monaco. Je propose un service de VTC 100 % électrique en berline et van, avec ponctualité comme obligation, humour, bilinguisme français/anglais et une vraie expertise des longs transferts de luxe. Je connais les raccourcis pour Saint-Tropez et je sais gérer les situations d'urgence pour que les clients arrivent à l'heure, sans stress.",
  zones: [
    'Marseille',
    'Toulon',
    'Saint-Tropez',
    'Fréjus',
    'Cannes',
    'Antibes',
    'Nice',
    'Monaco',
    'Bouches-du-Rhône (13)',
    'Var (83)',
    'Alpes-Maritimes (06)',
  ],
  targetAudience:
    'Clients haut de gamme, voyageurs business, touristes internationaux, hôtels 4*/5*, événements, mariages et familles exigeantes.',
  aiSummary:
    "ECOFUNDRIVE est un service de chauffeur privé / VTC haut de gamme 100 % électrique sur la Côte d'Azur, de Marseille à Monaco. Spécialiste des longs transferts de luxe et de la mise à disposition, avec ponctualité stricte, humour, bilinguisme français/anglais et parfaite connaissance des raccourcis et lieux incontournables de la région.",
  mainGoal: 'devis',
  mainCtaText: 'Demander un devis par WhatsApp',
  availability: 'Service disponible 24/7 de Marseille à Monaco (13/83/06).',
  pricingVisibility: 'show',
  pricingPositioning: 'market',
  pricingNotes:
    "Tarifs dans les prix du marché de la Côte d'Azur, raisonnables et respectueux du client : ni low-cost type plateformes, ni abusifs. Pour Saint-Tropez, tarifs personnalisés sur demande (jamais de prix fixes).",
  tone: 'premium',
  tracking: {
    gtm: 'GTM-NMMBXS4T',
    ga4: '',
    pixel: '',
  },
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
  },
  reviews: {
    source: 'trustindex',
    rating: 5.0,
    total: 26,
    text: '26 avis vérifiés 5.0/5 sur la Côte d\'Azur',
  },
  options: {
    dryRun: true,
    enableSeoAudit: true,
    enableChatbot: true,
    enableAiSeoSnippets: true,
  },
};
