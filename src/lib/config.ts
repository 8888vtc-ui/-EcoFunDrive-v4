// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3.0 - CONFIGURATION
// Données centralisées pour génération dynamique
// ═══════════════════════════════════════════════════════════

export const siteConfig = {
  siteUrl: import.meta.env.SITE_URL || 'https://example.com',
  // Entreprise (remplie dynamiquement à partir du formulaire)
  company: {
    name: '',
    siret: '',
    siren: '',
    legalForm: '',
    activity: ''
  },

  // Siège social (rempli dynamiquement)
  headquarters: {
    address: '',
    postalCode: '',
    city: '',
    department: '',
    region: '',
    country: ''
  },

  // Contacts (remplis dynamiquement)
  contact: {
    email: '',
    phone: '',
    whatsapp: ''
  },

  // Tracking (optionnel, dépend du formulaire)
  tracking: {
    gtm: '',
    trustindexWidget: ''
  },

  // Auteur / responsable de contenu (rempli dynamiquement)
  author: {
    name: '',
    title: '',
    specialty: '',
    profileUrl: ''
  },

  // Avis agrégés (optionnels, dépendent des données saisies)
  reviews: {
    platform: '',
    rating: '',
    total: 0,
    displayText: ''
  },

  // Flotte, tarification et inclusions spécifiques au métier sont
  // gérées au niveau des sites générés et non dans la config globale V1.

  // SEO par défaut (peut être surchargé par site)
  seo: {
    defaultTitle: 'Generated SEO Site',
    defaultDescription: 'SEO-optimized website generated automatically.',
    keywords: [] as string[],
    author: '',
    robots: 'index, follow'
  },
  
  // API Keys V3
  api: {
    anthropic: import.meta.env.ANTHROPIC_API_KEY,
    openai: import.meta.env.OPENAI_API_KEY,
    replicate: import.meta.env.REPLICATE_API_KEY,
    sharp: import.meta.env.SHARP_API_KEY
  }
};

// Export utilitaires V3
export const getCurrentYear = () => new Date().getFullYear();
export const formatPhone = (phone: string) => phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
export const generateCanonicalUrl = (path: string) => `${siteConfig.siteUrl}${path}`;
