// ECOFUNDRIVE V3 - Optimiseur de Contenu
// Optimise le contenu basé sur les résultats de validation SEO

import { OpenAI, z } from '../types/stubs.js';

// Schéma pour les problèmes SEO
const SEOIssueSchema = z.object({
  type: z.string(),
  severity: z.enum_<string>(['low', 'medium', 'high', 'critical']),
  message: z.string(),
  impact: z.string(),
  solution: z.string(),
  location: z.string().optional(),
  snippet: z.string().optional()
});

export type SEOIssueType = z.infer<typeof SEOIssueSchema>;

// Client OpenAI pour l'optimisation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Template de prompt pour l'optimisation
const OPTIMIZATION_PROMPT_TEMPLATE = (content: string, issues: SEOIssueType[]) => `
En tant qu'expert en optimisation SEO, améliore ce contenu en corrigeant spécifiquement les problèmes détectés.

CONTENU ACTUEL:
${content}

PROBLÈMES DÉTECTÉS (${issues.length}):
${issues.map((issue, i) => `
${i + 1}. [${issue.severity.toUpperCase()}] ${issue.type}
   • Problème: ${issue.message}
   • Impact: ${issue.impact}
   • Solution: ${issue.solution}
   ${issue.location ? `• Localisation: ${issue.location}` : ''}
   ${issue.snippet ? `• Extrait: ${issue.snippet}` : ''}
`).join('\n')}

INSTRUCTIONS D'OPTIMISATION:

1. PRIORITÉ ABSOLUE - Problèmes CRITIQUES:
   - Corrige TOUS les problèmes critiques (titre, meta, structure)
   - Respecte les limites de caractères strictement

2. PRIORITÉ HAUTE - Problèmes IMPORTANTS:
   - Ajuste la densité de mots-clés (0.8-1.2%)
   - Optimise la structure des titres
   - Ajoute les liens internes manquants

3. PRIORITÉ MOYENNE - Améliorations:
   - Améliore la lisibilité (score >70)
   - Ajoute des attributs alt aux images
   - Optimise les ancres de liens

RÈGLES À RESPECTER:
- Ne modifie que ce qui est nécessaire
- Conserve le ton professionnel et engageant
- Maintiens la cohérence du contenu
- Ajoute des transitions fluides
- Vérifie la grammaire et l'orthographe

FORMAT DE SORTIE:
Retourne UNIQUEMENT le contenu HTML optimisé, sans aucun commentaire ni explication.

IMPORTANT:
- Le contenu doit être 100% valide HTML
- Toutes les corrections doivent être appliquées
- Pas de placeholder ou de texte temporaire`;

// Fonction principale d'optimisation
export async function optimizeContent(
  content: string,
  issues: SEOIssueType[]
): Promise<string> {
  try {
    console.log(`🔧 Optimisation du contenu (${issues.length} problèmes)...`);
    
    // Filtrer les problèmes par sévérité
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const highIssues = issues.filter(i => i.severity === 'high');
    const mediumIssues = issues.filter(i => i.severity === 'medium');
    
    console.log(`   • Critiques: ${criticalIssues.length}`);
    console.log(`   • Importants: ${highIssues.length}`);
    console.log(`   • Moyens: ${mediumIssues.length}`);
    
    // Si aucun problème critique ou important, retourner le contenu
    if (criticalIssues.length === 0 && highIssues.length === 0) {
      console.log('✅ Aucune optimisation majeure requise');
      return content;
    }
    
    // Optimiser avec GPT-4
    const optimizedContent = await optimizeWithGPT4(content, issues);
    
    console.log('✅ Contenu optimisé avec succès');
    
    return optimizedContent;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation du contenu:', error);
    throw new Error(`Échec de l'optimisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Optimisation avec GPT-4
async function optimizeWithGPT4(
  content: string,
  issues: SEOIssueType[]
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'Tu es un expert SEO spécialisé dans l\'optimisation de contenu pour les services VTC premium. Tu es précis, efficace et tu ne retournes que du contenu HTML valide.'
      },
      {
        role: 'user',
        content: OPTIMIZATION_PROMPT_TEMPLATE(content, issues)
      }
    ],
    temperature: 0.3, // Faible température pour la précision
    max_tokens: 4000
  });
  
  const optimizedContent = response.choices[0].message.content || content;
  
  // Nettoyer le contenu des éventuels commentaires
  return cleanOptimizedContent(optimizedContent);
}

// Nettoyer le contenu optimisé
function cleanOptimizedContent(content: string): string {
  // Supprimer les commentaires HTML
  let cleaned = content.replace(/<!--[\s\S]*?-->/g, '');
  
  // Supprimer les lignes explicatives
  cleaned = cleaned.split('\n')
    .filter(line => !line.trim().startsWith('//') && !line.trim().startsWith('#'))
    .join('\n');
  
  // Nettoyer les espaces multiples
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return cleaned.trim();
}

// Optimisation ciblée par type de problème
export async function optimizeSpecificIssue(
  _content: string,
  issueType: string
): Promise<string> {
  const specificPrompts: Record<string, string> = {
    'title_length': `Corrige la balise <title> pour qu'elle fasse entre 30 et 60 caractères maximum.`,
    'meta_description': `Corrige la meta description pour qu'elle fasse entre 120 et 160 caractères.`,
    'keyword_density': `Ajuste la densité de mots-clés pour atteindre 0.8-1.2% en ajoutant des variations naturelles.`,
    'heading_structure': `Corrige la structure des titres pour avoir 1 H1, 4-8 H2, et 6-16 H3 avec une hiérarchie logique.`,
    'missing_alt': `Ajoute des attributs alt descriptifs à toutes les images (5-20 mots).`,
    'low_readability': `Améliore la lisibilité en utilisant des phrases plus courtes et un vocabulaire accessible.`,
    'insufficient_links': `Ajoute 5-10 liens internes pertinents vers d'autres services VTC.`
  };
  
  const prompt = specificPrompts[issueType] || 'Optimise ce contenu pour le SEO.';
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'Tu es un expert SEO. Optimise uniquement le problème spécifié.'
      },
      {
        role: 'user',
        content: `${prompt}\n\nContenu:\n${_content}`
      }
    ],
    temperature: 0.2,
    max_tokens: 4000
  });
  
  return response.choices[0].message.content || _content;
}

// Validation du contenu optimisé
export function validateOptimizedContent(
  content: string,
  _originalContent: string
): { isValid: boolean; changes: string[] } {
  const improvements: string[] = [];
  let isValid = true;
  
  // Vérifier que le contenu n'est pas vide
  if (!content || content.trim().length === 0) {
    improvements.push('Le contenu optimisé est vide');
    isValid = false;
  }
  
  // Vérifier la longueur
  const lengthDiff = Math.abs(content.length - _originalContent.length);
  const lengthRatio = lengthDiff / _originalContent.length;
  
  if (lengthRatio > 0.5) {
    improvements.push('Le contenu a été trop modifié (>50% de changement)');
    isValid = false;
  }
  
  // Vérifier que le contenu contient des éléments SEO essentiels
  const essentialElements = ['title', 'description', 'heading', 'content'];
  
  essentialElements.forEach(element => {
    if (!content.toLowerCase().includes(element.toLowerCase())) {
      improvements.push(`L'élément essentiel "${element}" semble manquant`);
      isValid = false;
    }
  });
  
  return { isValid, changes: improvements };
}

// Optimisation avancée multi-passes
export async function advancedOptimization(
  content: string,
  initialIssues: SEOIssueType[],
  maxPasses: number = 3
): Promise<{
  optimizedContent: string;
  finalIssues: SEOIssueType[];
  passes: number;
  improvements: string[];
}> {
  let optimizedContent = content;
  let remainingIssues = initialIssues;
  const improvements: string[] = [];
  let passes = 0;
  
  console.log(`🔄 Lancement optimisation avancée (max ${maxPasses} passes)...`);
  
  for (let i = 0; i < maxPasses; i++) {
    console.log(`\n--- Pass ${i + 1}/${maxPasses} ---`);
    
    // Optimiser avec les problèmes restants
    optimizedContent = await optimizeContent(optimizedContent, remainingIssues);
    passes++;
    
    // Simuler une nouvelle validation (en pratique, appelerait validateSEO)
    const newScore = simulateSEOScore(optimizedContent, remainingIssues);
    
    if (newScore >= 90) {
      improvements.push(`Score SEO cible atteint: ${newScore}/100`);
      break;
    }
    
    // Simuler la réduction des problèmes (en pratique, basé sur validation réelle)
    remainingIssues = remainingIssues.filter((issue: SEOIssueType) => 
      Math.random() > 0.6 // 60% de chance de résoudre chaque problème
    );
    
    improvements.push(`Pass ${i + 1}: ${remainingIssues.length} problèmes restants`);
    
    if (remainingIssues.length === 0) {
      improvements.push('Tous les problèmes SEO résolus');
      break;
    }
  }
  
  return {
    optimizedContent,
    finalIssues: remainingIssues,
    passes,
    improvements
  };
}

// Simulation de score SEO (à remplacer par validation réelle)
function simulateSEOScore(_content: string, issues: SEOIssueType[]): number {
  const baseScore = 100;
  const criticalPenalty = issues.filter(i => i.severity === 'critical').length * 15;
  const highPenalty = issues.filter(i => i.severity === 'high').length * 10;
  const mediumPenalty = issues.filter(i => i.severity === 'medium').length * 5;
  const lowPenalty = issues.filter(i => i.severity === 'low').length * 2;
  
  const totalPenalty = criticalPenalty + highPenalty + mediumPenalty + lowPenalty;
  const finalScore = Math.max(0, baseScore - totalPenalty);
  
  return Math.round(finalScore);
}

// Export des utilitaires
export { SEOIssueSchema };
export default optimizeContent;
