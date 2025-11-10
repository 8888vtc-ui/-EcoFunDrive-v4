// ECOFUNDRIVE V3 - Générateur de Sections
// Génère le contenu de chaque section de manière parallèle

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import type { StructureType } from './structure.js';

// Schéma de validation pour une section
const SectionSchema = z.object({
  title: z.string(),
  content: z.string().min(300),
  html: z.string(),
  wordCount: z.number(),
  keywords: z.array(z.string()),
  type: z.enum(['introduction', 'content', 'conclusion', 'faq']),
  readabilityScore: z.number().min(0).max(100),
  hasCallToAction: z.boolean().optional(),
  internalLinks: z.array(z.string().url()).optional(),
  images: z.array(z.object({
    alt: z.string(),
    position: z.string(),
    description: z.string()
  })).optional()
});

export type SectionType = z.infer<typeof SectionSchema>;

// Client Claude pour la génération de contenu
const claude = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Template de prompt pour la génération de section
const SECTION_PROMPT_TEMPLATE = (section: any, keywords: string[]) => `
En tant que rédacteur SEO expert, rédige la section suivante pour un article sur les services VTC premium.

CONTEXTE:
- Titre de la section: "${section.title}"
- Nombre de mots cible: ${section.wordCount}
- Type de section: ${section.type}
- Mots-clés à intégrer: ${keywords.join(', ')}

EXIGENCES SPÉCIFIQUES:
1. Longueur: ${section.wordCount} mots (±10%)
2. Style: Professionnel et engageant
3. Public: Clients haut de gamme
4. Ton: Confiant et rassurant

ÉLÉMENTS OBLIGATOIRES:
- 1 statistique ou donnée chiffrée pertinente
- 1 exemple concret ou témoignage
- 1 phrase de transition fluide
- Intégration naturelle des mots-clés

RÈGLES SEO:
- Densité de mots-clés: 0.8-1.2%
- Phrases courtes et lisibles
- Structure avec sous-titres si >400 mots
- 1-2 liens internes suggérés

FORMAT DE SORTIE:
Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "title": "${section.title}",
  "content": "Contenu rédigé en format texte brut",
  "html": "<h2>Titre</h2><p>Contenu au format HTML</p>",
  "wordCount": ${section.wordCount},
  "keywords": ["mot-clé1", "mot-clé2"],
  "type": "${section.type}",
  "readabilityScore": 85,
  "hasCallToAction": true,
  "internalLinks": ["https://example.com/service1", "https://example.com/service2"],
  "images": [
    {
      "alt": "Description de l'image",
      "position": "après le premier paragraphe",
      "description": "Image montrant un service VTC premium"
    }
  ]
}

IMPORTANT: 
- Ne retourne AUCUN commentaire
- Le HTML doit être valide et sémantique
- Les liens doivent être pertinents pour le contexte VTC`;

// Fonction principale de génération de section
export async function generateSection(
  section: any, 
  keywords: string[]
): Promise<SectionType> {
  try {
    console.log(`📝 Génération de la section: ${section.title}`);
    
    const response = await claude.messages.create({
      model: 'claude-3-5-sonnet',
      max_tokens: 3000,
      temperature: 0.7, // Température plus élevée pour la créativité
      messages: [
        {
          role: 'user',
          content: SECTION_PROMPT_TEMPLATE(section, keywords)
        }
      ]
    });

    const content = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Aucun JSON valide trouvé dans la réponse');
    }

    const sectionJson = JSON.parse(jsonMatch[0]);
    
    // Valider la section avec Zod
    const validatedSection = SectionSchema.parse(sectionJson);
    
    console.log(`✅ Section générée: ${validatedSection.wordCount} mots`);
    
    return validatedSection;
    
  } catch (error) {
    console.error(`❌ Erreur lors de la génération de la section "${section.title}":`, error);
    throw new Error(`Échec de la génération de section: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Génération parallèle de toutes les sections
export async function generateAllSections(
  structure: StructureType
): Promise<SectionType[]> {
  console.log(`🚀 Génération parallèle de ${structure.sections.length} sections...`);
  
  const startTime = Date.now();
  
  try {
    // Génération parallèle de toutes les sections
    const sectionPromises = structure.sections.map((section: any) => 
      generateSection(section, structure.keywords)
    );
    
    const sections = await Promise.all(sectionPromises);
    
    const duration = Date.now() - startTime;
    const totalWords = sections.reduce((sum: number, section: any) => sum + section.wordCount, 0);
    
    console.log(`✅ Toutes les sections générées en ${duration}ms`);
    console.log(`📊 Total: ${totalWords} mots`);
    
    return sections;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération parallèle des sections:', error);
    throw error;
  }
}

// Fonction pour assembler le contenu complet
export function assembleContent(sections: SectionType[]): string {
  console.log('🔧 Assemblage du contenu complet...');
  
  let fullContent = '';
  let currentWordCount = 0;
  
  sections.forEach((section, index) => {
    // Ajouter le HTML de la section
    fullContent += section.html + '\n\n';
    currentWordCount += section.wordCount;
    
    // Ajouter des séparateurs visuels entre les sections principales
    if (section.type === 'content' && index < sections.length - 1) {
      fullContent += '<hr class="section-divider">\n\n';
    }
  });
  
  console.log(`📝 Contenu assemblé: ${currentWordCount} mots`);
  
  return fullContent;
}

// Fonction pour extraire les liens internes
export function extractInternalLinks(sections: SectionType[]): string[] {
  const allLinks: string[] = [];
  
  sections.forEach(section => {
    if (section.internalLinks) {
      allLinks.push(...section.internalLinks);
    }
  });
  
  // Dédupliquer les liens
  return [...new Set(allLinks)];
}

// Fonction pour calculer la lisibilité moyenne
export function calculateAverageReadability(sections: SectionType[]): number {
  const totalScore = sections.reduce((sum: number, section: any) => sum + section.readabilityScore, 0);
  return Math.round(totalScore / sections.length);
}

// Fonction pour valider la cohérence du contenu
export function validateContentConsistency(
  sections: SectionType[], 
  structure: StructureType
): boolean {
  const totalWords = sections.reduce((sum: number, section: any) => sum + section.wordCount, 0);
  const expectedWords = structure.totalWordCount;
  
  // Tolérance de 15% pour le contenu généré
  const tolerance = expectedWords * 0.15;
  const difference = Math.abs(totalWords - expectedWords);
  
  if (difference > tolerance) {
    console.warn(`⚠️ Différence de mots importante: ${totalWords} vs ${expectedWords}`);
    return false;
  }
  
  // Vérifier que tous les types de sections sont présents
  const hasIntroduction = sections.some(s => s.type === 'introduction');
  const hasConclusion = sections.some(s => s.type === 'conclusion');
  
  if (!hasIntroduction || !hasConclusion) {
    console.warn('⚠️ Structure incomplète: introduction ou conclusion manquante');
    return false;
  }
  
  return true;
}

// Export des types et utilitaires
export { SectionSchema };
export default generateSection;
