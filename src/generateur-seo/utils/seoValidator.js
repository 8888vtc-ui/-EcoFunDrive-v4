const cheerio = require('cheerio');

/**
 * Valide le contenu généré selon les critères SEO
 * @param {Object} options - Options de validation
 * @returns {Promise<Object>} - Rapport de validation SEO
 */
async function validateSEO(options) {
  const { content, keyword, language = 'fr' } = options;
  
  try {
    const $ = cheerio.load(content);
    const text = $('body').text();
    const wordCount = text.split(/\s+/).length;
    
    // Vérification des balises
    const hasH1 = $('h1').length > 0;
    const h1Text = hasH1 ? $('h1').first().text() : '';
    const hasH2 = $('h2').length > 0;
    const headings = [];
    
    $('h1, h2, h3, h4, h5, h6').each((i, el) => {
      headings.push({
        tag: el.tagName.toLowerCase(),
        text: $(el).text(),
      });
    });
    
    // Vérification des images
    const images = [];
    let hasImages = false;
    let hasAltTags = true;
    
    $('img').each((i, el) => {
      hasImages = true;
      const alt = $(el).attr('alt') || '';
      if (!alt.trim()) {
        hasAltTags = false;
      }
      
      images.push({
        src: $(el).attr('src') || '',
        alt,
        title: $(el).attr('title') || '',
      });
    });
    
    // Vérification des liens
    const links = [];
    let hasInternalLinks = false;
    let hasExternalLinks = false;
    
    $('a').each((i, el) => {
      const href = $(el).attr('href') || '';
      const isInternal = !/^https?:\/\//.test(href) || href.includes('votredomaine.com');
      
      if (isInternal) {
        hasInternalLinks = true;
      } else {
        hasExternalLinks = true;
      }
      
      links.push({
        href,
        text: $(el).text(),
        isInternal,
        nofollow: $(el).attr('rel') === 'nofollow',
      });
    });
    
    // Calcul du score SEO
    const score = calculateSEOScore({
      hasH1,
      h1Text,
      hasH2,
      wordCount,
      hasImages,
      hasAltTags,
      hasInternalLinks,
      hasExternalLinks,
      headings,
      keyword,
      text,
    });
    
    // Génération du rapport
    const report = {
      score,
      wordCount,
      issues: [],
      warnings: [],
      recommendations: [],
      details: {
        headings,
        images,
        links,
        keywordDensity: calculateKeywordDensity(text, keyword),
        readability: calculateReadability(text, language),
      },
    };
    
    // Vérifications supplémentaires
    if (!hasH1) {
      report.issues.push('Aucune balise H1 trouvée');
    } else if (!h1Text.toLowerCase().includes(keyword.toLowerCase())) {
      report.warnings.push(`Le mot-clé principal n'est pas présent dans le H1: "${h1Text}"`);
    }
    
    if (!hasH2) {
      report.issues.push('Aucune balise H2 trouvée');
    }
    
    if (wordCount < 800) {
      report.warnings.push(`Le contenu est court (${wordCount} mots). Essayez d'atteindre au moins 1000 mots.`);
    }
    
    if (!hasImages) {
      report.recommendations.push('Ajoutez des images pour améliorer l\'engagement');
    } else if (!hasAltTags) {
      report.issues.push('Certaines images n\'ont pas d\'attribut alt');
    }
    
    if (!hasInternalLinks) {
      report.recommendations.push('Ajoutez des liens internes vers d\'autres pages de votre site');
    }
    
    if (!hasExternalLinks) {
      report.recommendations.push('Ajoutez des liens externes vers des sources fiables');
    }
    
    return report;
    
  } catch (error) {
    console.error('Erreur lors de la validation SEO:', error);
    throw new Error(`Échec de la validation SEO: ${error.message}`);
  }
}

/**
 * Calcule le score SEO global
 * @private
 */
function calculateSEOScore(metrics) {
  const {
    hasH1,
    h1Text,
    hasH2,
    wordCount,
    hasImages,
    hasAltTags,
    hasInternalLinks,
    hasExternalLinks,
    headings,
    keyword,
    text,
  } = metrics;
  
  let score = 100;
  
  // Pénalités
  if (!hasH1) score -= 15;
  if (hasH1 && !h1Text.toLowerCase().includes(keyword.toLowerCase())) score -= 5;
  if (!hasH2) score -= 10;
  if (wordCount < 300) score -= 20;
  else if (wordCount < 600) score -= 10;
  else if (wordCount < 1000) score -= 5;
  
  // Vérification de la structure des titres
  let lastLevel = 0;
  let hasBadStructure = false;
  
  for (const heading of headings) {
    const level = parseInt(heading.tag.substring(1));
    if (level > lastLevel + 1) {
      hasBadStructure = true;
      break;
    }
    lastLevel = level;
  }
  
  if (hasBadStructure) score -= 10;
  
  // Vérification des images
  if (!hasImages) score -= 5;
  else if (!hasAltTags) score -= 10;
  
  // Vérification des liens
  if (!hasInternalLinks) score -= 5;
  if (!hasExternalLinks) score -= 5;
  
  // Vérification de la densité de mots-clés
  const density = calculateKeywordDensity(text, keyword);
  if (density < 0.5) score -= 10;
  else if (density > 3) score -= 10;
  
  // Assurez-vous que le score est entre 0 et 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calcule la densité de mots-clés
 * @private
 */
function calculateKeywordDensity(text, keyword) {
  if (!text || !keyword) return 0;
  
  const words = text.toLowerCase().split(/\s+/);
  const keywordLower = keyword.toLowerCase();
  let count = 0;
  
  for (const word of words) {
    if (word === keywordLower) {
      count++;
    }
  }
  
  return (count / words.length) * 100;
}

/**
 * Calcule la lisibilité du texte
 * @private
 */
function calculateReadability(text, language = 'fr') {
  // Implémentation simplifiée de l'indice de Flesch
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const syllables = countSyllables(text);
  
  if (words.length === 0 || sentences.length === 0) return 0;
  
  const wordsPerSentence = words.length / sentences.length;
  const syllablesPerWord = syllables / words.length;
  
  // Formule adaptée pour le français
  if (language === 'fr') {
    return Math.max(0, Math.min(100, 207 - (1.015 * wordsPerSentence) - (73.6 * syllablesPerWord)));
  }
  
  // Formule de Flesch-Kincaid pour l'anglais
  return Math.max(0, Math.min(100, 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord)));
}

/**
 * Compte les syllabes dans un texte (approximation)
 * @private
 */
function countSyllables(text) {
  // Cette fonction est une approximation et peut ne pas être précise pour toutes les langues
  const word = text.toLowerCase();
  if (word.length <= 3) return 1;
  
  // Suppression des 'e' muets en fin de mot
  const wordWithoutFinalE = word.replace(/[aiouy]e\b|e\b/g, 'a');
  
  // Comptage des groupes de voyelles
  const syllables = wordWithoutFinalE.split(/[^aeiouy]+/).filter(s => s.length > 0);
  
  // Ajustement pour les mots courts
  return Math.max(1, syllables.length - 1);
}

module.exports = { validateSEO, calculateKeywordDensity, calculateReadability };
