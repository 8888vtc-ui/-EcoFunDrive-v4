// ECOFUNDRIVE V3 - Pipeline Principal de Génération
// Orchestre l'ensemble du processus de génération SEO

import { generateStructure, type StructureType } from './structure.js';
import { generateAllSections, assembleContent, type SectionType } from './sections.js';
import { generateAllImages, type ImageType } from './images.js';
import { validateSEO, type SEOResultType } from '../validators/seo.js';
import { optimizeContent } from './optimizer.js';

// Schéma pour le résultat final
export interface GenerationResult {
  keyword: string;
  structure: StructureType;
  sections: SectionType[];
  images: ImageType[];
  content: string;
  seoResult: SEOResultType;
  metrics: {
    generationTime: number;
    totalTime: number;
    wordCount: number;
    imageCount: number;
    seoScore: number;
    attempts: number;
  };
  status: 'success' | 'partial' | 'failed';
  url?: string;
}

// Configuration du pipeline
export interface PipelineConfig {
  maxAttempts: number;
  minSEOScore: number;
  enableImages: boolean;
  enableOptimization: boolean;
  parallelGeneration: boolean;
}

const defaultConfig: PipelineConfig = {
  maxAttempts: 2,
  minSEOScore: 90,
  enableImages: true,
  enableOptimization: true,
  parallelGeneration: true
};

// Pipeline principal de génération
export async function generateOptimizedContent(
  keyword: string,
  config: Partial<PipelineConfig> = {}
): Promise<GenerationResult> {
  const finalConfig = { ...defaultConfig, ...config };
  const startTime = Date.now();
  
  console.log(`🚀 Lancement du pipeline pour: ${keyword}`);
  console.log(`📋 Configuration:`, finalConfig);
  
  try {
    // Étape 1: Génération de la structure
    console.log('\n📐 ÉTAPE 1: Génération de la structure...');
    const structure = await generateStructure(keyword);
    
    // Étape 2: Génération des sections
    console.log('\n📝 ÉTAPE 2: Génération des sections...');
    const sections = await generateAllSections(structure);
    
    // Assembler le contenu initial
    let content = assembleContent(sections);
    let seoResult: SEOResultType;
    let attempts = 1;
    
    // Étape 3: Validation et optimisation itérative
    console.log('\n🔍 ÉTAPE 3: Validation et optimisation...');
    
    do {
      console.log(`\n--- Tentative ${attempts}/${finalConfig.maxAttempts} ---`);
      
      // Valider le contenu actuel
      seoResult = await validateSEO(content, keyword);
      console.log(`📊 Score SEO: ${seoResult.score}/100`);
      
      if (seoResult.score >= finalConfig.minSEOScore) {
        console.log('✅ Score SEO atteint !');
        break;
      }
      
      if (attempts < finalConfig.maxAttempts) {
        console.log(`🔄 Optimisation du contenu...`);
        content = await optimizeContent(content, seoResult.issues);
        attempts++;
      }
      
    } while (attempts <= finalConfig.maxAttempts);
    
    // Étape 4: Génération des images (si activé)
    let images: ImageType[] = [];
    if (finalConfig.enableImages) {
      console.log('\n🖼️ ÉTAPE 4: Génération des images...');
      const imagesStartTime = Date.now();
      images = await generateAllImages(structure.keywords, 4);
      const imagesTime = Date.now() - imagesStartTime;
      console.log(`✅ ${images.length} images générées en ${imagesTime}ms`);
    }
    
    // Calculer les métriques finales
    const totalTime = Date.now() - startTime;
    const generationTime = totalTime - 1000; // Estimation simple
    
    const metrics = {
      generationTime,
      totalTime,
      wordCount: sections.reduce((sum, s) => sum + s.wordCount, 0),
      imageCount: images.length,
      seoScore: seoResult.score,
      attempts
    };
    
    // Déterminer le statut
    const status = seoResult.score >= finalConfig.minSEOScore 
      ? 'success' 
      : seoResult.score >= 70 
        ? 'partial' 
        : 'failed';
    
    const result: GenerationResult = {
      keyword,
      structure,
      sections,
      images,
      content,
      seoResult,
      metrics,
      status
    };
    
    // Afficher le résumé
    printGenerationSummary(result);
    
    return result;
    
  } catch (error) {
    console.error('❌ Erreur critique dans le pipeline:', error);
    
    // Retourner un résultat d'échec
    return {
      keyword,
      structure: {} as StructureType,
      sections: [],
      images: [],
      content: '',
      seoResult: {
        score: 0,
        grade: 'F',
        issues: [],
        metrics: {} as any,
        recommendations: [],
        passedChecks: [],
        failedChecks: []
      },
      metrics: {
        generationTime: 0,
        totalTime: Date.now() - startTime,
        wordCount: 0,
        imageCount: 0,
        seoScore: 0,
        attempts: 0
      },
      status: 'failed'
    };
  }
}

// Génération par lot de plusieurs mots-clés
export async function generateBatchContent(
  keywords: string[],
  config: Partial<PipelineConfig> = {}
): Promise<GenerationResult[]> {
  console.log(`\n🔄 Génération par lot de ${keywords.length} mots-clés...`);
  
  const results: GenerationResult[] = [];
  const startTime = Date.now();
  
  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    console.log(`\n--- ${i + 1}/${keywords.length}: ${keyword} ---`);
    
    try {
      const result = await generateOptimizedContent(keyword, config);
      results.push(result);
      
      // Pause entre les générations pour éviter les rate limits
      if (i < keywords.length - 1) {
        console.log('⏱️ Pause de 2 secondes...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`❌ Échec pour "${keyword}":`, error);
      // Continuer avec les autres mots-clés
    }
  }
  
  const totalTime = Date.now() - startTime;
  const successful = results.filter(r => r.status === 'success').length;
  const partial = results.filter(r => r.status === 'partial').length;
  const failed = results.filter(r => r.status === 'failed').length;
  
  console.log('\n📊 Résumé du lot:');
  console.log(`✅ Succès: ${successful}/${keywords.length}`);
  console.log(`⚠️ Partiel: ${partial}/${keywords.length}`);
  console.log(`❌ Échec: ${failed}/${keywords.length}`);
  console.log(`⏱️ Temps total: ${Math.round(totalTime / 1000)}s`);
  console.log(`📈 Score moyen: ${Math.round(results.reduce((sum, r) => sum + r.metrics.seoScore, 0) / results.length)}/100`);
  
  return results;
}

// Afficher le résumé de génération
function printGenerationSummary(result: GenerationResult) {
  console.log('\n' + '='.repeat(60));
  console.log('📋 RÉSUMÉ DE GÉNÉRATION');
  console.log('='.repeat(60));
  console.log(`🔑 Mot-clé: ${result.keyword}`);
  console.log(`📊 Score SEO: ${result.metrics.seoScore}/100 (${result.seoResult.grade})`);
  console.log(`📝 Contenu: ${result.metrics.wordCount} mots`);
  console.log(`🖼️ Images: ${result.metrics.imageCount} générées`);
  console.log(`🔄 Tentatives: ${result.metrics.attempts}`);
  console.log(`⏱️ Temps total: ${Math.round(result.metrics.totalTime / 1000)}s`);
  console.log(`📈 Temps génération: ${Math.round(result.metrics.generationTime / 1000)}s`);
  console.log(`✅ Statut: ${result.status.toUpperCase()}`);
  
  if (result.seoResult.issues.length > 0) {
    console.log('\n⚠️ Problèmes détectés:');
    result.seoResult.issues.slice(0, 5).forEach((issue: any) => {
      console.log(`   • ${issue.message} (${issue.severity})`);
    });
  }
  
  if (result.seoResult.recommendations.length > 0) {
    console.log('\n💡 Recommandations:');
    result.seoResult.recommendations.slice(0, 3).forEach((rec: any) => {
      console.log(`   • ${rec}`);
    });
  }
  
  console.log('='.repeat(60));
}

// Fonction pour exporter les résultats
export function exportResults(results: GenerationResult[], format: 'json' | 'csv' = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(results, null, 2);
  }
  
  if (format === 'csv') {
    const headers = [
      'Keyword', 'Status', 'SEO Score', 'Word Count', 'Image Count', 
      'Generation Time', 'Total Time', 'Attempts'
    ];
    
    const rows = results.map(result => [
      result.keyword,
      result.status,
      result.metrics.seoScore,
      result.metrics.wordCount,
      result.metrics.imageCount,
      result.metrics.generationTime,
      result.metrics.totalTime,
      result.metrics.attempts
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  
  return '';
}

// Fonction pour calculer les statistiques du lot
export function calculateBatchStats(results: GenerationResult[]) {
  const successful = results.filter(r => r.status === 'success');
  const totalSEOScore = results.reduce((sum, r) => sum + r.metrics.seoScore, 0);
  const totalWords = results.reduce((sum, r) => sum + r.metrics.wordCount, 0);
  const totalTime = results.reduce((sum, r) => sum + r.metrics.totalTime, 0);
  
  return {
    total: results.length,
    successful: successful.length,
    successRate: (successful.length / results.length) * 100,
    averageSEOScore: totalSEOScore / results.length,
    totalWords,
    averageWords: totalWords / results.length,
    totalTime,
    averageTime: totalTime / results.length,
    costEstimate: results.length * 0.12 // ~0.12€ par page
  };
}

export default generateOptimizedContent;
