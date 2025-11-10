// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3.0 - CONFIGURATION
// Données centralisées pour génération dynamique
// ═══════════════════════════════════════════════════════════

export const siteConfig = {
  siteUrl: import.meta.env.SITE_URL || 'https://ecofundrive.com',
  // Entreprise
  company: {
    name: 'ECOFUNDRIVE',
    siret: '91224469600015',
    siren: '912244696',
    legalForm: 'Entreprise individuelle',
    activity: 'VTC premium Tesla électrique'
  },
  
  // Siège social
  headquarters: {
    address: '1001 Avenue de la Batterie',
    postalCode: '06270',
    city: 'Villeneuve-Loubet',
    department: 'Alpes-Maritimes (06)',
    region: 'Provence-Alpes-Côte d\'Azur',
    country: 'France'
  },
  
  // Contacts
  contact: {
    email: '8888vtc@gmail.com',
    phone: '+33 6 16 55 28 11',
    whatsapp: 'https://wa.me/33616552811'
  },
  
  // Tracking
  tracking: {
    gtm: 'GTM-NMMBXS4T',
    trustindexWidget: '6e6475e260715241c236fb004f3'
  },
  
  // Auteur
  author: {
    name: 'David Chemla',
    title: 'Local Guide Google Niveau 6',
    specialty: 'Expert Côte d\'Azur depuis 15 ans',
    profileUrl: 'https://maps.app.goo.gl/qPAanSvPmAxxmhZZA'
  },
  
  // Avis
  reviews: {
    platform: 'Trustindex',
    rating: '5.0',
    total: 26,
    displayText: '26 avis vérifiés 5.0⭐ - ECOFUNDRIVE'
  },
  
  // Flotte
  fleet: [
    {
      model: 'Tesla Model 3',
      capacity: '5 passagers',
      luggage: '2 grandes valises',
      trunk: '425L',
      hourlyRate: '70€/h'
    },
    {
      model: 'Tesla Model S',
      capacity: '5 passagers',
      luggage: '3 grandes valises',
      trunk: '804L',
      hourlyRate: '100€/h'
    },
    {
      model: 'Tesla Model X',
      capacity: '6 passagers',
      luggage: '4+ valises',
      trunk: '2180L',
      hourlyRate: '120€/h',
      feature: 'Portes Falcon Wing'
    },
    {
      model: 'Van électrique',
      capacity: '8 passagers',
      luggage: '6+ valises',
      hourlyRate: '120€/h'
    }
  ],
  
  // Tarifs standards
  pricing: {
    niceMonaco: {
      distance: '22 km',
      duration: '25 minutes',
      model3: '80€',
      modelS: '96€',
      modelX: '104€',
      van: '112€'
    },
    niceCannes: {
      distance: '27 km',
      duration: '30 minutes',
      model3: '100€',
      modelS: '120€',
      modelX: '130€',
      van: '140€'
    },
    hourly: {
      minimum: '3 heures',
      model3: '70€/h',
      modelS: '100€/h',
      modelX: '120€/h',
      van: '120€/h'
    }
  },
  
  // Inclusions
  inclusions: [
    'Chauffeur professionnel bilingue (français/anglais)',
    'Suivi vol temps réel (aéroport Nice)',
    'Eau fraîche + chargeurs USB offerts',
    'WiFi gratuit embarqué',
    '15 minutes d\'attente gratuites',
    'Assurance tous risques incluse',
    'Parking + péages inclus',
    'Sièges enfants disponibles sur demande',
    'Assistance 24/7'
  ],
  
  // SEO pour V3
  seo: {
    defaultTitle: 'VTC Tesla Premium Côte d\'Azur | ECOFUNDRIVE',
    defaultDescription: 'Service VTC premium avec Tesla électrique sur la Côte d\'Azur. Transferts aéroport Nice, Monaco, Cannes, Saint-Tropez. Réservation 24/7.',
    keywords: ['VTC Tesla', 'chauffeur privé Côte d\'Azur', 'transport électrique Monaco', 'VTC premium Nice', 'transfert aéroport Nice'],
    author: 'ECOFUNDRIVE',
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
