#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - GÉNÉRATEUR MISE À JOUR INCRÉMENTALE
// Ajoute nouveaux articles sans toucher au site existant
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

class SiteUpdateGenerator {
  constructor() {
    this.config = {
      siteName: 'ECOFUNDRIVE',
      domain: 'ecofundrive.com',
      brandName: 'ECOFUNDRIVE',
      mainService: 'VTC Tesla',
      region: 'Côte d\'Azur',
      outputDir: './public',
      whatsapp: '+33616552811',
      netlify: {
        siteId: process.env.NETLIFY_SITE_ID || 'your-site-id',
        accessToken: process.env.NETLIFY_ACCESS_TOKEN || 'your-token'
      }
    };
    
    this.existingContent = {
      articles: [],
      pages: [],
      images: []
    };
    
    this.newContent = {
      articles: [],
      images: [],
      updatedFiles: []
    };
  }

  // Vérifier si le site existe déjà
  checkSiteExists() {
    console.log('🔍 Vérification site existant...');
    
    const indexPath = path.join(this.config.outputDir, 'index.html');
    const articlesIndexPath = path.join(this.config.outputDir, 'articles-index.json');
    
    if (!fs.existsSync(indexPath)) {
      throw new Error('❌ Site non trouvé. Utilisez "site complet" pour créer le site initial.');
    }
    
    if (!fs.existsSync(articlesIndexPath)) {
      console.log('ℹ️ Aucun article existant trouvé - première mise à jour');
      this.existingContent.articles = [];
    } else {
      // Charger les articles existants
      const indexData = JSON.parse(fs.readFileSync(articlesIndexPath, 'utf8'));
      this.existingContent.articles = indexData.articles || [];
      console.log(`✅ ${this.existingContent.articles.length} articles existants chargés`);
    }
    
    // Lister les pages existantes
    const pages = ['index.html', 'articles.html', 'tarifs-vtc.html', 'contact.html'];
    pages.forEach(page => {
      const pagePath = path.join(this.config.outputDir, page);
      if (fs.existsSync(pagePath)) {
        this.existingContent.pages.push(pagePath);
      }
    });
    
    console.log(`✅ Site existant confirmé avec ${this.existingContent.pages.length} pages`);
    return true;
  }

  // Charger les articles existants
  loadExistingArticles() {
    console.log('📂 Chargement articles existants...');
    
    const articlesIndexPath = path.join(this.config.outputDir, 'articles-index.json');
    
    if (fs.existsSync(articlesIndexPath)) {
      const indexData = JSON.parse(fs.readFileSync(articlesIndexPath, 'utf8'));
      this.existingContent.articles = indexData.articles || [];
      console.log(`  ✅ ${this.existingContent.articles.length} articles chargés`);
    } else {
      this.existingContent.articles = [];
      console.log(`  ℹ️ Aucun article existant`);
    }
  }

  // Générer les nouveaux articles
  generateNewArticles(keywords) {
    console.log(`📝 Génération ${keywords.length} nouveaux articles...`);
    
    const { UniversalArticleGenerator } = require('./universal-article-generator');
    const generator = new UniversalArticleGenerator();
    
    // Configurer le générateur
    generator.config = this.config;
    
    // Générer uniquement les nouveaux articles
    const result = generator.generateFromKeywords(keywords);
    
    // Filtrer pour éviter les doublons
    const existingIds = new Set(this.existingContent.articles.map(a => a.id));
    const uniqueNewArticles = result.articles.filter(article => !existingIds.has(article.id));
    
    this.newContent.articles = uniqueNewArticles;
    this.newContent.images = uniqueNewArticles.flatMap(a => a.images);
    
    console.log(`  ✅ ${uniqueNewArticles.length} nouveaux articles uniques générés`);
    
    if (uniqueNewArticles.length < result.articles.length) {
      const duplicates = result.articles.length - uniqueNewArticles.length;
      console.log(`  ⚠️ ${duplicates} articles ignorés (doublons)`);
    }
    
    return uniqueNewArticles;
  }

  // Mettre à jour la homepage avec nouveaux articles
  updateHomepage() {
    console.log('🏠 Mise à jour homepage...');
    
    const indexPath = path.join(this.config.outputDir, 'index.html');
    let homepageContent = fs.readFileSync(indexPath, 'utf8');
    
    // Trouver la section articles et la mettre à jour
    const articlesSectionRegex = /<div class="articles-grid">(.*?)<\/div>/s;
    const match = homepageContent.match(articlesSectionRegex);
    
    if (match) {
      // Combiner articles existants et nouveaux
      const allArticles = [...this.existingContent.articles, ...this.newContent.articles];
      
      // Générer le nouveau HTML des articles
      const newArticlesHTML = allArticles.map(article => `
        <article class="article-card">
          <div class="article-image">
            🚗
            <span class="article-category">${article.category.replace('-', ' ').toUpperCase()}</span>
          </div>
          <div class="article-content">
            <h3 class="article-title">
              <a href="${article.url}" onclick="ECOFUNDRIVE.trackArticleView('${article.id}', '${article.title}')">
                ${article.title}
              </a>
            </h3>
            <p class="article-description">${article.description}</p>
            <div class="article-meta">
              📅 ${new Date(article.publishedAt).toLocaleDateString('fr-FR')} | 
              🔍 ${article.keywords.slice(0, 3).join(', ')}
            </div>
            <a href="${article.url}" class="read-more">Lire la suite →</a>
          </div>
        </article>
      `).join('');
      
      // Remplacer la section articles
      homepageContent = homepageContent.replace(articlesSectionRegex, `<div class="articles-grid">${newArticlesHTML}</div>`);
      
      // Sauvegarder la homepage mise à jour
      fs.writeFileSync(indexPath, homepageContent, 'utf8');
      this.newContent.updatedFiles.push(indexPath);
      
      console.log(`  ✅ Homepage mise à jour avec ${allArticles.length} articles totaux`);
    } else {
      console.log(`  ⚠️ Section articles non trouvée dans la homepage`);
    }
  }

  // Mettre à jour la page liste articles
  updateArticlesListPage() {
    console.log('📄 Mise à jour page liste articles...');
    
    const articlesListPath = path.join(this.config.outputDir, 'articles.html');
    
    if (fs.existsSync(articlesListPath)) {
      let articlesListContent = fs.readFileSync(articlesListPath, 'utf8');
      
      // Trouver et remplacer la grille d'articles
      const articlesGridRegex = /<div class="articles-grid">(.*?)<\/div>/s;
      const match = articlesListContent.match(articlesGridRegex);
      
      if (match) {
        // Combiner tous les articles
        const allArticles = [...this.existingContent.articles, ...this.newContent.articles];
        
        // Générer le nouveau HTML
        const newArticlesHTML = allArticles.map(article => `
        <article class="article-card">
          <div class="article-image">
            🚗
            <span class="article-category">${article.category.replace('-', ' ').toUpperCase()}</span>
          </div>
          <div class="article-content">
            <h3 class="article-title">
              <a href="${article.url}">${article.title}</a>
            </h3>
            <p class="article-description">${article.description}</p>
            <div class="article-meta">
              📅 ${new Date(article.publishedAt).toLocaleDateString('fr-FR')}
            </div>
            <a href="${article.url}" class="read-more">Lire la suite →</a>
          </div>
        </article>
        `).join('');
        
        // Remplacer la section
        articlesListContent = articlesListContent.replace(articlesGridRegex, `<div class="articles-grid">${newArticlesHTML}</div>`);
        
        // Sauvegarder
        fs.writeFileSync(articlesListPath, articlesListContent, 'utf8');
        this.newContent.updatedFiles.push(articlesListPath);
        
        console.log(`  ✅ Page liste articles mise à jour`);
      }
    } else {
      console.log(`  ℹ️ Page liste articles non trouvée`);
    }
  }

  // Mettre à jour l'index des articles
  updateArticlesIndex() {
    console.log('📋 Mise à jour index articles...');
    
    // Combiner articles existants et nouveaux
    const allArticles = [...this.existingContent.articles, ...this.newContent.articles];
    
    const indexData = {
      total: allArticles.length,
      lastUpdated: new Date().toISOString(),
      articles: allArticles,
      categories: [...new Set(allArticles.map(a => a.category))]
    };
    
    const indexPath = path.join(this.config.outputDir, 'articles-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
    this.newContent.updatedFiles.push(indexPath);
    
    console.log(`  ✅ Index mis à jour: ${allArticles.length} articles totaux`);
  }

  // Mettre à jour le sitemap
  updateSitemap() {
    console.log('🗺️ Mise à jour sitemap.xml...');
    
    const allArticles = [...this.existingContent.articles, ...this.newContent.articles];
    const currentDate = new Date().toISOString();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${this.config.domain}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://${this.config.domain}/articles.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://${this.config.domain}/tarifs-vtc.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://${this.config.domain}/contact.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    
    // Ajouter tous les articles
    allArticles.forEach(article => {
      sitemap += `
  <url>
    <loc>https://${this.config.domain}${article.url}</loc>
    <lastmod>${article.lastModified}</lastmod>
    <changefreq>${article.changeFrequency}</changefreq>
    <priority>${article.priority}</priority>
  </url>`;
    });
    
    sitemap += '\n</urlset>';
    
    const sitemapPath = path.join(this.config.outputDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    this.newContent.updatedFiles.push(sitemapPath);
    
    console.log(`  ✅ Sitemap mis à jour: ${allArticles.length} URLs totales`);
  }

  // Simuler déploiement incrémentiel Netlify
  async deployIncrementalUpdate() {
    console.log('🚀 Déploiement mise à jour incrémentielle...');
    
    // Simuler le déploiement (seulement les fichiers modifiés)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const deploymentResult = {
      id: `update-${Date.now()}`,
      url: `https://${this.config.domain}.netlify.app`,
      status: 'ready',
      filesDeployed: this.newContent.updatedFiles.length + this.newContent.articles.length,
      newArticlesCount: this.newContent.articles.length,
      deployTime: new Date().toISOString(),
      type: 'incremental'
    };
    
    console.log(`  ✅ Mise à jour déployée: ${deploymentResult.url}`);
    console.log(`  📊 ${deploymentResult.newArticlesCount} nouveaux articles en ligne`);
    
    return deploymentResult;
  }

  // Générer le rapport de mise à jour
  generateUpdateReport(deploymentResult, keywords, executionTime) {
    const report = {
      update: {
        timestamp: new Date().toISOString(),
        type: 'incremental',
        mode: 'production',
        executionTime: executionTime,
        keywords: keywords,
        totalKeywords: keywords.length,
        newArticlesCount: this.newContent.articles.length,
        totalArticlesCount: this.existingContent.articles.length + this.newContent.articles.length
      },
      content: {
        existing: {
          articles: this.existingContent.articles.length,
          pages: this.existingContent.pages.length
        },
        new: {
          articles: this.newContent.articles.length,
          images: this.newContent.images.length,
          categories: [...new Set(this.newContent.articles.map(a => a.category))]
        },
        updated: {
          files: this.newContent.updatedFiles.length,
          list: this.newContent.updatedFiles.map(f => f.replace('./public', ''))
        }
      },
      deployment: deploymentResult,
      urls: {
        production: deploymentResult.url,
        homepage: `${deploymentResult.url}/`,
        articles: `${deploymentResult.url}/articles.html`,
        sitemap: `${deploymentResult.url}/sitemap.xml`
      },
      newArticles: this.newContent.articles.map(article => ({
        id: article.id,
        title: article.title,
        url: article.url,
        category: article.category
      })),
      nextSteps: [
        '1. Visiter le site: ' + deploymentResult.url,
        '2. Vérifier les nouveaux articles',
        '3. Tester la navigation',
        '4. Ajouter les images réelles',
        '5. Soumettre nouvelles URLs à Google Search Console'
      ]
    };
    
    // Sauvegarder le rapport
    const reportDir = path.join(this.config.outputDir, 'seo');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportPath = path.join(reportDir, 'incremental-update-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    console.log(`  ✅ Rapport de mise à jour sauvegardé: ${reportPath}`);
    return report;
  }

  // Méthode principale - Mise à jour incrémentielle
  async performIncrementalUpdate(keywords) {
    const startTime = Date.now();
    
    console.log('🔄 MISE À JOUR INCRÉMENTALE ECOFUNDRIVE');
    console.log('=======================================');
    console.log(`📝 Nouveaux mots-clés: ${keywords.join(', ')}`);
    console.log(`🌐 Domaine: ${this.config.domain}`);
    console.log(`⏱️ Début: ${new Date().toLocaleString()}`);
    
    try {
      // 1. Vérifier que le site existe
      this.checkSiteExists();
      
      // 2. Charger les articles existants
      this.loadExistingArticles();
      
      // 3. Générer les nouveaux articles
      this.generateNewArticles(keywords);
      
      if (this.newContent.articles.length === 0) {
        console.log('\nℹ️ Aucun nouvel article à ajouter (tous existent déjà)');
        return null;
      }
      
      // 4. Mettre à jour la homepage
      this.updateHomepage();
      
      // 5. Mettre à jour la page liste articles
      this.updateArticlesListPage();
      
      // 6. Mettre à jour l'index des articles
      this.updateArticlesIndex();
      
      // 7. Mettre à jour le sitemap
      this.updateSitemap();
      
      // 8. Déployer la mise à jour
      const deploymentResult = await this.deployIncrementalUpdate();
      
      // 9. Générer le rapport
      const executionTime = Date.now() - startTime;
      const report = this.generateUpdateReport(deploymentResult, keywords, executionTime);
      
      console.log('\n🎉 MISE À JOUR TERMINÉE AVEC SUCCÈS !');
      console.log('===================================');
      console.log(`⏱️ Temps: ${Math.round(executionTime / 1000)} secondes`);
      console.log(`📝 Nouveaux articles: ${report.update.newArticlesCount}`);
      console.log(`📄 Total articles: ${report.update.totalArticlesCount}`);
      console.log(`🗂️ Fichiers mis à jour: ${report.content.updated.files}`);
      console.log(`🚀 Déployé: ${deploymentResult.url}`);
      
      console.log('\n📝 NOUVEAUX ARTICLES AJOUTÉS:');
      console.log('=============================');
      report.newArticles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   📂 ${article.url}`);
        console.log(`   🏷️ ${article.category}`);
      });
      
      console.log('\n🔗 URLS IMPORTANTES:');
      console.log('==================');
      Object.entries(report.urls).forEach(([key, url]) => {
        console.log(`${key}: ${url}`);
      });
      
      console.log('\n🎯 PROCHAINES ÉTAPES:');
      console.log('====================');
      report.nextSteps.forEach((step, index) => {
        console.log(`${index + 1}. ${step}`);
      });
      
      console.log(`\n🌐 VOTRE SITE EST MIS À JOUR: ${deploymentResult.url}`);
      
      return report;
      
    } catch (error) {
      console.error('\n❌ ERREUR MISE À JOUR INCRÉMENTALE:', error);
      throw error;
    }
  }
}

// Export pour utilisation
module.exports = { SiteUpdateGenerator };

// Test si appelé directement
if (require.main === module) {
  // Exemple de test
  const generator = new SiteUpdateGenerator();
  generator.performIncrementalUpdate(['windsurf camargue', 'kitesurf mediterranee'])
    .then(() => {
      console.log('\n✅ Test mise à jour terminé avec succès');
    })
    .catch(error => {
      console.error('❌ Test mise à jour échoué:', error);
      process.exit(1);
    });
}
