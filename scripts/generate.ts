#!/usr/bin/env tsx

// ECOFUNDRIVE V3 - Script de Génération SEO
// Point d'entrée principal pour la génération de contenu

import { generateOptimizedContent, generateBatchContent, exportResults, calculateBatchStats } from '../src/generators/pipeline.js';
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

interface GenerateOptions {
  keyword?: string;
  batch?: string;
  output?: string;
  format?: 'json' | 'csv';
  config?: string;
  verbose?: boolean;
}

// Parser des arguments en ligne de commande
function parseArgs(): GenerateOptions {
  const args = process.argv.slice(2);
  const options: GenerateOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
      case '-k':
      case '--keyword':
        options.keyword = nextArg;
        i++;
        break;
      case '-b':
      case '--batch':
        options.batch = nextArg;
        i++;
        break;
      case '-o':
      case '--output':
        options.output = nextArg;
        i++;
        break;
      case '-f':
      case '--format':
        options.format = nextArg as 'json' | 'csv';
        i++;
        break;
      case '-c':
      case '--config':
        options.config = nextArg;
        i++;
        break;
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;
      case '-h':
      case '--help':
        showHelp();
        process.exit(0);
        break;
    }
  }
  
  return options;
}

// Afficher l'aide
function showHelp() {
  console.log(`
🚀 ECOFUNDRIVE V3 - Générateur SEO

USAGE:
  tsx scripts/generate.ts [options]

OPTIONS:
  -k, --keyword <mot-clé>    Générer une page pour un mot-clé spécifique
  -b, --batch <fichier>      Générer plusieurs pages depuis un fichier
  -o, --output <fichier>     Exporter les résultats dans un fichier
  -f, --format <format>      Format d'export: json (défaut) ou csv
  -c, --config <fichier>     Fichier de configuration JSON
  -v, --verbose              Mode verbeux
  -h, --help                 Afficher cette aide

EXEMPLES:
  # Générer une page simple
  tsx scripts/generate.ts -k "VTC Aéroport Nice"

  # Générer par lot depuis un fichier
  tsx scripts/generate.ts -b keywords.txt -o results.json

  # Export en CSV avec configuration personnalisée
  tsx scripts/generate.ts -b keywords.txt -f csv -c config.json

FICHIER KEYWORDS.TXT:
  VTC Aéroport Nice
  VTC Cannes
  Transport Monaco
  Chauffeur Saint-Tropez

FICHIER CONFIG.JSON:
  {
    "maxAttempts": 3,
    "minSEOScore": 95,
    "enableImages": true,
    "enableOptimization": true
  }
`);
}

// Valider les arguments
function validateOptions(options: GenerateOptions): void {
  if (!options.keyword && !options.batch) {
    console.error('❌ Erreur: --keyword ou --batch est requis');
    process.exit(1);
  }
  
  if (options.keyword && options.batch) {
    console.error('❌ Erreur: --keyword et --batch sont mutuellement exclusifs');
    process.exit(1);
  }
  
  if (options.format && !['json', 'csv'].includes(options.format)) {
    console.error('❌ Erreur: --format doit être "json" ou "csv"');
    process.exit(1);
  }
}

// Charger la configuration
async function loadConfig(configPath?: string): Promise<any> {
  if (!configPath) return {};
  
  try {
    const fs = await import('fs');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log(`✅ Configuration chargée depuis: ${configPath}`);
    return config;
  } catch (error) {
    console.error(`❌ Erreur lors du chargement de la configuration: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    process.exit(1);
  }
}

// Charger les mots-clés depuis un fichier
async function loadKeywords(filePath: string): Promise<string[]> {
  try {
    const fs = await import('fs');
    const content = fs.readFileSync(filePath, 'utf8');
    const keywords = content
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);
    
    console.log(`✅ ${keywords.length} mots-clés chargés depuis: ${filePath}`);
    return keywords;
  } catch (error) {
    console.error(`❌ Erreur lors du chargement des mots-clés: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    process.exit(1);
  }
}

// Exporter les résultats
async function exportToFile(results: any, filePath: string, format: 'json' | 'csv'): Promise<void> {
  try {
    const fs = await import('fs');
    const content = exportResults(results, format);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Résultats exportés dans: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'export: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Afficher les statistiques en mode verbeux
function showVerboseStats(results: any[]): void {
  console.log('\n📊 STATISTIQUES DÉTAILLÉES');
  console.log('='.repeat(60));
  
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.keyword}`);
    console.log(`   Status: ${result.status.toUpperCase()}`);
    console.log(`   Score SEO: ${result.metrics.seoScore}/100`);
    console.log(`   Mots: ${result.metrics.wordCount}`);
    console.log(`   Images: ${result.metrics.imageCount}`);
    console.log(`   Temps: ${Math.round(result.metrics.totalTime / 1000)}s`);
    console.log(`   Tentatives: ${result.metrics.attempts}`);
  });
  
  const stats = calculateBatchStats(results);
  console.log('\n📈 RÉSUMÉ DU LOT');
  console.log('='.repeat(60));
  console.log(`Total: ${stats.total} pages`);
  console.log(`Succès: ${stats.successful} (${stats.successRate.toFixed(1)}%)`);
  console.log(`Score moyen: ${stats.averageSEOScore.toFixed(1)}/100`);
  console.log(`Mots totaux: ${stats.totalWords.toLocaleString()}`);
  console.log(`Temps moyen: ${Math.round(stats.averageTime / 1000)}s/page`);
  console.log(`Coût estimé: ${stats.costEstimate.toFixed(2)}€`);
}

// Fonction principale
async function main(): Promise<void> {
  console.log('🚀 ECOFUNDRIVE V3 - Générateur SEO');
  console.log('='.repeat(60));
  
  const options = parseArgs();
  validateOptions(options);
  
  // Vérifier les variables d'environnement requises
  const requiredEnvVars = ['CLAUDE_API_KEY', 'OPENAI_API_KEY', 'REPLICATE_API_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n💡 Veuillez configurer votre fichier .env.local');
    process.exit(1);
  }
  
  try {
    const config = await loadConfig(options.config);
    let results;
    
    if (options.keyword) {
      // Génération simple
      console.log(`\n🎯 Génération pour: ${options.keyword}`);
      const result = await generateOptimizedContent(options.keyword, config);
      results = [result];
      
      if (options.verbose) {
        showVerboseStats(results);
      }
      
    } else if (options.batch) {
      // Génération par lot
      const keywords = await loadKeywords(options.batch!);
      console.log(`\n🔄 Génération par lot de ${keywords.length} mots-clés...`);
      
      results = await generateBatchContent(keywords, config);
      
      if (options.verbose) {
        showVerboseStats(results);
      }
    }
    
    // Exporter les résultats si demandé
    if (options.output && results) {
      await exportToFile(results, options.output, options.format || 'json');
    }
    
    // Afficher le résumé final
    if (results) {
      const successful = results.filter(r => r.status === 'success').length;
      const total = results.length;
      
      console.log('\n🎉 GÉNÉRATION TERMINÉE');
      console.log('='.repeat(60));
      console.log(`✅ Succès: ${successful}/${total} pages`);
      
      if (successful === total) {
        console.log('🌟 Toutes les pages ont été générées avec succès !');
      } else {
        const failed = total - successful;
        console.log(`⚠️ ${failed} page(s) ont échoué`);
      }
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error.message);
    
    if (options.verbose) {
      console.error('\nDétails de l\'erreur:', error);
    }
    
    process.exit(1);
  }
}

// Gérer les interruptions
process.on('SIGINT', () => {
  console.log('\n\n⏹️ Génération interrompue par l\'utilisateur');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n⏹️ Génération terminée');
  process.exit(0);
});

// Démarrer le script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Erreur non gérée:', error);
    process.exit(1);
  });
}

export { main, parseArgs, validateOptions, loadConfig, loadKeywords };
