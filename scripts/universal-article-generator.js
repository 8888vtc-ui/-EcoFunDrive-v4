#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - GÉNÉRATEUR UNIVERSEL D'ARTICLES SEO
// Prend mots-clés + domaine → génère articles optimisés avec photos
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

class UniversalArticleGenerator {
  constructor() {
    this.config = {
      outputDir: './public',
      articlesDir: './public/articles',
      imagesDir: './public/images',
      domain: 'ecofundrive.com',
      brandName: 'ECOFUNDRIVE',
      mainService: 'VTC Tesla',
      region: 'Côte d\'Azur'
    };
    
    this.templates = {
      // Templates pour différents types de contenu
      golf: {
        category: 'loisir-premium',
        style: 'luxury-sport',
        imageTypes: ['golf-course', 'golf-luxury', 'golf-tesla', 'golf-transport'],
        keywordsBase: ['golf', 'luxury', 'transport', 'tesla', 'premium'],
        contentFocus: 'transport premium vers installations golf'
      },
      restaurant: {
        category: 'gastronomie-luxe',
        style: 'dining-premium',
        imageTypes: ['restaurant-luxury', 'tesla-dining', 'transport-restaurant', 'valet-tesla'],
        keywordsBase: ['restaurant', 'gastronomie', 'transport', 'tesla', 'valet'],
        contentFocus: 'service VTC pour restaurants étoilés'
      },
      hotel: {
        category: 'hebergement-luxe',
        style: 'hospitality-premium',
        imageTypes: ['hotel-luxury', 'tesla-hotel', 'concierge-tesla', 'transport-hotel'],
        keywordsBase: ['hotel', 'luxe', 'transport', 'tesla', 'concierge'],
        contentFocus: 'transferts premium vers hôtels de luxe'
      },
      shopping: {
        category: 'shopping-luxe',
        style: 'retail-premium',
        imageTypes: ['shopping-luxury', 'tesla-shopping', 'transport-boutique', 'valet-shopping'],
        keywordsBase: ['shopping', 'luxe', 'transport', 'tesla', 'boutique'],
        contentFocus: 'service VTC pour boutiques de luxe'
      },
      evenement: {
        category: 'evenements-speciaux',
        style: 'event-premium',
        imageTypes: ['event-luxury', 'tesla-event', 'transport-gala', 'valet-event'],
        keywordsBase: ['evenement', 'gala', 'transport', 'tesla', 'prestige'],
        contentFocus: 'transport événementiel premium'
      }
    };
    
    this.generatedArticles = [];
  }

  // Détecter le type de contenu depuis le mot-clé
  detectContentType(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerKeyword.includes('golf')) return 'golf';
    if (lowerKeyword.includes('restaurant') || lowerKeyword.includes('gastronomie')) return 'restaurant';
    if (lowerKeyword.includes('hotel') || lowerKeyword.includes('palace')) return 'hotel';
    if (lowerKeyword.includes('shopping') || lowerKeyword.includes('boutique')) return 'shopping';
    if (lowerKeyword.includes('evenement') || lowerKeyword.includes('festival')) return 'evenement';
    
    return 'default'; // Template par défaut
  }

  // Générer un article depuis un mot-clé
  generateArticleFromKeyword(keyword, customDomain = null) {
    console.log(`📝 Génération article pour: "${keyword}"`);
    
    const contentType = this.detectContentType(keyword);
    const template = this.templates[contentType] || this.getDefaultTemplate();
    
    const article = {
      id: this.generateSlug(keyword),
      title: this.generateTitle(keyword, template),
      description: this.generateDescription(keyword, template),
      category: template.category,
      style: template.style,
      keywords: this.generateKeywords(keyword, template),
      priority: 0.8,
      changeFrequency: 'weekly',
      url: `/articles/${this.generateSlug(keyword)}.html`,
      images: this.generateImages(keyword, template),
      content: this.generateContent(keyword, template),
      internalLinks: this.generateInternalLinks(keyword),
      lastModified: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };

    this.generatedArticles.push(article);
    console.log(`  ✅ Article généré: ${article.title}`);
    
    return article;
  }

  // Générer un slug URL-friendly
  generateSlug(keyword) {
    return keyword
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Générer un titre optimisé SEO
  generateTitle(keyword, template) {
    const location = this.extractLocation(keyword);
    const service = template.contentFocus;
    
    const titles = [
      `${keyword} - Service ${this.mainService} Premium ${location}`,
      `${this.mainService} ${keyword} - Transport Luxury ${location}`,
      `Service VTC Tesla pour ${keyword} - ${this.region}`,
      `${keyword} : Transport Premium avec ${this.brandName}`,
      `VTC de luxe vers ${keyword} - Service Tesla ${location}`
    ];
    
    return titles[Math.floor(Math.random() * titles.length)];
  }

  // Extraire la localisation
  extractLocation(keyword) {
    const locations = ['St-Tropez', 'Monaco', 'Nice', 'Cannes', 'Antibes'];
    const keywordLower = keyword.toLowerCase();
    
    for (const location of locations) {
      if (keywordLower.includes(location.toLowerCase())) {
        return location;
      }
    }
    
    return this.region;
  }

  // Générer une description SEO
  generateDescription(keyword, template) {
    const location = this.extractLocation(keyword);
    
    return `Service VTC Tesla premium pour ${keyword}. Transport de luxe ${location} avec chauffeurs professionnels, disponibilité 24/7, réservation WhatsApp. ${template.contentFocus}.`;
  }

  // Générer les mots-clés SEO
  generateKeywords(keyword, template) {
    const baseKeywords = [
      keyword.toLowerCase(),
      `VTC ${keyword}`,
      `Tesla ${keyword}`,
      `transport ${keyword}`,
      `${keyword} luxe`,
      `${this.mainService} ${keyword}`
    ];
    
    return [...baseKeywords, ...template.keywordsBase];
  }

  // Générer les URLs d'images optimisées
  generateImages(keyword, template) {
    const slug = this.generateSlug(keyword);
    const images = [];
    
    template.imageTypes.forEach((imageType, index) => {
      images.push({
        url: `/images/${slug}-${imageType}.jpg`,
        alt: `${keyword} - ${this.brandName} ${this.mainService}`,
        title: `Transport VTC Tesla pour ${keyword}`,
        width: 1200,
        height: 800,
        type: 'image/jpeg',
        size: 'large'
      });
    });
    
    return images;
  }

  // Générer le contenu complet de l'article
  generateContent(keyword, template) {
    const location = this.extractLocation(keyword);
    const slug = this.generateSlug(keyword);
    
    return {
      hero: {
        title: this.generateTitle(keyword, template),
        subtitle: `Transport VTC Tesla Premium ${location}`,
        description: this.generateDescription(keyword, template),
        cta: `Réserver VTC pour ${keyword}`,
        image: this.generateImages(keyword, template)[0]
      },
      
      sections: [
        {
          type: 'introduction',
          title: `🌟 Service VTC Tesla pour ${keyword}`,
          content: `Découvrez le service de transport premium de ${this.brandName} pour ${keyword}. Nos véhicules Tesla Model S et Model X vous offrent un confort exceptionnel pour tous vos déplacements vers ${location}.`
        },
        
        {
          type: 'service-details',
          title: `🚗 Notre Service ${keyword}`,
          content: this.generateServiceContent(keyword, template),
          features: [
            '🚗 Flotte 100% Tesla',
            '👨‍✈️ Chauffeurs professionnels diplômés',
            '⏰ Disponibilité 24/7',
            '📱 Réservation instantanée WhatsApp',
            '💳 Paiement sécurisé',
            '🌋 100% écologique'
          ]
        },
        
        {
          type: 'benefits',
          title: `🎯 Pourquoi Choisir ${this.brandName} pour ${keyword}?`,
          benefits: [
            {
              title: 'Transport Premium',
              description: `Véhicules Tesla de dernière génération avec confort optimal pour vos trajets vers ${keyword}.`
            },
            {
              title: 'Service Personnalisé',
              description: `Chauffeur dédié qui connaît parfaitement ${location} et ${keyword}.`
            },
            {
              title: 'Disponibilité Totale',
              description: `Service 24/7 pour tous vos besoins de transport vers ${keyword}.`
            },
            {
              title: 'Écologique',
              description: `100% électrique, zéro émission pour un transport durable vers ${keyword}.`
            }
          ]
        },
        
        {
          type: 'pricing',
          title: `💰 Tarifs pour ${keyword}`,
          pricing: this.generatePricing(keyword, location)
        },
        
        {
          type: 'gallery',
          title: `📸 Nos VTC Tesla pour ${keyword}`,
          images: this.generateImages(keyword, template).slice(1, 4)
        },
        
        {
          type: 'testimonials',
          title: `⭐ Avis Clients - Service ${keyword}`,
          testimonials: [
            {
              name: 'Marie L.',
              rating: 5,
              comment: `Service exceptionnel pour ${keyword}. Chauffeur ponctuel et véhicule impeccable.`
            },
            {
              name: 'Jean-Pierre M.',
              rating: 5,
              comment: `Transport premium vers ${keyword}. Je recommande vivement ${this.brandName}.`
            }
          ]
        },
        
        {
          type: 'cta',
          title: `📞 Réservez Votre VTC Tesla pour ${keyword}`,
          description: `Disponible 24/7 - WhatsApp: +33 6 16 55 28 11`,
          buttons: [
            {
              text: `🚗 Réserver VTC ${keyword}`,
              url: `https://wa.me/33616552811?text=Bonjour%20je%20souhaite%20${slug}`,
              primary: true
            },
            {
              text: '💰 Voir Tarifs',
              url: '/tarifs-vtc',
              primary: false
            }
          ]
        }
      ]
    };
  }

  // Générer le contenu spécifique au service
  generateServiceContent(keyword, template) {
    const services = {
      golf: `Service spécialisé pour les golfeurs. Transport vers les plus beaux golfs de ${this.region} avec équipement de golf inclus. Nos Tesla Model X offrent un espace idéal pour vos clubs et accessoires.`,
      
      restaurant: `Transport gastronomique pour les restaurants étoilés. Service valet inclus, arrivée en toute discrétion. Véhicules climatisés pour préserver votre élégance.`,
      
      hotel: `Transferts premium vers les hôtels de luxe. Service concierge intégré, aide bagages, et disponibilité pour tous vos déplacements pendant votre séjour.`,
      
      shopping: `Service shopping de luxe. Transport vers les boutiques prestigieuses avec espace de rangement pour vos achats. Flexibilité totale pour votre journée shopping.`,
      
      evenement: `Transport événementiel sur mesure. Service pour galas, mariages, événements d'entreprise. Véhicules décorés selon votre thème.`,
      
      default: `Service de transport premium adapté à vos besoins. Flexibilité totale et confort exceptionnel pour tous vos déplacements.`
    };
    
    return services[template.style.split('-')[0]] || services.default;
  }

  // Générer les tarifs
  generatePricing(keyword, location) {
    const basePrices = {
      'St-Tropez': { min: 120, max: 300 },
      'Monaco': { min: 100, max: 250 },
      'Nice': { min: 60, max: 150 },
      'Cannes': { min: 80, max: 200 },
      'Antibes': { min: 70, max: 180 }
    };
    
    const prices = basePrices[location] || { min: 80, max: 200 };
    
    return [
      {
        service: `Transfert Aéroport - ${keyword}`,
        price: `${prices.min + 20}€`,
        duration: '30-45 min'
      },
      {
        service: `Service journée - ${keyword}`,
        price: `${prices.max}€`,
        duration: '8 heures'
      },
      {
        service: `Service ${keyword} - Aller/Retour`,
        price: `${Math.floor(prices.min * 1.8)}€`,
        duration: 'Flexible'
      }
    ];
  }

  // Générer les liens internes
  generateInternalLinks(keyword) {
    const baseLinks = ['vtc-nice', 'vtc-monaco', 'vtc-cannes', 'tarifs-vtc', 'reservations', 'contact'];
    
    // Ajouter des liens thématiques
    const keywordLower = keyword.toLowerCase();
    
    if (keywordLower.includes('golf')) {
      baseLinks.push('golf-monaco', 'golf-cannes', 'golf-antibes');
    }
    
    if (keywordLower.includes('st-tropez') || keywordLower.includes('saint-tropez')) {
      baseLinks.push('vtc-saint-tropez', 'plages-st-tropez', 'nightlife-st-tropez');
    }
    
    return baseLinks;
  }

  // Template par défaut
  getDefaultTemplate() {
    return {
      category: 'service-premium',
      style: 'default-premium',
      imageTypes: ['tesla-luxury', 'transport-premium', 'chauffeur-professional'],
      keywordsBase: ['transport', 'luxe', 'tesla', 'premium'],
      contentFocus: 'service de transport premium'
    };
  }

  // Générer le HTML complet d'un article
  generateArticleHTML(article) {
    const { content, images, keywords } = article;
    
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title} | ${this.brandName} ${this.mainService}</title>
  <meta name="description" content="${article.description}">
  <meta name="keywords" content="${keywords.join(', ')}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${article.title}">
  <meta property="og:description" content="${article.description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://${this.config.domain}${article.url}">
  <meta property="og:image" content="https://${this.config.domain}${images[0].url}">
  <meta property="og:image:width" content="${images[0].width}">
  <meta property="og:image:height" content="${images[0].height}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${article.title}">
  <meta name="twitter:description" content="${article.description}">
  <meta name="twitter:image" content="https://${this.config.domain}${images[0].url}">
  
  <!-- Canonical -->
  <link rel="canonical" href="https://${this.config.domain}${article.url}">
  
  <!-- Styles -->
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f8f9fa; line-height: 1.6; }
    .header { background: linear-gradient(135deg, #1877f2, #25d366); color: white; padding: 1rem; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; }
    .logo { font-size: 1.5rem; font-weight: bold; }
    .nav-links a { color: white; text-decoration: none; margin: 0 1rem; transition: opacity 0.3s; }
    .nav-links a:hover { opacity: 0.8; }
    .whatsapp-btn { background: #25d366; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 25px; transition: all 0.3s; }
    .whatsapp-btn:hover { background: #128c7e; transform: translateY(-2px); }
    
    .hero { background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${images[0].url}'); background-size: cover; background-position: center; color: white; text-align: center; padding: 6rem 2rem; }
    .hero-title { font-size: 3rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
    .hero-subtitle { font-size: 1.5rem; margin-bottom: 2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); }
    .hero-description { font-size: 1.1rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; }
    .hero-cta { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
    .btn-primary { background: #25d366; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 25px; font-weight: bold; transition: all 0.3s; }
    .btn-primary:hover { background: #128c7e; transform: translateY(-2px); }
    .btn-secondary { background: rgba(255,255,255,0.2); color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 25px; border: 2px solid white; transition: all 0.3s; }
    .btn-secondary:hover { background: white; color: #1877f2; }
    
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .section { background: white; margin: 2rem 0; padding: 3rem; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
    .section-title { color: #1877f2; font-size: 2rem; margin-bottom: 1.5rem; text-align: center; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0; }
    .feature-card { text-align: center; padding: 2rem; border-radius: 10px; background: #f8f9fa; transition: transform 0.3s; }
    .feature-card:hover { transform: translateY(-5px); }
    .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
    .benefit-card { background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 2rem; border-radius: 10px; border-left: 4px solid #1877f2; }
    .pricing-table { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0; }
    .pricing-card { background: white; border: 2px solid #1877f2; border-radius: 10px; padding: 2rem; text-align: center; }
    .pricing-price { font-size: 2rem; color: #1877f2; font-weight: bold; margin: 1rem 0; }
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin: 2rem 0; }
    .gallery-item { border-radius: 10px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
    .gallery-item img { width: 100%; height: 250px; object-fit: cover; transition: transform 0.3s; }
    .gallery-item:hover img { transform: scale(1.05); }
    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
    .testimonial-card { background: #f8f9fa; padding: 2rem; border-radius: 10px; text-align: center; }
    .rating { color: #ffc107; font-size: 1.5rem; margin-bottom: 1rem; }
    .cta-section { background: linear-gradient(135deg, #1877f2, #25d366); color: white; text-align: center; padding: 3rem; border-radius: 15px; margin: 3rem 0; }
    .cta-title { font-size: 2.5rem; margin-bottom: 1rem; }
    .cta-description { font-size: 1.2rem; margin-bottom: 2rem; }
    .internal-links { background: #e9ecef; padding: 2rem; margin: 2rem 0; border-radius: 10px; }
    .internal-links h3 { color: #1877f2; margin-bottom: 1rem; }
    .internal-links a { color: #1877f2; text-decoration: none; margin: 0.5rem; display: inline-block; }
    .internal-links a:hover { text-decoration: underline; }
    .footer { background: #333; color: white; padding: 3rem 2rem; text-align: center; margin-top: 3rem; }
    
    @media (max-width: 768px) {
      .hero-title { font-size: 2rem; }
      .hero-subtitle { font-size: 1.2rem; }
      .section { padding: 2rem 1rem; }
      .nav-links { display: none; }
    }
  </style>
</head>
<body>
  <header class="header">
    <nav class="nav">
      <div class="logo">🚗 ${this.brandName} ${this.mainService}</div>
      <div class="nav-links">
        <a href="/">Accueil</a>
        <a href="/articles">Articles</a>
        <a href="/vtc-nice">VTC Nice</a>
        <a href="/vtc-monaco">VTC Monaco</a>
        <a href="/tarifs-vtc">Tarifs</a>
        <a href="/reservations">Réservations</a>
        <a href="/contact">Contact</a>
      </div>
      <div class="cta-button">
        <a href="https://wa.me/33616552811?text=Bonjour%20je%20souhaite%20${article.id}" class="whatsapp-btn">
          📞 WhatsApp
        </a>
      </div>
    </nav>
  </header>

  <section class="hero">
    <h1 class="hero-title">${content.hero.title}</h1>
    <p class="hero-subtitle">${content.hero.subtitle}</p>
    <p class="hero-description">${content.hero.description}</p>
    <div class="hero-cta">
      <a href="https://wa.me/33616552811?text=Bonjour%20je%20souhaite%20${article.id}" class="btn-primary">
        🚗 ${content.hero.cta}
      </a>
      <a href="/tarifs-vtc" class="btn-secondary">
        💰 Voir Tarifs
      </a>
    </div>
  </section>

  <main class="container">
    ${content.sections.map(section => this.generateSectionHTML(section, article)).join('')}
    
    <div class="internal-links">
      <h3>🔗 Articles et Services Connexes</h3>
      ${article.internalLinks.map(link => {
        const linkText = link.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `<a href="/${link}">${linkText}</a>`;
      }).join(' | ')}
    </div>
  </main>

  <footer class="footer">
    <div>
      <h3>${this.brandName} ${this.mainService}</h3>
      <p>Service de transport 100% électrique sur ${this.region}</p>
      <p>📞 WhatsApp: +33 6 16 55 28 11 | 🌐 www.${this.config.domain}</p>
      <p>&copy; 2024 ${this.brandName}. Tous droits réservés.</p>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="/scripts/analytics.js"></script>
  <script>
    // Tracking interactions
    document.querySelectorAll('.whatsapp-btn, .btn-primary').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.ECOFUNDRIVE) {
          window.ECOFUNDRIVE.trackWhatsAppClick();
        }
      });
    });
    
    // Gallery lazy loading
    const images = document.querySelectorAll('.gallery-item img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  </script>
</body>
</html>`;
  }

  // Générer le HTML d'une section
  generateSectionHTML(section, article) {
    switch (section.type) {
      case 'introduction':
        return `
        <section class="section">
          <h2 class="section-title">${section.title}</h2>
          <p style="font-size: 1.1rem; line-height: 1.8; text-align: center; color: #6c757d;">
            ${section.content}
          </p>
        </section>`;
        
      case 'service-details':
        return `
        <section class="section">
          <h2 class="section-title">${section.title}</h2>
          <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">
            ${section.content}
          </p>
          <div class="features-grid">
            ${section.features.map(feature => `
            <div class="feature-card">
              <div class="feature-icon">${feature.split(' ')[0]}</div>
              <h4>${feature.substring(2).trim()}</h4>
            </div>`).join('')}
          </div>
        </section>`;
        
      case 'benefits':
        return `
        <section class="section">
          <h2 class="section-title">${section.title}</h2>
          <div class="benefits-grid">
            ${section.benefits.map(benefit => `
            <div class="benefit-card">
              <h3>${benefit.title}</h3>
              <p>${benefit.description}</p>
            </div>`).join('')}
          </div>
        </section>`;
        
      case 'pricing':
        return `
        <section class="section">
          <h2 class="section-title">${section.title}</h2>
          <div class="pricing-table">
            ${section.pricing.map(price => `
            <div class="pricing-card">
              <h3>${price.service}</h3>
              <div class="pricing-price">${price.price}</div>
              <p>⏱️ ${price.duration}</p>
            </div>`).join('')}
          </div>
        </section>`;
        
      case 'gallery':
        return `
        <section class="section">
          <h2 class="section-title">${section.title}</h2>
          <div class="gallery-grid">
            ${section.images.map(image => `
            <div class="gallery-item">
              <img src="${image.url}" alt="${image.alt}" loading="lazy">
            </div>`).join('')}
          </div>
        </section>`;
        
      case 'testimonials':
        return `
        <section class="section">
          <h2 class="section-title">${section.title}</h2>
          <div class="testimonials-grid">
            ${section.testimonials.map(testimonial => `
            <div class="testimonial-card">
              <div class="rating">${'⭐'.repeat(testimonial.rating)}</div>
              <p>"${testimonial.comment}"</p>
              <p><strong>${testimonial.name}</strong></p>
            </div>`).join('')}
          </div>
        </section>`;
        
      case 'cta':
        return `
        <section class="cta-section">
          <h2 class="cta-title">${section.title}</h2>
          <p class="cta-description">${section.description}</p>
          <div>
            ${section.buttons.map(btn => `
            <a href="${btn.url}" class="${btn.primary ? 'btn-primary' : 'btn-secondary'}" style="margin: 0.5rem;">
              ${btn.text}
            </a>`).join('')}
          </div>
        </section>`;
        
      default:
        return `<section class="section"><h2>${section.title}</h2><p>${section.content || ''}</p></section>`;
    }
  }

  // Créer les répertoires nécessaires
  createDirectories() {
    const dirs = [this.config.outputDir, this.config.articlesDir, this.config.imagesDir];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  ✅ Répertoire créé: ${dir}`);
      }
    });
  }

  // Sauvegarder un article
  saveArticle(article) {
    const articleHTML = this.generateArticleHTML(article);
    const articlePath = path.join(this.config.articlesDir, `${article.id}.html`);
    
    fs.writeFileSync(articlePath, articleHTML, 'utf8');
    console.log(`  ✅ Article sauvegardé: ${articlePath}`);
    
    return articlePath;
  }

  // Mettre à jour l'index des articles
  updateArticlesIndex() {
    const indexPath = path.join(this.config.outputDir, 'articles-index.json');
    let existingIndex = { articles: [] };
    
    if (fs.existsSync(indexPath)) {
      existingIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    }
    
    // Fusionner avec les nouveaux articles (éviter les doublons)
    const existingIds = new Set(existingIndex.articles.map(a => a.id));
    const newUniqueArticles = this.generatedArticles.filter(a => !existingIds.has(a.id));
    
    existingIndex.articles.push(...newUniqueArticles);
    existingIndex.total = existingIndex.articles.length;
    existingIndex.lastUpdated = new Date().toISOString();
    
    fs.writeFileSync(indexPath, JSON.stringify(existingIndex, null, 2), 'utf8');
    console.log(`  ✅ Index mis à jour: ${existingIndex.total} articles totaux`);
    
    return indexPath;
  }

  // Générer depuis une liste de mots-clés
  generateFromKeywords(keywords, customDomain = null) {
    console.log(`🚀 Génération de ${keywords.length} articles depuis mots-clés...`);
    
    if (customDomain) {
      this.config.domain = customDomain;
    }
    
    this.createDirectories();
    
    keywords.forEach(keyword => {
      this.generateArticleFromKeyword(keyword, customDomain);
    });
    
    // Sauvegarder tous les articles
    const savedFiles = this.generatedArticles.map(article => this.saveArticle(article));
    
    // Mettre à jour l'index
    this.updateArticlesIndex();
    
    console.log(`🎉 Génération terminée: ${this.generatedArticles.length} articles créés`);
    
    return {
      articles: this.generatedArticles,
      files: savedFiles,
      total: this.generatedArticles.length
    };
  }
}

// Exemple d'utilisation
async function main() {
  const generator = new UniversalArticleGenerator();
  
  // Exemple avec "golf st tropez"
  const keywords = ['golf st tropez'];
  
  const result = generator.generateFromKeywords(keywords);
  
  console.log('\n📊 RÉSULTAT:');
  console.log('============');
  console.log(`✅ ${result.total} articles générés`);
  console.log('📝 Articles créés:');
  result.articles.forEach(article => {
    console.log(`  - ${article.title}`);
    console.log(`    📂 ${article.url}`);
    console.log(`    🏷️ ${article.category}`);
    console.log(`    🖼️ ${article.images.length} images`);
  });
  
  console.log('\n🎯 PROCHAINES ÉTAPES:');
  console.log('1. Vérifier les fichiers HTML générés');
  console.log('2. Ajouter les images réelles dans ./public/images/');
  console.log('3. Mettre à jour le sitemap');
  console.log('4. Déployer sur votre serveur');
}

// Exécuter si appelé directement
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
}

module.exports = { UniversalArticleGenerator };
