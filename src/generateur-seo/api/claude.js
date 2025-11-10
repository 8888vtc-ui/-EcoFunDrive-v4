const config = require('../config/config');

/**
 * Appel à l'API Claude 4.5 pour la génération de contenu
 * @param {Object} options - Options de l'API
 * @returns {Promise<string>} - Contenu généré
 */
async function callClaudeAPI(options) {
  const {
    prompt,
    model = config.claude.model,
    maxTokens = config.claude.maxTokens,
    temperature = config.claude.temperature,
  } = options;

  if (!config.claude.apiKey) {
    throw new Error('Clé API Claude non configurée. Veuillez définir CLAUDE_API_KEY dans les variables d\'environnement.');
  }

  try {
    // En production, remplacer par un appel réel à l'API Claude
    // Ceci est une simulation pour l'exemple
    console.log(`Appel à l'API Claude avec le prompt: ${prompt.substring(0, 100)}...`);
    
    // Simulation de réponse de l'API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = `Ceci est une réponse simulée de Claude 4.5 pour le prompt: ${prompt.substring(0, 100)}...`;
        resolve(mockResponse);
      }, 1000);
    });
    
    /* Code réel pour l'API Claude (à décommenter en production)
    const response = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.claude.apiKey,
      },
      body: JSON.stringify({
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
        model,
        max_tokens_to_sample: maxTokens,
        temperature,
        stop_sequences: ['\n\nHuman:'],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur API Claude: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.completion.trim();
    */
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Claude:', error);
    throw new Error(`Échec de la génération avec Claude: ${error.message}`);
  }
}

module.exports = { callClaudeAPI };
