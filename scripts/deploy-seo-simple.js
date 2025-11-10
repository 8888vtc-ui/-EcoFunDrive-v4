#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - SCRIPT DÉPLOIEMENT SEO SIMPLIFIÉ
// Version sans dépendances Node.js - fonctionne partout
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

class SimpleSEODeployer {
  constructor() {
    this.outputDir = './public';
    this.createDirectories();
  }

  createDirectories() {
    console.log('📁 Création répertoires...');
    
    const dirs = [
      this.outputDir,
      path.join(this.outputDir, 'seo'),
      path.join(this.outputDir, 'scripts'),
      path.join(this.outputDir, 'config'),
      path.join(this.outputDir, 'pages')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  ✅ Créé: ${dir}`);
      }
    });
  }

  deploySitemap() {
    console.log('🗺️ Génération sitemap.xml...');
    
    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ecofundrive.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ecofundrive.com/vtc-nice</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ecofundrive.com/vtc-monaco</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ecofundrive.com/vtc-cannes</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ecofundrive.com/aeroport-nice</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ecofundrive.com/tarifs-vtc</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ecofundrive.com/reservations</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ecofundrive.com/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

    const sitemapPath = path.join(this.outputDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');
    console.log(`  ✅ Sitemap créé: ${sitemapPath}`);
  }

  deployRobots() {
    console.log('🤖 Génération robots.txt...');
    
    const robotsTxt = `# ECOFUNDRIVE V3 - Robots.txt
# Autorisé pour tous les crawlers importants

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/
Disallow: /*.json$
Disallow: /*?*$
Allow: /api/vtc/
Allow: /api/destinations/

# Sitemap location
Sitemap: https://ecofundrive.com/sitemap.xml

# Crawl delay pour respecter les serveurs
Crawl-delay: 1

# Spécifique Google
User-agent: Googlebot
Allow: /
Crawl-delay: 0.5

# Spécifique Bing
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Bloquer les crawlers malveillants
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /
`;

    const robotsPath = path.join(this.outputDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
    console.log(`  ✅ Robots.txt créé: ${robotsPath}`);
  }

  deployHTAccess() {
    console.log('⚡ Génération .htaccess performance...');
    
    const htAccess = `# ECOFUNDRIVE V3 - Performance .htaccess
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

    const htAccessPath = path.join(this.outputDir, '.htaccess');
    fs.writeFileSync(htAccessPath, htAccess, 'utf8');
    console.log(`  ✅ .htaccess créé: ${htAccessPath}`);
  }

  deployAnalytics() {
    console.log('📈 Génération scripts analytics...');
    
    const analyticsScript = `// ECOFUNDRIVE V3 - Analytics Script
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

    const scriptsDir = path.join(this.outputDir, 'scripts');
    const analyticsPath = path.join(scriptsDir, 'analytics.js');
    fs.writeFileSync(analyticsPath, analyticsScript, 'utf8');
    console.log(`  ✅ Analytics script: ${analyticsPath}`);
  }

  deployVTCPage(keyword = 'vtc-nice') {
    console.log(`📝 Génération page VTC: ${keyword}...`);
    
    const pageHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ECOFUNDRIVE VTC Tesla - Service Premium Côte d'Azur</title>
  <meta name="description" content="Service VTC 100% Tesla sur Côte d'Azur. Chauffeurs professionnels, disponibilité 24/7, WhatsApp réservation.">
  <meta name="keywords" content="VTC, Tesla, Nice, Monaco, Côte d'Azur, transport luxe">
  
  <!-- Open Graph -->
  <meta property="og:title" content="ECOFUNDRIVE VTC Tesla - Service Premium Côte d'Azur">
  <meta property="og:description" content="Service VTC 100% Tesla sur Côte d'Azur. Chauffeurs professionnels, disponibilité 24/7.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://ecofundrive.com/${keyword}">
  <meta property="og:image" content="https://ecofundrive.com/images/og-${keyword}.jpg">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ECOFUNDRIVE VTC Tesla">
  <meta name="twitter:description" content="Service VTC 100% Tesla sur Côte d'Azur">
  <meta name="twitter:image" content="https://ecofundrive.com/images/og-${keyword}.jpg">
  
  <!-- Canonical -->
  <link rel="canonical" href="https://ecofundrive.com/${keyword}">
  
  <!-- Styles -->
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    .header { background: #1877f2; color: white; padding: 1rem; }
    .nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; }
    .logo { font-size: 1.5rem; font-weight: bold; }
    .nav-links a { color: white; text-decoration: none; margin: 0 1rem; }
    .whatsapp-btn { background: #25d366; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 5px; }
    .hero { text-align: center; padding: 4rem 2rem; background: #f8f9fa; }
    .hero h1 { font-size: 3rem; margin-bottom: 1rem; color: #1877f2; }
    .btn-primary { background: #1877f2; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 5px; margin: 0.5rem; }
    .btn-secondary { background: #6c757d; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 5px; margin: 0.5rem; }
    .facebook-reviews { background: #1877f2; color: white; padding: 2rem; text-align: center; }
    .stars { font-size: 2rem; margin: 1rem 0; }
    .facebook-review-btn { background: white; color: #1877f2; padding: 1rem 2rem; text-decoration: none; border-radius: 5px; }
    .footer { background: #333; color: white; padding: 2rem; text-align: center; }
  </style>
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
<body>
  <header class="header">
    <nav class="nav">
      <div class="logo">🚗 ECOFUNDRIVE VTC Tesla</div>
      <div class="nav-links">
        <a href="/">Accueil</a>
        <a href="/vtc-nice">VTC Nice</a>
        <a href="/vtc-monaco">VTC Monaco</a>
        <a href="/tarifs-vtc">Tarifs</a>
        <a href="/reservations">Réservations</a>
        <a href="/contact">Contact</a>
      </div>
      <div class="cta-button">
        <a href="https://wa.me/33616552811?text=Bonjour%20je%20souhaite%20${keyword}" class="whatsapp-btn">
          📞 WhatsApp Réservation
        </a>
      </div>
    </nav>
  </header>

  <main>
    <section class="hero">
      <h1>🚗 VTC Tesla Premium Côte d'Azur</h1>
      <p>Service VTC 100% électrique et luxe sur Nice, Monaco, Cannes</p>
      <p>📞 WhatsApp: +33 6 16 55 28 11 | ⏰ Disponible 24/7</p>
      <div class="hero-cta">
        <a href="https://wa.me/33616552811?text=Bonjour%20je%20souhaite%20${keyword}" class="btn-primary">
          🚗 Réserver VTC ${keyword.replace('-', ' ').toUpperCase()}
        </a>
        <a href="#tarifs" class="btn-secondary">
          💰 Voir Tarifs
        </a>
      </div>
    </section>

    <section style="padding: 4rem 2rem; max-width: 1200px; margin: 0 auto;">
      <h2>🌟 NOS SERVICES VTC TESLA</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
        <div style="border: 1px solid #ddd; padding: 2rem; border-radius: 10px;">
          <h3>🏢 Transfert Aéroport Nice</h3>
          <p>VTC Tesla de/vers aéroport Nice Côte d'Azur. Chauffeur attend votre arrivée.</p>
          <p><strong>60€</strong> - 25 minutes</p>
        </div>
        <div style="border: 1px solid #ddd; padding: 2rem; border-radius: 10px;">
          <h3>🏰 VTC Nice-Monaco</h3>
          <p>Trajet premium Nice-Monaco en Tesla. WiFi, bouteilles eau, 25 minutes.</p>
          <p><strong>80€</strong> - 25 minutes</p>
        </div>
        <div style="border: 1px solid #ddd; padding: 2rem; border-radius: 10px;">
          <h3>🎭 Service Événements</h3>
          <p>Transport luxe pour événements Côte d'Azur. Grand Prix, festivals, galas.</p>
          <p><strong>Sur devis</strong></p>
        </div>
      </div>
    </section>

    <section class="facebook-reviews">
      <h2>⭐ NOS AVIS FACEBOOK - 4.8/5</h2>
      <div class="rating-summary">
        <div class="stars">★★★★★</div>
        <div class="rating-text">4.8 sur 5 basé sur 500+ avis</div>
        <p>Rejoignez nos clients satisfaits !</p>
      </div>
      <a href="https://facebook.com/fastcab.vtc/reviews" target="_blank" class="facebook-review-btn">
        ⭐ LAISSER UN AVIS FACEBOOK
      </a>
    </section>
  </main>

  <footer class="footer">
    <div>
      <h3>ECOFUNDRIVE</h3>
      <p>Service VTC 100% Tesla sur Côte d'Azur</p>
      <p>Disponible 24/7 - WhatsApp: +33 6 16 55 28 11</p>
      <p>&copy; 2024 ECOFUNDRIVE. Tous droits réservés.</p>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="/scripts/analytics.js"></script>
  <script>
    // Tracking interactions
    document.querySelectorAll('.whatsapp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.ECOFUNDRIVE) {
          window.ECOFUNDRIVE.trackWhatsAppClick();
        }
      });
    });
    
    document.querySelector('.facebook-review-btn')?.addEventListener('click', () => {
      if (window.ECOFUNDRIVE) {
        window.ECOFUNDRIVE.trackFacebookReview();
      }
    });
  </script>
</body>
</html>`;

    const pagesDir = path.join(this.outputDir, 'pages');
    const pagePath = path.join(pagesDir, `${keyword}.html`);
    fs.writeFileSync(pagePath, pageHTML, 'utf8');
    console.log(`  ✅ Page VTC créée: ${pagePath}`);
  }

  generateReport() {
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
        vtcPage: '/pages/vtc-nice.html'
      },
      features: {
        sitemap: true,
        robots: true,
        htaccess: true,
        analytics: true,
        vtcPage: true
      },
      nextSteps: [
        '1. Tester le sitemap: https://ecofundrive.com/sitemap.xml',
        '2. Valider robots.txt: https://ecofundrive.com/robots.txt',
        '3. Vérifier performance: Google PageSpeed Insights',
        '4. Soumettre sitemap à Google Search Console',
        '5. Monitorer analytics: Google Analytics 4'
      ]
    };

    const seoDir = path.join(this.outputDir, 'seo');
    const reportPath = path.join(seoDir, 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    console.log(`  ✅ Rapport créé: ${reportPath}`);
    console.log('\n📊 RÉCAPITULATIF DÉPLOIEMENT:');
    console.log('=============================');
    Object.entries(report.files).forEach(([key, path]) => {
      console.log(`  ✅ ${key}: ${path}`);
    });
    console.log('\n🎯 PROCHAINES ÉTAPES:');
    report.nextSteps.forEach(step => console.log(`  ${step}`));
  }

  async deploy() {
    console.log('🚀 DÉMARRAGE DÉPLOIEMENT SEO AUTOMATIQUE');
    console.log('=====================================');

    try {
      this.deploySitemap();
      this.deployRobots();
      this.deployHTAccess();
      this.deployAnalytics();
      this.deployVTCPage('vtc-nice');
      this.generateReport();

      console.log('\n✅ DÉPLOIEMENT SEO TERMINÉ AVEC SUCCÈS');
      console.log('📊 Fichiers créés et optimisés prêts pour production');
      console.log('🌐 Site prêt: https://ecofundrive.com');

    } catch (error) {
      console.error('❌ ERREUR DÉPLOIEMENT SEO:', error);
      process.exit(1);
    }
  }
}

// Exécution du script
async function main() {
  const deployer = new SimpleSEODeployer();
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

module.exports = { SimpleSEODeployer };
