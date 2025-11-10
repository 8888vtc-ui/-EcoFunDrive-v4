#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - SYSTÈME COMPLET MISE À JOUR NETLIFY
// Ajoute 10 articles + met à jour SEO + déploie sur Netlify
// ═══════════════════════════════════════════════════════════

const { NetlifyIncrementalUpdater } = require('./netlify-incremental-updater');
const { NetlifyAPIManager } = require('./netlify-api-manager');

class NetlifyUpdateSystem {
  constructor() {
    this.updater = new NetlifyIncrementalUpdater();
    this.apiManager = new NetlifyAPIManager();
    this.config = {
      dryRun: process.argv.includes('--dry-run'),
      verbose: process.argv.includes('--verbose'),
      deploy: !process.argv.includes('--no-deploy')
    };
  }

  async executeFullUpdate() {
    console.log('🚀 SYSTÈME COMPLET MISE À JOUR NETLIFY ECOFUNDRIVE');
    console.log('=================================================');
    console.log(`🔧 Mode: ${this.config.dryRun ? 'DRY RUN (test)' : 'PRODUCTION'}`);
    console.log(`🚀 Déploiement: ${this.config.deploy ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`);
    console.log(`📊 Verbose: ${this.config.verbose ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`);
    console.log('');

    try {
      // 1. Vérifier la configuration Netlify
      if (this.config.deploy) {
        console.log('🔍 ÉTAPE 1: Vérification configuration Netlify...');
        if (!this.apiManager.validateConfig()) {
          throw new Error('Configuration Netlify invalide');
        }
        
        // Obtenir les infos du site
        const siteInfo = await this.apiManager.getSiteInfo();
        console.log(`  ✅ Site: ${siteInfo.name} (${siteInfo.ssl_url})`);
      }

      // 2. Exécuter la mise à jour incrémentale
      console.log('\n📝 ÉTAPE 2: Mise à jour incrémentale des articles...');
      const updateReport = await this.updater.executeIncrementalUpdate();
      
      if (this.config.verbose) {
        console.log('\n📊 Détails de la mise à jour:');
        console.log(`  - ${updateReport.update.newArticlesCount} nouveaux articles`);
        console.log(`  - ${updateReport.updatedFiles.length} fichiers mis à jour`);
        console.log(`  - ${updateReport.seo.newUrlsCount} nouvelles URLs SEO`);
      }

      // 3. Déployer sur Netlify si demandé
      let deploymentResult = null;
      if (this.config.deploy && !this.config.dryRun) {
        console.log('\n🚀 ÉTAPE 3: Déploiement sur Netlify...');
        
        // Préparer les fichiers pour déploiement
        const files = this.apiManager.prepareFilesForDeployment(this.updater.updatedFiles);
        console.log(`  📤 ${Object.keys(files).length} fichiers à uploader`);
        
        // Créer le déploiement
        deploymentResult = await this.apiManager.createDeployment(
          files,
          `Mise à jour ${updateReport.update.newArticlesCount} articles VTC - ${new Date().toISOString()}`
        );
        
        console.log(`  ✅ Déployé: ${deploymentResult.ssl_url}`);
        console.log(`  📊 Déploiement ID: ${deploymentResult.id}`);
      } else if (this.config.dryRun) {
        console.log('\n🧪 ÉTAPE 3: DRY RUN - Pas de déploiement réel');
        console.log('  ℹ️ Fichiers qui seraient déployés:');
        this.updater.updatedFiles.forEach(file => {
          console.log(`    - ${file.replace('./public', '')}`);
        });
      }

      // 4. Générer le rapport final
      console.log('\n📋 ÉTAPE 4: Génération rapport final...');
      const finalReport = this.generateFinalReport(updateReport, deploymentResult);
      
      // 5. Afficher le résumé
      this.displayFinalSummary(finalReport);
      
      return finalReport;

    } catch (error) {
      console.error('\n❌ ERREUR SYSTÈME MISE À JOUR:', error);
      
      if (this.config.verbose) {
        console.error('Stack trace:', error.stack);
      }
      
      throw error;
    }
  }

  generateFinalReport(updateReport, deploymentResult) {
    const finalReport = {
      execution: {
        timestamp: new Date().toISOString(),
        mode: this.config.dryRun ? 'dry-run' : 'production',
        deploy: this.config.deploy,
        success: true
      },
      update: updateReport.update,
      newArticles: updateReport.newArticles,
      seo: updateReport.seo,
      deployment: deploymentResult || {
        status: this.config.dryRun ? 'dry-run' : 'skipped',
        message: this.config.dryRun ? 'Mode test activé' : 'Déploiement désactivé'
      },
      files: {
        updated: updateReport.updatedFiles,
        total: updateReport.updatedFiles.length
      },
      urls: {
        production: deploymentResult ? deploymentResult.ssl_url : 'https://ecofundrive.com',
        articles: '/articles',
        sitemap: '/sitemap.xml',
        robots: '/robots.txt'
      },
      nextSteps: [
        '1. Visiter le site et tester les nouveaux articles',
        '2. Vérifier le sitemap mis à jour',
        '3. Soumettre les nouvelles URLs à Google Search Console',
        '4. Monitorer le trafic des nouveaux articles',
        '5. Analyser les performances SEO'
      ],
      monitoring: {
        googleSearchConsole: 'https://search.google.com/search-console',
        netlifyDeploys: deploymentResult ? `https://app.netlify.com/sites/${this.apiManager.config.siteId}/deploys` : null,
        analytics: 'https://analytics.google.com'
      }
    };

    // Sauvegarder le rapport
    const fs = require('fs');
    const path = require('path');
    
    const reportPath = path.join('./public/seo', 'netlify-update-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2), 'utf8');
    
    console.log(`  ✅ Rapport final sauvegardé: ${reportPath}`);
    
    return finalReport;
  }

  displayFinalSummary(report) {
    console.log('\n🎉 RÉSUMÉ EXÉCUTION COMPLÈTE');
    console.log('============================');
    
    console.log(`📝 ${report.update.newArticlesCount} nouveaux articles VTC créés`);
    console.log(`📄 ${report.files.total} fichiers mis à jour`);
    console.log(`🔗 ${report.seo.newUrlsCount} nouvelles URLs SEO`);
    
    if (report.deployment.status === 'ready') {
      console.log(`🚀 Déployé avec succès: ${report.deployment.ssl_url}`);
      console.log(`🆔 Déploiement ID: ${report.deployment.id}`);
    } else {
      console.log(`🧪 Mode: ${report.execution.mode.toUpperCase()}`);
    }
    
    console.log('\n📊 NOUVEAUX ARTICLES:');
    report.newArticles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title}`);
      console.log(`     📂 ${article.url}`);
      console.log(`     🏷️ ${article.category}`);
    });
    
    console.log('\n🔗 LIENS IMPORTANTS:');
    console.log(`  🌐 Site: ${report.urls.production}`);
    console.log(`  📚 Articles: ${report.urls.production}${report.urls.articles}`);
    console.log(`  🗺️ Sitemap: ${report.urls.production}${report.urls.sitemap}`);
    console.log(`  🤖 Robots: ${report.urls.production}${report.urls.robots}`);
    
    if (report.monitoring.netlifyDeploys) {
      console.log(`  🚀 Déploiements: ${report.monitoring.netlifyDeploys}`);
    }
    
    console.log('\n🎯 PROCHAINES ÉTAPES:');
    report.nextSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });
    
    console.log('\n✅ SYSTÈME ECOFUNDRIVE MIS À JOUR AVEC SUCCÈS !');
  }

  // Afficher l'aide
  showHelp() {
    console.log(`
🚀 SYSTÈME COMPLET MISE À JOUR NETLIFY - ECOFUNDRIVE V3

Usage:
  node netlify-update-system.js [options]

Options:
  --dry-run      Mode test (génère les fichiers mais ne déploie pas)
  --no-deploy    Désactive le déploiement Netlify
  --verbose      Affiche les détails complets
  --help         Affiche cette aide

Configuration requise:
  1. NETLIFY_ACCESS_TOKEN: Token d'accès Netlify
  2. NETLIFY_SITE_ID: ID du site Netlify

Variables d'environnement:
  export NETLIFY_ACCESS_TOKEN="your-token-here"
  export NETLIFY_SITE_ID="your-site-id-here"

Exemples:
  # Test complet sans déploiement
  node netlify-update-system.js --dry-run

  # Production avec déploiement
  node netlify-update-system.js

  # Verbose mode
  node netlify-update-system.js --verbose

  # Test sans déploiement Netlify
  node netlify-update-system.js --dry-run --no-deploy

Fichiers créés/mis à jour:
  ✅ 10 nouveaux articles VTC
  ✅ Sitemap.xml mis à jour
  ✅ Robots.txt mis à jour  
  ✅ Page liste articles
  ✅ Index articles JSON
  ✅ Rapport de mise à jour

Déploiement:
  🚀 Upload automatique sur Netlify
  📊 Monitoring en temps réel
  🔗 URLs mises à jour instantanément
`);
  }
}

// Exécution du script
async function main() {
  const updateSystem = new NetlifyUpdateSystem();
  
  const command = process.argv[2];
  
  if (command === '--help' || command === '-h') {
    updateSystem.showHelp();
    return;
  }
  
  try {
    await updateSystem.executeFullUpdate();
    process.exit(0);
  } catch (error) {
    console.error('\n💥 ÉCHEC SYSTÈME MISE À JOUR');
    process.exit(1);
  }
}

// Gestion des erreurs
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Lancer le système
if (require.main === module) {
  main();
}

module.exports = { NetlifyUpdateSystem };
