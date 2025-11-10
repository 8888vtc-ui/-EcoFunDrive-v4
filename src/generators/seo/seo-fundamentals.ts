// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - SEO FONDAMENTAL COMPLET
// Implémentation des composants SEO manquants critiques
// ═══════════════════════════════════════════════════════════

import type { SEOFundamentalConfig, PageSEO } from '../../types/seo';

export class SEOFundamentalsManager {
  private config: SEOFundamentalConfig;

  constructor() {
    this.config = this.initializeSEOConfig();
  }

  private initializeSEOConfig(): SEOFundamentalConfig {
    return {
      siteUrl: 'https://ecofundrive.com',
      defaultTitle: 'ECOFUNDRIVE VTC Tesla - Service Premium Côte d\'Azur',
      defaultDescription: 'Service VTC 100% Tesla sur Côte d\'Azur. Chauffeurs professionnels, disponibilité 24/7, WhatsApp réservation.',
      ogImage: '/images/og-default.jpg',
      twitterCard: 'summary_large_image',
      favicon: '/favicon.ico',
      language: 'fr-FR',
      author: 'ECOFUNDRIVE',
      keywords: ['VTC', 'Tesla', 'Nice', 'Monaco', 'Côte d\'Azur', 'transport luxe']
    };
  }

  // 1. SITEMAP DYNAMIQUE GÉNÉRATION
  generateSitemapXML(pages: PageSEO[]): string {
    const currentDate = new Date().toISOString();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    pages.forEach(page => {
      sitemap += `  <url>
    <loc>${this.config.siteUrl}${page.url}</loc>
    <lastmod>${page.lastModified || currentDate}</lastmod>
    <changefreq>${page.changeFrequency || 'weekly'}</changefreq>
    <priority>${page.priority || '0.8'}</priority>
`;

      // Ajouter images si présentes
      if (page.images && page.images.length > 0) {
        page.images.forEach((image: any) => {
          sitemap += `    <image:image>
      <image:loc>${this.config.siteUrl}${image.url}</image:loc>
      <image:title>${image.title || 'VTC Tesla ECOFUNDRIVE'}</image:title>
      <image:caption>${image.caption || 'Service VTC premium Tesla'}</image:caption>
    </image:image>
`;
        });
      }

      sitemap += `  </url>
`;
    });

    sitemap += `</urlset>`;

    return sitemap;
  }

  // 2. ROBOTS.TXT INTELLIGENT
  generateRobotsTxt(): string {
    return `# ECOFUNDRIVE V3 - Robots.txt
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
Sitemap: ${this.config.siteUrl}/sitemap.xml

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
  }

  // 3. CANONICAL TAGS AUTOMATIQUES
  generateCanonicalTag(url: string, queryParams?: Record<string, string>): string {
    const cleanUrl = this.cleanUrl(url, queryParams);
    return `<link rel="canonical" href="${this.config.siteUrl}${cleanUrl}" />`;
  }

  private cleanUrl(url: string, queryParams?: Record<string, string>): string {
    // Supprimer les paramètres tracking
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
    
    if (!queryParams) return url;
    
    const cleanParams = Object.keys(queryParams)
      .filter(key => !trackingParams.includes(key))
      .map(key => `${key}=${queryParams[key]}`)
      .join('&');
    
    return cleanParams ? `${url}?${cleanParams}` : url;
  }

  // 4. HREFLANG MULTI-LANGUES
  generateHreflangTags(url: string, languages: string[] = ['fr', 'en']): string[] {
    const tags: string[] = [];
    
    languages.forEach(lang => {
      const langUrl = lang === 'fr' ? url : `/${lang}${url}`;
      tags.push(`<link rel="alternate" hreflang="${lang}" href="${this.config.siteUrl}${langUrl}" />`);
    });
    
    // Ajouter x-default pour international
    tags.push(`<link rel="alternate" hreflang="x-default" href="${this.config.siteUrl}${url}" />`);
    
    return tags;
  }

  // 5. META ROBOTS COMPLETS
  generateMetaRobots(page: PageSEO): string {
    const robots = [
      page.noIndex ? 'noindex' : 'index',
      page.noFollow ? 'nofollow' : 'follow',
      page.noArchive ? 'noarchive' : 'archive',
      page.noSnippet ? 'nosnippet' : 'snippet',
      page.noImageIndex ? 'noimageindex' : 'imageindex',
      page.notranslate ? 'notranslate' : 'translate'
    ].filter(Boolean).join(', ');

    return `<meta name="robots" content="${robots}" />`;
  }

  // 6. OPEN GRAPH COMPLET
  generateOpenGraphTags(page: PageSEO): string[] {
    const tags: string[] = [
      `<meta property="og:type" content="${page.ogType || 'website'}" />`,
      `<meta property="og:title" content="${page.title || this.config.defaultTitle}" />`,
      `<meta property="og:description" content="${page.description || this.config.defaultDescription}" />`,
      `<meta property="og:url" content="${this.config.siteUrl}${page.url}" />`,
      `<meta property="og:image" content="${this.config.siteUrl}${page.ogImage || this.config.ogImage}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:locale" content="fr_FR" />`,
      `<meta property="og:site_name" content="ECOFUNDRIVE" />`
    ];

    // Ajouter tags spécifiques si type article
    if (page.ogType === 'article') {
      tags.push(
        `<meta property="article:published_time" content="${page.publishedTime || new Date().toISOString()}" />`,
        `<meta property="article:modified_time" content="${page.modifiedTime || new Date().toISOString()}" />`,
        `<meta property="article:author" content="${page.author || this.config.author}" />`,
        `<meta property="article:section" content="${page.section || 'VTC'}" />`
      );
    }

    return tags;
  }

  // 7. TWITTER CARDS COMPLETS
  generateTwitterCardTags(page: PageSEO): string[] {
    return [
      `<meta name="twitter:card" content="${page.twitterCard || this.config.twitterCard}" />`,
      `<meta name="twitter:site" content="@ecofundrive" />`,
      `<meta name="twitter:creator" content="@ecofundrive" />`,
      `<meta name="twitter:title" content="${page.title || this.config.defaultTitle}" />`,
      `<meta name="twitter:description" content="${page.description || this.config.defaultDescription}" />`,
      `<meta name="twitter:image" content="${this.config.siteUrl}${page.twitterImage || page.ogImage || this.config.ogImage}" />`,
      `<meta name="twitter:image:alt" content="${page.imageAlt || 'VTC Tesla ECOFUNDRIVE'}" />`
    ];
  }

  // 8. JSON-LD STRUCTURED DATA COMPLET
  generateJsonLd(page: PageSEO): string {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": page.schemaType || "WebPage",
      "name": page.title || this.config.defaultTitle,
      "description": page.description || this.config.defaultDescription,
      "url": `${this.config.siteUrl}${page.url}`,
      "inLanguage": this.config.language,
      "isPartOf": {
        "@type": "WebSite",
        "name": "ECOFUNDRIVE",
        "url": this.config.siteUrl
      },
      "about": {
        "@type": "Thing",
        "name": "Service VTC Tesla"
      },
      "provider": {
        "@type": "Organization",
        "name": "ECOFUNDRIVE",
        "url": this.config.siteUrl,
        "logo": `${this.config.siteUrl}/images/logo.png`,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+33 6 16 55 28 11",
          "contactType": "customer service",
          "availableLanguage": ["French", "English"]
        }
      }
    };

    // Ajouter spécificités selon type de page
    if (page.schemaType === 'LocalBusiness') {
      return this.generateLocalBusinessJsonLd(page);
    } else if (page.schemaType === 'Service') {
      return this.generateServiceJsonLd(page);
    } else if (page.schemaType === 'Article') {
      return this.generateArticleJsonLd(page);
    }

    return `<script type="application/ld+json">${JSON.stringify(baseStructuredData, null, 2)}</script>`;
  }

  private generateLocalBusinessJsonLd(page: PageSEO): string {
    const localBusiness = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "ECOFUNDRIVE VTC Tesla",
      "description": page.description || this.config.defaultDescription,
      "url": `${this.config.siteUrl}${page.url}`,
      "telephone": "+33 6 16 55 28 11",
      "email": "contact@ecofundrive.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nice",
        "addressRegion": "Provence-Alpes-Côte d'Azur",
        "addressCountry": "France",
        "postalCode": "06000"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 43.7102,
        "longitude": 7.2620
      },
      "openingHours": "Mo-Su 00:00-23:59",
      "priceRange": "€€€",
      "paymentAccepted": ["Cash", "Credit Card", "PayPal"],
      "currenciesAccepted": "EUR",
      "sameAs": [
        "https://facebook.com/fastcab.vtc",
        "https://instagram.com/ecofundrive",
        "https://twitter.com/ecofundrive"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "500",
        "bestRating": "5",
        "worstRating": "1"
      },
      "serviceType": "Transportation Service"
    };

    return `<script type="application/ld+json">${JSON.stringify(localBusiness, null, 2)}</script>`;
  }

  private generateServiceJsonLd(page: PageSEO): string {
    const service = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": page.title,
      "description": page.description,
      "provider": {
        "@type": "Organization",
        "name": "ECOFUNDRIVE",
        "url": this.config.siteUrl
      },
      "serviceType": "VTC Transportation",
      "areaServed": {
        "@type": "Place",
        "name": ["Nice", "Monaco", "Cannes", "Saint-Tropez"]
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services VTC",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": "VTC Tesla",
            "price": "60-300",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          }
        ]
      }
    };

    return `<script type="application/ld+json">${JSON.stringify(service, null, 2)}</script>`;
  }

  private generateArticleJsonLd(page: PageSEO): string {
    const article = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": page.title,
      "description": page.description,
      "image": [`${this.config.siteUrl}${page.ogImage || this.config.ogImage}`],
      "datePublished": page.publishedTime || new Date().toISOString(),
      "dateModified": page.modifiedTime || new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": "ECOFUNDRIVE"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ECOFUNDRIVE",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.config.siteUrl}/images/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.config.siteUrl}${page.url}`
      }
    };

    return `<script type="application/ld+json">${JSON.stringify(article, null, 2)}</script>`;
  }

  // 9. META TAGS COMPLETS
  generateCompleteMetaTags(page: PageSEO): string {
    const tags: string[] = [
      `<title>${page.title || this.config.defaultTitle}</title>`,
      `<meta name="description" content="${page.description || this.config.defaultDescription}" />`,
      `<meta name="keywords" content="${(page.keywords || this.config.keywords).join(', ')}" />`,
      `<meta name="author" content="${page.author || this.config.author}" />`,
      `<meta name="language" content="${this.config.language}" />`,
      `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
      `<meta name="theme-color" content="#1877f2" />`,
      `<link rel="icon" type="image/x-icon" href="${this.config.favicon}" />`,
      this.generateCanonicalTag(page.url, page.queryParams),
      this.generateMetaRobots(page),
      ...this.generateOpenGraphTags(page),
      ...this.generateTwitterCardTags(page),
      ...this.generateHreflangTags(page.url, page.languages),
      this.generateJsonLd(page)
    ];

    return tags.join('\n');
  }
}
