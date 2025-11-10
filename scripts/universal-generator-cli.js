#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - GÉNÉRATEUR UNIVERSEL LIGNE DE COMMANDE
// Mots-clés → Articles SEO complets avec photos adaptées
// ═══════════════════════════════════════════════════════════

const { UniversalArticleGenerator } = require('./universal-article-generator');

class UniversalGeneratorCLI {
  constructor() {
    this.generator = new UniversalArticleGenerator();
    this.args = process.argv.slice(2);
  }

  // Afficher l'aide
  showHelp() {
    console.log(`
🚀 GÉNÉRATEUR UNIVERSEL D'ARTICLES SEO - ECOFUNDRIVE V3

Usage:
  node universal-generator-cli.js [options] [mots-clés...]

Options:
  --help, -h              Afficher cette aide
  --domain <domain>       Domaine personnalisé (défaut: ecofundrive.com)
  --template <type>       Template spécifique (auto|golf|restaurant|hotel|shopping|evenement)
  --output <dir>          Répertoire de sortie (défaut: ./public)
  --preview               Mode aperçu (ne génère pas les fichiers)
  --verbose               Affichage détaillé
  --batch <file>          Fichier de mots-clés (un par ligne)

Templates disponibles:
  auto        🤖 Auto-détection du type de contenu
  golf        ⛳ Transport golf et installations sportives
  restaurant  🍽️ Gastronomie et restaurants étoilés
  hotel       🏨 Hôtels de luxe et hébergement
  shopping    🛍️ Boutiques et shopping premium
  evenement   🎭 Événements spéciaux et galas

Exemples:
  # Générer un article "golf st tropez"
  node universal-generator-cli.js "golf st tropez"

  # Plusieurs mots-clés avec domaine personnalisé
  node universal-generator-cli.js --domain monsite.com "restaurant monaco" "hotel cannes"

  # Template spécifique golf
  node universal-generator-cli.js --template golf "golf antibes" "golf nice"

  # Mode aperçu
  node universal-generator-cli.js --preview "shopping saint-tropez"

  # Fichier batch
  node universal-generator-cli.js --batch keywords.txt

  # Verbose mode
  node universal-generator-cli.js --verbose "evenement monte carlo"

Fichiers générés:
  ✅ Articles HTML optimisés SEO
  ✅ URLs d'images adaptées
  ✅ Meta tags Open Graph
  ✅ Liens internes automatiques
  ✅ Index d'articles mis à jour
  ✅ Rapport de génération complet

Configuration:
  - Aucune dépendance requise
  - Node.js 12+ compatible
  - 100% JavaScript pur
  - Export vers tous les CMS
`);
  }

  // Parser les arguments
  parseArgs() {
    const options = {
      keywords: [],
      domain: 'ecofundrive.com',
      template: 'auto',
      output: './public',
      preview: false,
      verbose: false,
      batchFile: null
    };

    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];
      
      switch (arg) {
        case '--help':
        case '-h':
          this.showHelp();
          process.exit(0);
          break;
          
        case '--domain':
          options.domain = this.args[++i];
          break;
          
        case '--template':
          options.template = this.args[++i];
          break;
          
        case '--output':
          options.output = this.args[++i];
          break;
          
        case '--preview':
          options.preview = true;
          break;
          
        case '--verbose':
          options.verbose = true;
          break;
          
        case '--batch':
          options.batchFile = this.args[++i];
          break;
          
        default:
          if (!arg.startsWith('--')) {
            options.keywords.push(arg);
          }
          break;
      }
    }

    return options;
  }

  // Charger les mots-clés depuis un fichier
  async loadKeywordsFromFile(filePath) {
    try {
      const fs = require('fs');
      const content = fs.readFileSync(filePath, 'utf8');
      const keywords = content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
      
      console.log(`📂 ${keywords.length} mots-clés chargés depuis ${filePath}`);
      return keywords;
    } catch (error) {
      console.error(`❌ Erreur lecture fichier ${filePath}:`, error.message);
      process.exit(1);
    }
  }

  // Afficher les détails en mode verbose
  logVerbose(message, data = null) {
    if (this.options.verbose) {
      console.log(`🔍 [VERBOSE] ${message}`);
      if (data) {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  }

  // Afficher l'aperçu d'un article
  showArticlePreview(article, index, total) {
    console.log(`\n📄 Article ${index + 1}/${total}: ${article.title}`);
    console.log(`   📂 URL: ${article.url}`);
    console.log(`   🏷️ Catégorie: ${article.category}`);
    console.log(`   📝 Description: ${article.description.substring(0, 100)}...`);
    console.log(`   🖼️ Images: ${article.images.length}`);
    console.log(`   🔍 Keywords: ${article.keywords.join(', ')}`);
    console.log(`   🔗 Liens internes: ${article.internalLinks.length}`);
    
    if (this.options.verbose) {
      console.log(`   📊 Détails complets:`);
      console.log(`     - ID: ${article.id}`);
      console.log(`     - Priorité: ${article.priority}`);
      console.log(`     - Fréquence: ${article.changeFrequency}`);
      console.log(`     - Images: ${article.images.map(img => img.url).join(', ')}`);
    }
  }

  // Générer le rapport
  generateReport(articles, options) {
    const report = {
      generation: {
        timestamp: new Date().toISOString(),
        mode: options.preview ? 'preview' : 'production',
        domain: options.domain,
        template: options.template,
        total: articles.length
      },
      articles: articles.map(article => ({
        id: article.id,
        title: article.title,
        url: article.url,
        category: article.category,
        imagesCount: article.images.length,
        keywordsCount: article.keywords.length,
        linksCount: article.internalLinks.length
      })),
      statistics: {
        totalArticles: articles.length,
        totalImages: articles.reduce((sum, a) => sum + a.images.length, 0),
        totalKeywords: articles.reduce((sum, a) => sum + a.keywords.length, 0),
        totalLinks: articles.reduce((sum, a) => sum + a.internalLinks.length, 0),
        categories: [...new Set(articles.map(a => a.category))]
      },
      files: {
        articles: articles.map(a => `./public/articles/${a.id}.html`),
        index: './public/articles-index.json',
        report: './public/seo/generation-report.json'
      },
      nextSteps: [
        '1. Ajouter les images réelles dans ./public/images/',
        '2. Mettre à jour le sitemap.xml avec les nouvelles URLs',
        '3. Déployer les fichiers sur votre serveur',
        '4. Soumettre les URLs à Google Search Console',
        '5. Monitorer le trafic et les performances'
      ]
    };

    // Sauvegarder le rapport
    if (!options.preview) {
      try {
        const fs = require('fs');
        const path = require('path');
        const reportDir = path.join(options.output, 'seo');
        
        if (!fs.existsSync(reportDir)) {
          fs.mkdirSync(reportDir, { recursive: true });
        }
        
        const reportPath = path.join(reportDir, 'generation-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
        
        console.log(`\n📋 Rapport sauvegardé: ${reportPath}`);
      } catch (error) {
        console.warn(`⚠️ Erreur sauvegarde rapport: ${error.message}`);
      }
    }

    return report;
  }

  // Exécuter la génération
  async execute() {
    console.log('🚀 GÉNÉRATEUR UNIVERSEL D\'ARTICLES SEO');
    console.log('=========================================');

    this.options = this.parseArgs();

    // Charger les mots-clés
    let keywords = this.options.keywords;
    
    if (this.options.batchFile) {
      keywords = await this.loadKeywordsFromFile(this.options.batchFile);
    }

    if (keywords.length === 0) {
      console.error('❌ Aucun mot-clé spécifié');
      console.log('💡 Utilisez --help pour voir l\'aide');
      process.exit(1);
    }

    console.log(`📝 Configuration:`);
    console.log(`   - Domaine: ${this.options.domain}`);
    console.log(`   - Template: ${this.options.template}`);
    console.log(`   - Mode: ${this.options.preview ? 'Aperçu' : 'Production'}`);
    console.log(`   - Mots-clés: ${keywords.length}`);
    console.log(`   - Verbose: ${this.options.verbose ? 'Oui' : 'Non'}`);

    if (this.options.verbose) {
      console.log(`\n📋 Mots-clés à traiter:`);
      keywords.forEach((keyword, index) => {
        console.log(`   ${index + 1}. ${keyword}`);
      });
    }

    console.log(`\n🔄 Démarrage génération...`);

    try {
      // Configurer le générateur
      if (this.options.domain !== 'ecofundrive.com') {
        this.generator.config.domain = this.options.domain;
      }
      
      if (this.options.template !== 'auto') {
        // Forcer le template
        const originalDetect = this.generator.detectContentType.bind(this.generator);
        this.generator.detectContentType = () => this.options.template;
      }

      // Générer les articles
      const result = this.generator.generateFromKeywords(keywords, this.options.domain);
      
      console.log(`\n✅ Génération terminée!`);
      console.log(`📊 ${result.total} articles générés avec succès`);

      // Afficher les aperçus
      console.log(`\n📄 Aperçu des articles générés:`);
      result.articles.forEach((article, index) => {
        this.showArticlePreview(article, index, result.total);
      });

      // Générer et afficher le rapport
      const report = this.generateReport(result.articles, this.options);
      
      console.log(`\n📊 STATISTIQUES:`);
      console.log(`   - Articles: ${report.statistics.totalArticles}`);
      console.log(`   - Images: ${report.statistics.totalImages}`);
      console.log(`   - Mots-clés SEO: ${report.statistics.totalKeywords}`);
      console.log(`   - Liens internes: ${report.statistics.totalLinks}`);
      console.log(`   - Catégories: ${report.statistics.categories.join(', ')}`);

      if (!this.options.preview) {
        console.log(`\n📁 FICHIERS CRÉÉS:`);
        report.files.articles.forEach(file => {
          console.log(`   ✅ ${file}`);
        });
        console.log(`   ✅ ${report.files.index}`);
        console.log(`   ✅ ${report.files.report}`);
      }

      console.log(`\n🎯 PROCHAINES ÉTAPES:`);
      report.nextSteps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step}`);
      });

      console.log(`\n🎉 GÉNÉRATION TERMINÉE AVEC SUCCÈS!`);

    } catch (error) {
      console.error(`\n❌ Erreur lors de la génération:`, error.message);
      
      if (this.options.verbose) {
        console.error(`Stack trace:`, error.stack);
      }
      
      process.exit(1);
    }
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  const cli = new UniversalGeneratorCLI();
  cli.execute().catch(error => {
    console.error('💥 Erreur critique:', error);
    process.exit(1);
  });
}

module.exports = { UniversalGeneratorCLI };
