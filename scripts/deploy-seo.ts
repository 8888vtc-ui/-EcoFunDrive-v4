#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - SCRIPT DÉPLOIEMENT SEO AUTOMATIQUE
// Crée et déploie tous les fichiers SEO fondamentaux
// ═══════════════════════════════════════════════════════════

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { SEOFundamentalsManager } from '../src/generators/seo/seo-fundamentals';
import { PerformanceOptimizationManager } from '../src/generators/seo/performance-optimization';
import type { PageSEO } from '../src/types/seo';

interface DeployConfig {
  outputDir: string;
  publicDir: string;
  generateSitemap: boolean;
  generateRobots: boolean;
  generateHTAccess: boolean;
  generatePerformanceConfig: boolean;
  enableAnalytics: boolean;
}

class SEODeploymentScript {
  private config: DeployConfig;
  private seoManager: SEOFundamentalsManager;
  private performanceManager: PerformanceOptimizationManager;

  constructor() {
    this.config = this.initializeConfig();
    this.seoManager = new SEOFundamentalsManager();
    this.performanceManager = new PerformanceOptimizationManager();
  }

  private initializeConfig(): DeployConfig {
    return {
      outputDir: './public',
      publicDir: './public',
      generateSitemap: true,
      generateRobots: true,
      generateHTAccess: true,
      generatePerformanceConfig: true,
      enableAnalytics: true
    };
  }

  async deploy(): Promise<void> {
    console.log('🚀 DÉMARRAGE DÉPLOIEMENT SEO AUTOMATIQUE');
    console.log('=====================================');

    try {
      // 1. Créer les répertoires nécessaires
      this.createDirectories();

      // 2. Générer et déployer sitemap.xml
      if (this.config.generateSitemap) {
        await this.deploySitemap();
      }

      // 3. Générer et déployer robots.txt
      if (this.config.generateRobots) {
        await this.deployRobots();
      }

      // 4. Générer .htaccess pour performance
      if (this.config.generateHTAccess) {
        await this.deployHTAccess();
      }

      // 5. Déployer configurations performance
      if (this.config.generatePerformanceConfig) {
        await this.deployPerformanceConfig();
      }

      // 6. Déployer scripts analytics
      if (this.config.enableAnalytics) {
        await this.deployAnalytics();
      }

      // 7. Générer rapport de déploiement
      this.generateDeploymentReport();

      console.log('✅ DÉPLOIEMENT SEO TERMINÉ AVEC SUCCÈS');
      console.log('📊 Fichiers créés et optimisés prêts pour production');

    } catch (error) {
      console.error('❌ ERREUR DÉPLOIEMENT SEO:', error);
      process.exit(1);
    }
  }

  private createDirectories(): void {
    console.log('📁 Création répertoires...');
    
    const dirs = [
      this.config.outputDir,
      join(this.config.outputDir, 'seo'),
      join(this.config.outputDir, 'scripts'),
      join(this.config.outputDir, 'config')
    ];

    dirs.forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        console.log(`  ✅ Créé: ${dir}`);
      }
    });
  }

  private async deploySitemap(): Promise<void> {
    console.log('🗺️ Génération sitemap.xml...');
    
    // Pages VTC à inclure dans le sitemap
    const pages: PageSEO[] = [
      {
        url: '/',
        title: 'ECOFUNDRIVE VTC Tesla - Service Premium Côte d\'Azur',
        description: 'Service VTC 100% Tesla sur Côte d\'Azur. Chauffeurs professionnels, disponibilité 24/7.',
        changeFrequency: 'daily',
        priority: 1.0,
        images: [
          {
            url: '/images/vtc-tesla-fleet.webp',
            title: 'Flotte VTC Tesla ECOFUNDRIVE',
            caption: 'Service VTC premium 100% électrique'
          }
        ]
      },
      {
        url: '/vtc-nice',
        title: 'VTC Nice - Service Tesla Premium | ECOFUNDRIVE',
        description: 'VTC Nice disponible 24/7. Service Tesla premium avec chauffeurs professionnels.',
        changeFrequency: 'weekly',
        priority: 0.9,
        images: [
          {
            url: '/images/vtc-nice-service.webp',
            title: 'VTC Nice Service',
            caption: 'Transport VTC premium à Nice'
          }
        ]
      },
      {
        url: '/vtc-monaco',
        title: 'VTC Monaco - Transport Luxury Tesla | ECOFUNDRIVE',
        description: 'VTC Monaco luxe. Service Tesla pour Grand Prix, événements, tourisme.',
        changeFrequency: 'weekly',
        priority: 0.9
      },
      {
        url: '/vtc-cannes',
        title: 'VTC Cannes - Festival Transport Tesla | ECOFUNDRIVE',
        description: 'VTC Cannes pour festival, événements, tourisme. Service Tesla premium.',
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: '/aeroport-nice',
        title: 'Transfert Aéroport Nice - VTC Tesla | ECOFUNDRIVE',
        description: 'Transfert aéroport Nice en VTC Tesla. Chauffeur attend votre arrivée.',
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: '/tarifs-vtc',
        title: 'Tarifs VTC Côte d\'Azur - Prix Fixes | ECOFUNDRIVE',
        description: 'Tarifs VTC fixes Nice-Monaco-Cannes. Transparence totale, pas de surprises.',
        changeFrequency: 'monthly',
        priority: 0.7
      },
      {
        url: '/reservations',
        title: 'Réservation VTC Tesla - WhatsApp 24/7 | ECOFUNDRIVE',
        description: 'Réservez votre VTC Tesla par WhatsApp. Disponible 24/7, confirmation immédiate.',
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: '/contact',
        title: 'Contact ECOFUNDRIVE - VTC Tesla Côte d\'Azur',
        description: 'Contactez ECOFUNDRIVE pour vos VTC Tesla. WhatsApp: +33 6 16 55 28 11.',
        changeFrequency: 'monthly',
        priority: 0.6
      }
    ];

    const sitemapXML = this.seoManager.generateSitemapXML(pages);
    const sitemapPath = join(this.config.outputDir, 'sitemap.xml');
    
    writeFileSync(sitemapPath, sitemapXML, 'utf8');
    console.log(`  ✅ Sitemap créé: ${sitemapPath}`);
    console.log(`  📊 ${pages.length} pages incluses`);
  }

  private async deployRobots(): Promise<void> {
    console.log('🤖 Génération robots.txt...');
    
    const robotsTxt = this.seoManager.generateRobotsTxt();
    const robotsPath = join(this.config.outputDir, 'robots.txt');
    
    writeFileSync(robotsPath, robotsTxt, 'utf8');
    console.log(`  ✅ Robots.txt créé: ${robotsPath}`);
  }

  private async deployHTAccess(): Promise<void> {
    console.log('⚡ Génération .htaccess performance...');
    
    const htAccess = this.generateHTAccessContent();
    const htAccessPath = join(this.config.outputDir, '.htaccess');
    
    writeFileSync(htAccessPath, htAccess, 'utf8');
    console.log(`  ✅ .htaccess créé: ${htAccessPath}`);
  }

  private generateHTAccessContent(): string {
    return `# ECOFUNDRIVE V3 - Performance .htaccess
# Optimisation vitesse, sécurité, SEO

# Compression Gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Browser
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 3 months"
  ExpiresByType image/jpg "access plus 3 months"
  ExpiresByType image/jpeg "access plus 3 months"
  ExpiresByType image/gif "access plus 3 months"
  ExpiresByType image/ico "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 3 months"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType application/font-woff "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options nosniff
  Header always set X-Frame-Options DENY
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com;"
</IfModule>

# SEO URLs
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !\\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$
RewriteRule ^(.*)$ index.php?page=$1 [QSA,L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# WWW to non-WWW
RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Hotlink Protection
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?ecofundrive\\.com [NC]
RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?google\\. [NC]
RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?facebook\\.com [NC]
RewriteRule \\.(jpg|jpeg|png|gif|webp)$ - [F,NC]

# Error Pages
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html
`;
  }

  private async deployPerformanceConfig(): Promise<void> {
    console.log('📊 Génération configuration performance...');
    
    const perfConfig = this.performanceManager.generateImageOptimizationConfig();
    const configPath = join(this.config.outputDir, 'config', 'performance.json');
    
    writeFileSync(configPath, JSON.stringify(perfConfig, null, 2), 'utf8');
    console.log(`  ✅ Config performance: ${configPath}`);
  }

  private async deployAnalytics(): Promise<void> {
    console.log('📈 Génération scripts analytics...');
    
    const analyticsScript = this.generateAnalyticsScript();
    const analyticsPath = join(this.config.outputDir, 'scripts', 'analytics.js');
    
    writeFileSync(analyticsPath, analyticsScript, 'utf8');
    console.log(`  ✅ Analytics script: ${analyticsPath}`);
  }

  private generateAnalyticsScript(): string {
    return `// ECOFUNDRIVE V3 - Analytics Script
// Google Analytics 4 + Core Web Vitals + Custom Events

(function() {
  // Google Analytics 4
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID', {
    page_title: document.title,
    page_location: window.location.href,
    content_group1: 'VTC'
  });

  // Core Web Vitals
  import('https://unpkg.com/web-vitals').then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
    function sendToAnalytics(metric) {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true
      });
    }
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });

  // Custom Events Tracking
  function trackEvent(eventName, parameters) {
    gtag('event', eventName, parameters);
  }

  // Track VTC Bookings
  function trackBooking(destination, price) {
    trackEvent('vtc_booking', {
      destination: destination,
      value: price,
      currency: 'EUR'
    });
  }

  // Track WhatsApp Clicks
  function trackWhatsAppClick() {
    trackEvent('whatsapp_click', {
      page_location: window.location.href
    });
  }

  // Track Facebook Reviews
  function trackFacebookReview() {
    trackEvent('facebook_review', {
      event_category: 'engagement'
    });
  }

  // Expose functions globally
  window.ECOFUNDRIVE = {
    trackBooking,
    trackWhatsAppClick,
    trackFacebookReview
  };
})();
`;
  }

  private generateDeploymentReport(): void {
    console.log('📋 Génération rapport déploiement...');
    
    const report = {
      deployment: {
        timestamp: new Date().toISOString(),
        version: '3.0',
        environment: 'production'
      },
      files: {
        sitemap: '/sitemap.xml',
        robots: '/robots.txt',
        htaccess: '/.htaccess',
        analytics: '/scripts/analytics.js',
        performance: '/config/performance.json'
      },
      features: {
        sitemap: this.config.generateSitemap,
        robots: this.config.generateRobots,
        htaccess: this.config.generateHTAccess,
        performance: this.config.generatePerformanceConfig,
        analytics: this.config.enableAnalytics
      },
      nextSteps: [
        '1. Tester le sitemap: https://ecofundrive.com/sitemap.xml',
        '2. Valider robots.txt: https://ecofundrive.com/robots.txt',
        '3. Vérifier performance: Google PageSpeed Insights',
        '4. Soumettre sitemap à Google Search Console',
        '5. Monitorer analytics: Google Analytics 4'
      ]
    };

    const reportPath = join(this.config.outputDir, 'seo', 'deployment-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    console.log(`  ✅ Rapport créé: ${reportPath}`);
    console.log('\n📊 RÉCAPITULATIF DÉPLOIEMENT:');
    console.log('=============================');
    Object.entries(report.files).forEach(([key, path]) => {
      console.log(`  ✅ ${key}: ${path}`);
    });
    console.log('\n🎯 PROCHAINES ÉTAPES:');
    report.nextSteps.forEach(step => console.log(`  ${step}`));
  }
}

// Exécution du script
async function main() {
  const deployer = new SEODeploymentScript();
  await deployer.deploy();
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

// Lancer le déploiement
if (require.main === module) {
  main().catch(error => {
    console.error('❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  });
}

export { SEODeploymentScript };
