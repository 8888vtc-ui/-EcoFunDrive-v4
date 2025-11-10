# 🌐 Générateur de Contenu SEO Universel

Un outil puissant pour générer et optimiser du contenu SEO en utilisant l'IA avancée.

## 🚀 Fonctionnalités

- Génération de contenu avec Claude 4.5
- Optimisation SEO avec GPT-4
- Génération d'images avec DALL-E 3
- Validation SEO complète
- Support multilingue
- Structure de contenu optimisée

## 📦 Installation

1. **Cloner le dépôt**
   ```bash
   git clone [URL_DU_DEPOT]
   cd ecofundrive/src/generateur-seo
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer le fichier .env avec vos clés API
   ```

## 🔧 Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Clés API
CLAUDE_API_KEY=votre_cle_api_claude
OPENAI_API_KEY=votre_cle_api_openai
IMAGE_API_KEY=votre_cle_api_images

# Configuration de l'application
NODE_ENV=development
PORT=3000
```

## 🚀 Utilisation

### Générer du contenu

```javascript
const ContentGenerator = require('./core/contentGenerator');

async function generateArticle() {
  const generator = new ContentGenerator();
  
  const result = await generator.generateContent({
    keyword: 'voiture électrique',
    language: 'fr',
    tone: 'professionnel',
    wordCount: 1500,
    includeImages: true,
    seoLevel: 'advanced'
  });

  console.log('Contenu généré avec succès !');
  console.log(`Score SEO: ${result.seoReport.score}/100`);
  console.log('Contenu:', result.content);
}

generateArticle().catch(console.error);
```

### API REST (Express)

Un serveur Express est disponible pour exposer les fonctionnalités via une API REST :

```bash
# Démarrer le serveur
npm run start
```

#### Endpoints disponibles :

- `POST /api/generate` - Générer du contenu
  ```json
  {
    "keyword": "voiture électrique",
    "language": "fr",
    "tone": "professionnel",
    "wordCount": 1500,
    "includeImages": true,
    "seoLevel": "advanced"
  }
  ```

- `POST /api/check-seo` - Vérifier le SEO d'un contenu
  ```json
  {
    "content": "<h1>Mon article</h1><p>Contenu de l'article...</p>",
    "keyword": "voiture électrique"
  }
  ```

## 🧪 Tests

```bash
# Exécuter les tests
npm test

# Générer un rapport de couverture
npm run test:coverage
```

## 📊 Métriques SEO

Le générateur vérifie et optimise :

- Densité des mots-clés (1-2%)
- Structure des titres (H1, H2, H3...)
- Balises meta (title, description)
- Attributs alt des images
- Liens internes et externes
- Lisibilité du contenu
- Longueur du contenu

## 📄 Licence

MIT

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt.
