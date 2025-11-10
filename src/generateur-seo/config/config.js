// Configuration du générateur SEO
module.exports = {
  // Paramètres de l'API Claude 4.5
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: 'claude-4.5',
    maxTokens: 4000,
    temperature: 0.7,
  },

  // Paramètres de l'API OpenAI (GPT-4)
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.5,
  },

  // Paramètres de génération d'images
  images: {
    apiKey: process.env.IMAGE_API_KEY || '',
    service: 'dall-e-3',
    defaultStyle: 'realistic',
    defaultSize: '1024x1024',
  },

  // Paramètres SEO par défaut
  seo: {
    defaultLanguage: 'fr',
    minWordCount: 1000,
    maxWordCount: 3000,
    keywordDensity: {
      min: 1,
      max: 2,
    },
    metaDescriptionLength: {
      min: 120,
      max: 160,
    },
  },

  // Paramètres de performance
  performance: {
    cacheTtl: 3600, // 1 heure en secondes
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limite de 100 requêtes par fenêtre
    },
  },
};
