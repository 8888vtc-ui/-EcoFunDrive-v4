// Validateur SEO générique V3
// Analyse et valide le contenu selon les normes SEO 2025 pour tout type de site

import { OpenAI, z, cheerio } from '../types/stubs.js';

// Schéma de validation pour les résultats SEO
export const SEOResultSchema = z.object({
  score: z.number().min(0).max(100),
  grade: z.enum_<string>(['A', 'B', 'C', 'D', 'E', 'F']),
  issues: z.array(z.object({
    type: z.string(),
    severity: z.enum_<string>(['low', 'medium', 'high', 'critical']),
    message: z.string(),
    impact: z.string(),
    solution: z.string(),
    location: z.string().optional(),
    snippet: z.string().optional()
  })),
  metrics: z.object({
    wordCount: z.number(),
    keywordDensity: z.number(),
    readabilityScore: z.number(),
    titleLength: z.number(),
    metaDescriptionLength: z.number(),
    headingCount: z.object({
      h1: z.number(),
      h2: z.number(),
      h3: z.number()
    }),
    imageCount: z.number(),
    internalLinks: z.number(),
    externalLinks: z.number()
  }),
  recommendations: z.array(z.string()),
  passedChecks: z.array(z.string()),
  failedChecks: z.array(z.string())
});

export type SEOResultType = z.infer<typeof SEOResultSchema>;

// Client OpenAI pour la validation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Configuration des règles SEO 2025
const SEORules = {
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
    keywordPosition: 0 // Mot-clé au début
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

// Template de prompt pour la validation SEO
const SEO_VALIDATION_PROMPT = (content: string, keyword: string) => `
En tant qu'expert SEO technique, analyse ce contenu pour le mot-clé "${keyword}" selon les normes SEO 2025.

CONTEXTE:
- Contenu pour: Site web optimisé SEO (secteur générique, B2B ou B2C)
- Mot-clé principal: "${keyword}"
- Année: 2025

CRITÈRES D'ANALYSE OBLIGATOIRES:

1. CONTENU:
   - Longueur: 2000-2600 mots
   - Densité mots-clés: 0.8-1.2%
   - Lisibilité: Score Flesch >70
   - Structure claire et cohérente

2. MÉTADONNÉES:
   - Titre: 30-60 caractères, mot-clé au début
   - Meta description: 120-160 caractères unique
   - URL optimisée si présente

3. STRUCTURE:
   - 1 H1 unique
   - 4-8 H2
   - 6-16 H3
   - Hiérarchie logique

4. IMAGES:
   - 3-6 images avec alt text
   - Alt text descriptif (5-20 mots)
   - Images optimisées <250KB

5. LIENS:
   - 5-10 liens internes pertinents
   - 1-3 liens externes de qualité
   - Ancres optimisées

6. TECHNIQUE:
   - Balises sémantiques correctes
   - Pas de contenu dupliqué
   - Accessibilité WCAG

FORMAT DE SORTIE OBLIGATOIRE:
Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "score": 85,
  "grade": "B",
  "issues": [
    {
      "type": "title_length",
      "severity": "medium",
      "message": "Le titre dépasse 60 caractères",
      "impact": "Mauvaise lisibilité dans les SERPs",
      "solution": "Réduire le titre à 60 caractères maximum",
      "location": "balise <title>",
      "snippet": "<title>Titre trop long pour le SEO</title>"
    }
  ],
  "metrics": {
    "wordCount": 2450,
    "keywordDensity": 1.1,
    "readabilityScore": 78,
    "titleLength": 55,
    "metaDescriptionLength": 145,
    "headingCount": {
      "h1": 1,
      "h2": 5,
      "h3": 12
    },
    "imageCount": 4,
    "internalLinks": 7,
    "externalLinks": 2
  },
  "recommendations": [
    "Ajouter 1-2 liens internes supplémentaires",
    "Optimiser la densité de mots-clés"
  ],
  "passedChecks": [
    "Structure H1 correcte",
    "Nombre de mots optimal"
  ],
  "failedChecks": [
    "Titre trop long",
    "Images sans alt text"
  ]
}

IMPORTANT: 
- Soyez précis et constructif
- Fournissez des solutions concrètes
- Ne retournez AUCUN commentaire, uniquement le JSON`;

// Fonction principale de validation SEO
export async function validateSEO(
  content: string, 
  keyword: string
): Promise<SEOResultType> {
  try {
    console.log(`🔍 Validation SEO pour: ${keyword}`);
    
    // Analyse technique avec Cheerio
    const technicalAnalysis = analyzeTechnicalSEO(content, keyword);
    
    // Analyse sémantique avec GPT-4
    const semanticAnalysis = await analyzeSemanticSEO(content, keyword);
    
    // Fusionner les analyses
    const combinedResult = combineAnalyses(technicalAnalysis, semanticAnalysis);
    
    // Valider avec Zod
    const validatedResult = SEOResultSchema.parse(combinedResult);
    
    console.log(`✅ Validation terminée - Score: ${validatedResult.score}/100`);
    console.log(`📊 Problèmes détectés: ${validatedResult.issues.length}`);
    
    return validatedResult;
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation SEO:', error);
    throw new Error(`Échec de la validation SEO: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Analyse technique avec Cheerio
function analyzeTechnicalSEO(content: string, keyword: string) {
  const $ = cheerio(content);
  
  const analysis = {
    title: $('title').text() || '',
    metaDescription: $('meta[name="description"]').attr('content') || '',
    headings: {
      h1: $('h1').length,
      h2: $('h2').length,
      h3: $('h3').length
    },
    images: {
      total: $('img').length,
      withAlt: $('img[alt]').length
    },
    links: {
      internal: 0,
      external: 0
    },
    wordCount: countWords(content),
    keywordDensity: calculateKeywordDensity(content, keyword)
  };
  
  // Compter les liens
  $('a').each((_: any, element: any) => {
    const href = $(element).attr('href');
    if (href) {
      if (href.startsWith('/') || href.startsWith('#')) {
        analysis.links.internal++;
      } else if (href.startsWith('http')) {
        analysis.links.external++;
      }
    }
  });
  
  return analysis;
}

// Analyse sémantique avec GPT-4
async function analyzeSemanticSEO(_content: string, keyword: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{
      role: 'user',
      content: `Analyse ce contenu SEO et retourne un objet JSON avec :
{
  "semanticRelevance": "score de 0-100",
  "readabilityScore": "score de 0-100", 
  "keywordVariations": ["variations trouvées"],
  "contentGaps": ["manques identifiés"],
  "recommendations": ["améliorations suggérées"]
}

Mot-clé principal : ${keyword}`
    }],
    temperature: 0.2,
    max_tokens: 1000
  });
  
  return JSON.parse(response.choices[0].message.content || '{}');
}

// Combiner les analyses techniques et sémantiques
function combineAnalyses(technical: any, semantic: any) {
  // Calculer le score final
  const technicalScore = calculateTechnicalScore(technical);
  const semanticScore = semantic.semanticRelevance || semantic.score || 0;
  
  const finalScore = Math.round((technicalScore + semanticScore) / 2);
  
  // Déterminer la note
  const grade = getGradeFromScore(finalScore);

  const issues = Array.isArray(semantic.issues) ? semantic.issues : [];
  const recommendations = Array.isArray(semantic.recommendations) ? semantic.recommendations : [];
  const passedChecks = Array.isArray(semantic.passedChecks) ? semantic.passedChecks : [];
  const failedChecks = Array.isArray(semantic.failedChecks) ? semantic.failedChecks : [];

  return {
    ...semantic,
    score: finalScore,
    grade,
    metrics: {
      ...semantic.metrics,
      ...technical,
    },
    issues,
    recommendations,
    passedChecks,
    failedChecks,
  };
}

// Calculer le score technique
function calculateTechnicalScore(analysis: any): number {
  let score = 100;
  
  // Pénalités
  if (analysis.title.length < SEORules.title.minLength || analysis.title.length > SEORules.title.maxLength) {
    score -= 10;
  }
  
  if (analysis.metaDescription.length < SEORules.metaDescription.minLength || analysis.metaDescription.length > SEORules.metaDescription.maxLength) {
    score -= 10;
  }
  
  if (analysis.headings.h1 !== SEORules.headings.h1.min) {
    score -= 15;
  }
  
  if (analysis.headings.h2 < SEORules.headings.h2.min || analysis.headings.h2 > SEORules.headings.h2.max) {
    score -= 10;
  }
  
  if (analysis.images.total < SEORules.images.minCount) {
    score -= 10;
  }
  
  if (analysis.images.withAlt < analysis.images.total) {
    score -= 5;
  }
  
  if (analysis.links.internal < SEORules.links.internalMin) {
    score -= 10;
  }
  
  if (analysis.wordCount < SEORules.content.minWords || analysis.wordCount > SEORules.content.maxWords) {
    score -= 15;
  }
  
  return Math.max(0, score);
}

// Obtenir la note en fonction du score
function getGradeFromScore(score: number): string {
  if (score >= 95) return 'A';
  if (score >= 85) return 'B';
  if (score >= 75) return 'C';
  if (score >= 65) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

// Utilitaires
function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

function calculateKeywordDensity(content: string, keyword: string): number {
  const words = content.toLowerCase().split(/\s+/);
  const keywordLower = keyword.toLowerCase();
  const keywordCount = words.filter(word => word.includes(keywordLower)).length;
  return (keywordCount / words.length) * 100;
}

// Fonction pour générer des suggestions d'amélioration
export function generateImprovementSuggestions(result: SEOResultType): string[] {
  const suggestions: string[] = [];
  
  result.issues.forEach((issue: z.infer<typeof SEOResultSchema>['issues'][0]) => {
    if (issue.severity === 'high' || issue.severity === 'critical') {
      suggestions.push(issue.solution);
    }
  });
  
  // Ajouter des suggestions basées sur le score
  if (result.score < 90) {
    suggestions.push('Optimiser la densité de mots-clés entre 0.8% et 1.2%');
    suggestions.push('Ajouter des liens internes pertinents');
    suggestions.push('Améliorer la lisibilité du contenu');
  }
  
  return suggestions;
}

// Export des types et utilitaires
export { SEORules };
export default validateSEO;
