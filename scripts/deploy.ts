#!/usr/bin/env tsx

// ECOFUNDRIVE V3 - Script de Déploiement
// Déploie le contenu généré sur Netlify

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

// Stub pour dotenv
function config(): void {
  // Configuration placeholder
}

// Charger les variables d'environnement
config();

interface DeployOptions {
  env?: 'staging' | 'production';
  site?: string;
  force?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}

interface DeployResult {
  success: boolean;
  url?: string;
  deployId?: string;
  error?: string;
  duration: number;
  files: number;
  size: string;
}

// Parser des arguments
function parseArgs(): DeployOptions {
  const args = process.argv.slice(2);
  const options: DeployOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
      case '-e':
      case '--env':
        options.env = nextArg as 'staging' | 'production';
        i++;
        break;
      case '-s':
      case '--site':
        options.site = nextArg;
        i++;
        break;
      case '-f':
      case '--force':
        options.force = true;
        break;
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;
      case '-d':
      case '--dry-run':
        options.dryRun = true;
        break;
      case '-h':
      case '--help':
        showHelp();
        process.exit(0);
    }
  }
  
  return options;
}

// Afficher l'aide
function showHelp() {
  console.log(`
🚀 ECOFUNDRIVE V3 - Script de Déploiement

USAGE:
  tsx scripts/deploy.ts [options]

OPTIONS:
  -e, --env <environnement>  Environnement: staging (défaut) ou production
  -s, --site <url>           URL du site Netlify
  -f, --force                Forcer le déploiement même si non nécessaire
  -v, --verbose              Mode verbeux
  -d, --dry-run              Simulation sans déploiement réel
  -h, --help                 Afficher cette aide

EXEMPLES:
  # Déploiement staging (défaut)
  tsx scripts/deploy.ts

  # Déploiement production
  tsx scripts/deploy.ts -e production

  # Simulation en mode verbeux
  tsx scripts/deploy.ts -d -v

VARIABLES D'ENVIRONNEMENT REQUISES:
  NETLIFY_TOKEN    Token d'authentification Netlify
  NETLIFY_SITE_ID  ID du site Netlify
  SITE_URL         URL du site
`);
}

// Valider la configuration
function validateConfig(options: DeployOptions): void {
  const requiredVars = ['NETLIFY_TOKEN', 'NETLIFY_SITE_ID', 'SITE_URL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    process.exit(1);
  }
  
  if (options.env && !['staging', 'production'].includes(options.env)) {
    console.error('❌ L\'environnement doit être "staging" ou "production"');
    process.exit(1);
  }
}

// Vérifier si le build est nécessaire
function needsBuild(): boolean {
  const distPath = join(process.cwd(), 'dist');
  return !existsSync(distPath);
}


// Builder le projet
async function buildProject(verbose: boolean = false): Promise<void> {
  console.log('🔨 Build du projet...');
  
  try {
    const command = 'pnpm build';
    const options = verbose ? { stdio: 'inherit' as const } : {};
    
    execSync(command, options);
    console.log('✅ Build terminé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du build:', error instanceof Error ? error.message : 'Erreur inconnue');
    throw error;
  }
}

// Analyser le build
function analyzeBuild(): { files: number; size: string } {
  const distPath = join(process.cwd(), 'dist');
  
  if (!existsSync(distPath)) {
    throw new Error('Le dossier dist n\'existe pas');
  }
  
  try {
    // Compter les fichiers (simplifié)
    const files = execSync(`find "${distPath}" -type f | wc -l`, { 
      encoding: 'utf8',
      shell: true
    }).trim();
    
    // Calculer la taille (simplifié)
    const sizeOutput = execSync(`du -sh "${distPath}"`, { 
      encoding: 'utf8',
      shell: true
    }).trim();
    
    const size = sizeOutput.split('\t')[0];
    
    return {
      files: parseInt(files),
      size
    };
  } catch (error) {
    console.warn('⚠️ Impossible d\'analyser le build, utilisation de valeurs par défaut');
    return {
      files: 0,
      size: '0B'
    };
  }
}

// Déployer sur Netlify
async function deployToNetlify(
  env: 'staging' | 'production',
  verbose: boolean = false
): Promise<DeployResult> {
  const startTime = Date.now();
  
  console.log(`🚀 Déploiement sur Netlify (${env})...`);
  
  try {
    // Analyser le build
    const buildInfo = analyzeBuild();
    console.log(`📦 Build: ${buildInfo.files} fichiers, ${buildInfo.size}`);
    
    // Préparer la commande Netlify
    const command = env === 'production' 
      ? 'netlify deploy --prod --dir=dist'
      : 'netlify deploy --dir=dist';
    
    if (verbose) {
      console.log(`🔧 Commande: ${command}`);
    }
    
    // Exécuter le déploiement
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: verbose ? 'inherit' : 'pipe'
    });
    
    // Extraire l'URL du déploiement
    const urlMatch = output.match(/Website URL:\s*(https:\/\/[^\s]+)/);
    const deployIdMatch = output.match(/Deploy ID:\s*([^\s]+)/);
    
    const url = urlMatch ? urlMatch[1] : process.env.SITE_URL;
    const deployId = deployIdMatch ? deployIdMatch[1] : undefined;
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Déploiement terminé en ${Math.round(duration / 1000)}s`);
    console.log(`🌐 URL: ${url}`);
    
    return {
      success: true,
      url,
      deployId,
      duration,
      files: buildInfo.files,
      size: buildInfo.size
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error('❌ Erreur lors du déploiement:', error instanceof Error ? error.message : 'Erreur inconnue');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      duration,
      files: 0,
      size: '0B'
    };
  }
}

// Simulation de déploiement
function simulateDeploy(env: 'staging' | 'production'): DeployResult {
  console.log(`🔍 Simulation de déploiement (${env})...`);
  
  const buildInfo = analyzeBuild();
  const duration = Math.random() * 5000 + 2000; // 2-7 secondes
  
  console.log(`📦 Build analysé: ${buildInfo.files} fichiers, ${buildInfo.size}`);
  console.log(`⏱️ Durée estimée: ${Math.round(duration / 1000)}s`);
  console.log(`🌐 URL simulée: ${process.env.SITE_URL}`);
  
  return {
    success: true,
    url: process.env.SITE_URL,
    deployId: 'sim-' + Date.now(),
    duration,
    files: buildInfo.files,
    size: buildInfo.size
  };
}

// Vérifier le déploiement
async function verifyDeployment(url: string): Promise<boolean> {
  console.log('🔍 Vérification du déploiement...');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('✅ Site accessible');
      return true;
    } else {
      console.warn(`⚠️ Site répond avec le statut: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error instanceof Error ? error.message : 'Erreur inconnue');
    return false;
  }
}

// Envoyer une notification Slack (optionnel)
async function notifySlack(
  result: DeployResult,
  env: 'staging' | 'production'
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    if (env === 'production') {
      console.log('ℹ️ SLACK_WEBHOOK_URL non configuré, pas de notification');
    }
    return;
  }
  
  const message = {
    text: result.success 
      ? `✅ ECOFUNDRIVE V3 déployé avec succès sur ${env}`
      : `❌ Échec du déploiement sur ${env}`,
    attachments: [{
      color: result.success ? 'good' : 'danger',
      fields: [
        {
          title: 'URL',
          value: result.url || 'N/A',
          short: true
        },
        {
          title: 'Durée',
          value: `${Math.round(result.duration / 1000)}s`,
          short: true
        },
        {
          title: 'Fichiers',
          value: result.files.toString(),
          short: true
        },
        {
          title: 'Taille',
          value: result.size,
          short: true
        }
      ]
    }]
  };
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    
    if (response.ok) {
      console.log('📢 Notification Slack envoyée');
    } else {
      console.error('❌ Erreur lors de l\'envoi de la notification Slack:', response.statusText);
    }
  } catch (error) {
    console.warn('⚠️ Erreur lors de l\'envoi de la notification Slack:', error instanceof Error ? error.message : 'Erreur inconnue');
  }
}

// Fonction principale
async function main(): Promise<void> {
  console.log('🚀 ECOFUNDRIVE V3 - Déploiement Netlify');
  console.log('='.repeat(60));
  
  const options = parseArgs();
  const env = options.env || 'staging';
  
  validateConfig(options);
  
  try {
    // Vérifier si le build est nécessaire
    if (needsBuild()) {
      await buildProject(options.verbose);
    } else if (options.force) {
      console.log('🔄 Build forcé...');
      await buildProject(options.verbose);
    } else {
      console.log('✅ Build déjà à jour');
    }
    
    // Déploiement ou simulation
    let result: DeployResult;
    
    if (options.dryRun) {
      result = simulateDeploy(env);
    } else {
      result = await deployToNetlify(env, options.verbose);
      
      // Vérifier le déploiement si succès
      if (result.success && result.url) {
        await verifyDeployment(result.url);
      }
    }
    
    // Notification Slack
    if (!options.dryRun) {
      await notifySlack(result, env);
    }
    
    // Afficher le résumé
    console.log('\n📋 RÉSUMÉ DU DÉPLOIEMENT');
    console.log('='.repeat(60));
    console.log(`Environnement: ${env}`);
    console.log(`Statut: ${result.success ? '✅ Succès' : '❌ Échec'}`);
    
    if (result.success) {
      console.log(`URL: ${result.url}`);
      console.log(`Durée: ${Math.round(result.duration / 1000)}s`);
      console.log(`Fichiers: ${result.files}`);
      console.log(`Taille: ${result.size}`);
    } else {
      console.log(`Erreur: ${result.error}`);
    }
    
    // Sortir avec le bon code
    process.exit(result.success ? 0 : 1);
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error instanceof Error ? error.message : 'Erreur inconnue');
    
    if (options.verbose) {
      console.error('\nDétails:', error);
    }
    
    process.exit(1);
  }
}

// Gérer les interruptions
process.on('SIGINT', () => {
  console.log('\n\n⏹️ Déploiement interrompu');
  process.exit(0);
});

// Démarrer le script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Erreur non gérée:', error);
    process.exit(1);
  });
}

export { main, parseArgs, validateConfig, buildProject, deployToNetlify, verifyDeployment };
