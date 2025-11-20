export interface IdentitySection {
  projectName: string;
  entityType: 'micro' | 'societe' | 'liberal' | 'asso' | 'autre';
  companyName: string;
  registrationNumber: string;
  email: string;
  phone: string;
}

export interface SeoLanguagesSection {
  activityDescription: string;
  primaryKeyword: string;
  languages: {
    code: string; // ex: 'fr', 'en'
    pages: number;
  }[];
  tone:
    | 'pro'
    | 'warm'
    | 'premium'
    | 'expert'
    | 'dynamic';
}

export interface TrackingSection {
  gtmId?: string;
  ga4Id?: string;
  metaPixelId?: string;
}

export interface SocialSection {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  other?: string;
}

export interface ReviewsSection {
  summary?: string; // ex: "note=4.8, avis=36"
  trustpilot?: string;
  google?: string;
  other?: string;
}

export interface OptionsSection {
  dryRun: boolean;
  enableSeoAudit: boolean;
  generateChatbot: boolean;
  generateAiSeoContent: boolean;
}

export interface V1GeneratorForm {
  identity: IdentitySection;
  seoLanguages: SeoLanguagesSection;
  tracking: TrackingSection;
  social: SocialSection;
  reviews: ReviewsSection;
  options: OptionsSection;
}

// Exemple de formulaire V1 prérempli pour les tests (projet générique, non lié à ECOFUNDRIVE)
export const exampleGeneratorForm: V1GeneratorForm = {
  identity: {
    projectName: 'Site vitrine coach sportif',
    entityType: 'micro',
    companyName: 'Coach Sportif Paris',
    registrationNumber: '000 000 000 00000',
    email: 'contact@example.com',
    phone: '+33 1 23 45 67 89',
  },
  seoLanguages: {
    activityDescription:
      "Coach sportif spécialisé pour femmes à Paris, séances à domicile et en ligne, suivi personnalisé.",
    primaryKeyword: 'coach sportif femmes Paris',
    languages: [
      { code: 'fr', pages: 8 },
      { code: 'en', pages: 3 },
    ],
    tone: 'warm',
  },
  tracking: {
    gtmId: 'GTM-TEST123',
    ga4Id: 'G-TEST123',
    metaPixelId: '000000000000000',
  },
  social: {
    facebook: 'https://facebook.com/example',
    instagram: 'https://instagram.com/example',
    linkedin: 'https://linkedin.com/company/example',
  },
  reviews: {
    summary: 'note=4.8, avis=36',
    google: 'https://maps.google.com/?cid=EXAMPLE',
  },
  options: {
    dryRun: true,
    enableSeoAudit: true,
    generateChatbot: true,
    generateAiSeoContent: true,
  },
};
