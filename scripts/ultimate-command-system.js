#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - SYSTÈME COMMANDE DIRECTE ULTIME
// "site complet" + mots-clés → site live 30min
// "mise a jour" + mots-clés → maj 5min
// ═══════════════════════════════════════════════════════════

const { CompleteSiteGenerator } = require('./site-complete-generator');
const { SiteUpdateGenerator } = require('./site-update-generator');

class UltimateCommandSystem {
  constructor() {
    this.args = process.argv.slice(2);
    this.mode = null;
    this.keywords = [];
    this.options = {
      domain: 'ecofundrive.com',
      verbose: false,
      dryRun: false
    };
  }

  // Afficher le logo et message d'accueil
  showWelcome() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 ECOFUNDRIVE V3 - SYSTÈME COMMANDE DIRECTE ULTIME      ║
║                                                              ║
║   Mots-clés → Site Complet → Live en 30 minutes             ║
║   Mots-clés → Mise à Jour → Live en 5 minutes               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
  }

  // Afficher l'aide
  showHelp() {
    console.log(`
🚀 SYSTÈME COMMANDE DIRECTE - ECOFUNDRIVE V3

USAGE:
  node ultimate-command-system.js <commande> [mots-clés...] [options]

COMMANDES:
  site complet          Génère un site COMPLET depuis mots-clés
  mise a jour          Met à jour le site avec nouveaux articles
  help, --help         Affiche cette aide

MOTS-CLÉS:
  Entrez vos mots-clés après la commande
  Ex: "golf st tropez" "restaurant monaco" "hotel cannes"
  
OPTIONS:
  --domain <nom>       Domaine personnalisé (défaut: ecofundrive.com)
  --verbose            Affichage détaillé
  --dry-run            Mode test (ne déploie pas)
  
EXEMPLES:
  # Site complet premier lancement
  node ultimate-command-system.js site complet "golf st tropez" "restaurant monaco"
  
  # Mise à jour avec nouveau contenu
  node ultimate-command-system.js mise a jour "windsurf camargue" "kitesurf mediterranee"
  
  # Avec domaine personnalisé
  node ultimate-command-system.js site complet --domain monsite.com "spa luxe"
  
  # Mode test
  node ultimate-command-system.js site complet --dry-run "test article"

RÉSULTATS:
  ✅ Site complet en 30 minutes maximum
  ✅ Mise à jour en 5 minutes maximum  
  ✅ Déploiement automatique Netlify
  ✅ SEO optimisé automatiquement
  ✅ Images adaptées générées
  ✅ Rapport détaillé fourni

DOMAINES SUPPORTÉS:
  - Tous les domaines Netlify
  - Configuration automatique
  - HTTPS obligatoire
  - Analytics intégrés

TEMPLATES DISPONIBLES:
  🏌️ Golf        🍽️ Restaurant    🏨 Hôtel
  🛍️ Shopping    🎭 Événement     🤖 Auto-détection

⏡ TEMPS D'EXÉCUTION:
  Site complet: 20-30 minutes
  Mise à jour: 3-5 minutes
  Déploiement: 1-2 minutes
  
🚀 PRÊT À LANCER VOTRE SITE ?
`);
  }

  // Parser les arguments
  parseArgs() {
    if (this.args.length === 0) {
      this.showWelcome();
      this.showHelp();
      process.exit(0);
    }

    // Extraire la commande
    const commandArg = this.args[0].toLowerCase();
    
    if (commandArg === 'help' || commandArg === '--help') {
      this.showHelp();
      process.exit(0);
    }

    // Déterminer le mode
    if (commandArg === 'site' && this.args[1] === 'complet') {
      this.mode = 'complete-site';
      // Extraire les mots-clés (après "site complet")
      this.keywords = this.args.slice(2);
    } else if (commandArg === 'mise' && this.args[1] === 'a' && this.args[2] === 'jour') {
      this.mode = 'incremental-update';
      // Extraire les mots-clés (après "mise a jour")
      this.keywords = this.args.slice(3);
    } else {
      console.error('❌ Commande non reconnue. Utilisez "site complet" ou "mise a jour"');
      console.log('💡 Utilisez --help pour voir l\'aide complète');
      process.exit(1);
    }

    // Parser les options
    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];
      
      switch (arg) {
        case '--domain':
          this.options.domain = this.args[++i];
          break;
        case '--verbose':
          this.options.verbose = true;
          break;
        case '--dry-run':
          this.options.dryRun = true;
          break;
      }
    }

    // Filtrer les mots-clés (enlever les options)
    this.keywords = this.keywords.filter(arg => !arg.startsWith('--'));
    
    if (this.keywords.length === 0) {
      console.error('❌ Veuillez spécifier au moins un mot-clé');
      console.log('💡 Exemple: node ultimate-command-system.js site complet "golf st tropez"');
      process.exit(1);
    }
  }

  // Afficher le résumé de la commande
  showCommandSummary() {
    const modeText = this.mode === 'complete-site' ? 'SITE COMPLET' : 'MISE À JOUR';
    const timeEstimate = this.mode === 'complete-site' ? '30 minutes' : '5 minutes';
    
    console.log(`
📋 RÉSUMÉ DE LA COMMANDE:
══════════════════════════
🎯 Mode: ${modeText}
🌐 Domaine: ${this.options.domain}
📝 Mots-clés: ${this.keywords.length}
⏱️ Temps estimé: ${timeEstimate}
🧪 Mode test: ${this.options.dryRun ? 'Oui' : 'Non'}
📊 Verbose: ${this.options.verbose ? 'Oui' : 'Non'}

📝 MOTS-CLÉS À TRAITER:
${this.keywords.map((kw, index) => `  ${index + 1}. "${kw}"`).join('\n')}

🚀 DÉMARRAGE AUTOMATIQUE...
`);
  }

  // Afficher la progression
  showProgress(step, totalSteps, description) {
    const percent = Math.round((step / totalSteps) * 100);
    const bar = '█'.repeat(Math.floor(percent / 5)) + '░'.repeat(20 - Math.floor(percent / 5));
    
    process.stdout.write(`\r⏳ [${bar}] ${percent}% - ${description}`);
    
    if (step === totalSteps) {
      console.log(); // Nouvelle ligne à la fin
    }
  }

  // Exécuter la génération de site complet
  async executeCompleteSite() {
    console.log('🏗️ MODE: GÉNÉRATION SITE COMPLET');
    console.log('================================');
    
    const totalSteps = 9;
    let currentStep = 0;
    
    try {
      const generator = new CompleteSiteGenerator();
      
      // Configurer le domaine si personnalisé
      if (this.options.domain !== 'ecofundrive.com') {
        generator.config.domain = this.options.domain;
      }
      
      this.showProgress(++currentStep, totalSteps, 'Création structure site...');
      generator.createSiteStructure();
      
      this.showProgress(++currentStep, totalSteps, 'Génération styles CSS...');
      generator.generateGlobalStyles();
      
      this.showProgress(++currentStep, totalSteps, 'Génération scripts JavaScript...');
      generator.generateGlobalScripts();
      
      this.showProgress(++currentStep, totalSteps, 'Génération articles depuis mots-clés...');
      const articlesResult = generator.generateArticlesFromKeywords(this.keywords);
      
      this.showProgress(++currentStep, totalSteps, 'Génération homepage...');
      generator.generateHomepage(articlesResult.articles);
      
      this.showProgress(++currentStep, totalSteps, 'Génération pages additionnelles...');
      generator.generateAdditionalPages();
      
      this.showProgress(++currentStep, totalSteps, 'Génération fichiers SEO...');
      generator.generateSEOFiles();
      
      if (!this.options.dryRun) {
        this.showProgress(++currentStep, totalSteps, 'Déploiement sur Netlify...');
        const deploymentResult = await generator.deployToNetlify();
      } else {
        this.showProgress(++currentStep, totalSteps, 'MODE TEST - Pas de déploiement...');
        const deploymentResult = {
          url: `https://${this.options.domain}.netlify.app (TEST)`,
          status: 'test'
        };
      }
      
      this.showProgress(++currentStep, totalSteps, 'Génération rapport final...');
      
      // Générer le rapport final
      const executionTime = Date.now() - this.startTime;
      const report = generator.generateFinalReport(
        this.options.dryRun ? { url: `https://${this.options.domain}.netlify.app (TEST)` } : deploymentResult,
        this.keywords,
        executionTime
      );
      
      return report;
      
    } catch (error) {
      console.error('\n❌ ERREUR GÉNÉRATION SITE COMPLET:', error.message);
      throw error;
    }
  }

  // Exécuter la mise à jour incrémentielle
  async executeIncrementalUpdate() {
    console.log('🔄 MODE: MISE À JOUR INCRÉMENTALE');
    console.log('=================================');
    
    const totalSteps = 6;
    let currentStep = 0;
    
    try {
      const generator = new SiteUpdateGenerator();
      
      // Configurer le domaine si personnalisé
      if (this.options.domain !== 'ecofundrive.com') {
        generator.config.domain = this.options.domain;
      }
      
      this.showProgress(++currentStep, totalSteps, 'Vérification site existant...');
      generator.checkSiteExists();
      
      this.showProgress(++currentStep, totalSteps, 'Chargement articles existants...');
      generator.loadExistingArticles();
      
      this.showProgress(++currentStep, totalSteps, 'Génération nouveaux articles...');
      generator.generateNewArticles(this.keywords);
      
      if (generator.newContent.articles.length === 0) {
        console.log('\nℹ️ Aucun nouvel article à ajouter');
        return null;
      }
      
      this.showProgress(++currentStep, totalSteps, 'Mise à jour pages existantes...');
      generator.updateHomepage();
      generator.updateArticlesListPage();
      generator.updateArticlesIndex();
      generator.updateSitemap();
      
      if (!this.options.dryRun) {
        this.showProgress(++currentStep, totalSteps, 'Déploiement mise à jour...');
        const deploymentResult = await generator.deployIncrementalUpdate();
      } else {
        this.showProgress(++currentStep, totalSteps, 'MODE TEST - Pas de déploiement...');
        const deploymentResult = {
          url: `https://${this.options.domain}.netlify.app (TEST)`,
          status: 'test'
        };
      }
      
      this.showProgress(++currentStep, totalSteps, 'Génération rapport mise à jour...');
      
      // Générer le rapport
      const executionTime = Date.now() - this.startTime;
      const report = generator.generateUpdateReport(
        this.options.dryRun ? { url: `https://${this.options.domain}.netlify.app (TEST)` } : deploymentResult,
        this.keywords,
        executionTime
      );
      
      return report;
      
    } catch (error) {
      console.error('\n❌ ERREUR MISE À JOUR INCRÉMENTALE:', error.message);
      throw error;
    }
  }

  // Afficher le message de succès final
  showSuccessMessage(report) {
    if (!report) return;
    
    const mode = this.mode === 'complete-site' ? 'SITE COMPLET' : 'MISE À JOUR';
    const siteUrl = report.urls.production;
    
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                     🎉 SUCCÈS ! 🎉                        ║
║                                                              ║
║   ${mode.padEnd(54)} ║
║                                                              ║
║   🌐 Votre site est en ligne:                              ║
║   ${siteUrl.padEnd(54)} ║
║                                                              ║
║   📊 Statistiques:                                          ║
║   • Articles: ${report.content?.articles?.total || report.update?.totalArticlesCount || 0}                              ║
║   • Pages: ${report.content?.pages?.total || report.content?.existing?.pages || 0}                                 ║
║   • Temps: ${Math.round((report.generation?.executionTime || report.update?.executionTime || 0) / 1000)}s                              ║
║                                                              ║
║   🎯 Prochaines étapes:                                     ║
║   1. Visiter votre site                                     ║
║   2. Configurer Analytics                                   ║
║   3. Ajouter les images réelles                             ║
║   4. Soumettre à Google                                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
  }

  // Méthode principale d'exécution
  async execute() {
    this.startTime = Date.now();
    
    try {
      this.showWelcome();
      this.parseArgs();
      this.showCommandSummary();
      
      let report = null;
      
      if (this.mode === 'complete-site') {
        report = await this.executeCompleteSite();
      } else if (this.mode === 'incremental-update') {
        report = await this.executeIncrementalUpdate();
      }
      
      this.showSuccessMessage(report);
      
    } catch (error) {
      console.error('\n💥 ERREUR CRITIQUE:', error.message);
      
      if (this.options.verbose) {
        console.error('Stack trace:', error.stack);
      }
      
      process.exit(1);
    }
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  const commandSystem = new UltimateCommandSystem();
  commandSystem.execute().catch(error => {
    console.error('💥 Erreur système:', error);
    process.exit(1);
  });
}

module.exports = { UltimateCommandSystem };
