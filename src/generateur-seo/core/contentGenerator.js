const config = require('../config/config');
const { callClaudeAPI } = require('../api/claude');
const { optimizeSEO } = require('../api/gpt');
const { generateImage } = require('../api/images');
const { validateSEO } = require('../utils/seoValidator');

class ContentGenerator {
  constructor(options = {}) {
    this.options = {
      ...config.seo,
      ...options,
    };
  }

  /**
   * Génère un contenu optimisé SEO
   * @param {Object} params - Paramètres de génération
   * @returns {Promise<Object>} - Contenu généré et métadonnées
   */
  async generateContent(params) {
    const {
      keyword,
      language = 'fr',
      tone = 'professionnel',
      wordCount = 1500,
      includeImages = true,
      seoLevel = 'advanced',
    } = params;

    try {
      // 1. Génération du contenu brut avec Claude 4.5
      const rawContent = await this._generateRawContent({
        keyword,
        language,
        tone,
        wordCount,
      });

      // 2. Optimisation SEO avec GPT-4
      const optimizedContent = await this._optimizeContent({
        content: rawContent,
        keyword,
        language,
        seoLevel,
      });

      // 3. Génération d'images si nécessaire
      let images = [];
      if (includeImages) {
        images = await this._generateImages({
          keyword,
          count: 3, // Nombre d'images à générer
          style: 'realistic',
        });
      }

      // 4. Validation SEO finale
      const seoReport = await validateSEO({
        content: optimizedContent,
        keyword,
        language,
      });

      return {
        success: seoReport.score >= 80,
        content: optimizedContent,
        seoReport,
        images,
        metadata: {
          keyword,
          language,
          wordCount: optimizedContent.length,
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Erreur lors de la génération du contenu:', error);
      throw new Error(`Échec de la génération du contenu: ${error.message}`);
    }
  }

  /**
   * Génère un contenu brut avec Claude 4.5
   * @private
   */
  async _generateRawContent({ keyword, language, tone, wordCount }) {
    const prompt = `Génère un article complet et détaillé sur le thème "${keyword}" en ${language}.
    
    Ton: ${tone}
    Longueur: Environ ${wordCount} mots
    
    Structure attendue:
    1. Titre accrocheur (50-60 caractères)
    2. Introduction engageante (100-150 mots)
    3. 3-5 sections avec sous-titres H2
    4. Paragraphes courts et aérés
    5. Listes à puces si pertinent
    6. Conclusion avec appel à l'action
    
    Points clés à aborder:
    - Définition et contexte
    - Avantages et inconvénients
    - Conseils pratiques
    - Tendances actuelles
    - Perspectives d'avenir`;

    return await callClaudeAPI({
      prompt,
      maxTokens: config.claude.maxTokens,
      temperature: config.claude.temperature,
    });
  }

  /**
   * Optimise le contenu pour le SEO avec GPT-4
   * @private
   */
  async _optimizeContent({ content, keyword, language, seoLevel }) {
    const prompt = `Optimise ce contenu pour le référencement avec le mot-clé "${keyword}" en ${language}.
    
    Niveau d'optimisation: ${seoLevel}
    
    Actions requises:
    1. Ajuster la densité de mots-clés entre 1% et 2%
    2. Créer une méta-description accrocheuse (120-160 caractères)
    3. Optimiser les balises H1, H2, H3
    4. Ajouter des attributs alt aux images
    5. Vérifier la lisibilité
    6. Ajouter des liens internes et externes pertinents
    
    Contenu à optimiser:
    ${content}`;

    return await optimizeSEO({
      prompt,
      maxTokens: config.openai.maxTokens,
      temperature: config.openai.temperature,
    });
  }

  /**
   * Génère des images en rapport avec le contenu
   * @private
   */
  async _generateImages({ keyword, count = 3, style = 'realistic' }) {
    const images = [];
    
    for (let i = 0; i < count; i++) {
      const prompt = this._generateImagePrompt(keyword, style, i);
      const image = await generateImage({
        prompt,
        style,
        size: config.images.defaultSize,
      });
      
      if (image) {
        images.push({
          url: image.url,
          alt: `Image illustrant ${keyword}`,
          style,
          position: i + 1,
        });
      }
    }
    
    return images;
  }

  /**
   * Génère un prompt pour la création d'images
   * @private
   */
  _generateImagePrompt(keyword, style, index) {
    const styles = {
      realistic: `Une photo réaliste de haute qualité représentant ${keyword} dans un cadre professionnel, bien éclairée, nette et détaillée.`,
      illustration: `Une illustration vectorielle moderne et épurée de ${keyword}, adaptée à un site web professionnel.`,
      infographic: `Une infographie claire et informative sur ${keyword}, avec des icônes et des éléments visuels pour faciliter la compréhension.`,
    };

    return styles[style] || styles.realistic;
  }
}

module.exports = ContentGenerator;
