// ECOFUNDRIVE V3 - Générateur de Structure
// Crée la structure de base d'un article SEO optimisé

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

// Schéma de validation pour la structure
const StructureSchema = z.object({
  title: z.string().max(60),
  metaDescription: z.string().min(120).max(160),
  keywords: z.array(z.string()).min(3).max(8),
  sections: z.array(z.object({
    title: z.string(),
    wordCount: z.number().min(300).max(600),
    keywords: z.array(z.string()).optional(),
    type: z.enum(['introduction', 'content', 'conclusion', 'faq'])
  })).min(4).max(8),
  totalWordCount: z.number().min(2000).max(2600),
  estimatedReadTime: z.number().min(8).max(15),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  tone: z.string(),
  targetAudience: z.string()
});

export type StructureType = z.infer<typeof StructureSchema>;

// Client Claude pour la génération de structure
const claude = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Template de prompt pour la génération de structure
const STRUCTURE_PROMPT_TEMPLATE = (keyword: string) => `
En tant qu'expert SEO, analyse le mot-clé "${keyword}" et propose une structure d'article optimisée pour le référencement en 2025.

CONTEXTE:
- Service: VTC premium sur la Côte d'Azur
- Cible: Clients haut de gamme
- Objectif: Conversion et référencement local
- Zone: Alpes-Maritimes (06) et Var (83)

EXIGENCES SEO 2025:
1. Titre: 50-60 caractères, mot-clé au début
2. Meta description: 150-160 caractères unique
3. Structure: 1 H1, 4-6 H2, 2-3 H3 par H2
4. Contenu: 2000-2600 mots
5. Mots-clés: 3-8 variations pertinentes
6. Temps de lecture: 8-15 minutes

FORMAT DE SORTIE OBLIGATOIRE:
Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "title": "Titre SEO optimisé (max 60 caractères)",
  "metaDescription": "Description unique (150-160 caractères)",
  "keywords": ["mot-clé1", "mot-clé2", "mot-clé3"],
  "sections": [
    {
      "title": "Titre de la section",
      "wordCount": 400,
      "keywords": ["mot-clé1", "mot-clé2"],
      "type": "introduction"
    }
  ],
  "totalWordCount": 2400,
  "estimatedReadTime": 12,
  "difficulty": "intermediate",
  "tone": "professionnel et engageant",
  "targetAudience": "clients VTC premium"
}

TYPES DE SECTIONS POSSIBLES:
- introduction: Accroche et présentation
- content: Contenu principal avec H2/H3
- conclusion: Synthèse et CTA
- faq: Questions fréquentes

IMPORTANT: Ne retourne AUCUN commentaire, uniquement le JSON.`;

// Fonction principale de génération de structure
export async function generateStructure(keyword: string): Promise<StructureType> {
  try {
    console.log(`🏗️ Génération de la structure pour: ${keyword}`);
    
    const response = await claude.messages.create({
      model: 'claude-3-5-sonnet',
      max_tokens: 2000,
      temperature: 0.3, // Faible température pour la structure
      messages: [
        {
          role: 'user',
          content: STRUCTURE_PROMPT_TEMPLATE(keyword)
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

    const structureJson = JSON.parse(jsonMatch[0]);
    
    // Valider la structure avec Zod
    const validatedStructure = StructureSchema.parse(structureJson);
    
    console.log(`✅ Structure générée: ${validatedStructure.sections.length} sections`);
    console.log(`📊 Mots-clés: ${validatedStructure.keywords.join(', ')}`);
    
    return validatedStructure;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération de la structure:', error);
    throw new Error(`Échec de la génération de structure: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Fonction utilitaire pour extraire les mots-clés secondaires
export function extractSecondaryKeywords(mainKeyword: string, structure: StructureType): string[] {
  return structure.keywords.filter((k: string) => k.toLowerCase() !== mainKeyword.toLowerCase());
}

// Fonction pour calculer le temps de lecture estimé
export function calculateReadTime(wordCount: number): number {
  const wordsPerMinute = 200; // Vitesse de lecture moyenne
  return Math.ceil(wordCount / wordsPerMinute);
}

// Fonction pour valider la cohérence de la structure
export function validateStructure(structure: StructureType): boolean {
  const totalWords = structure.sections.reduce((sum: number, section: any) => sum + section.wordCount, 0);
  const wordCountDiff = Math.abs(totalWords - structure.totalWordCount);
  
  // Tolérance de 10% sur le nombre de mots
  const tolerance = structure.totalWordCount * 0.1;
  
  if (wordCountDiff > tolerance) {
    console.warn(`⚠️ Incohérence dans le nombre de mots: ${totalWords} vs ${structure.totalWordCount}`);
    return false;
  }
  
  return true;
}

// Export des types et utilitaires
export { StructureSchema };
export default generateStructure;
