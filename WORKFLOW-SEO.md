# 🌐 Workflow Complet de Génération SEO

## 1. Initialisation du Projet

### Structure des Dossiers
```
src/
├── ai/
│   ├── claude.js       # Client Claude 4.5
│   └── gpt-validator.js # Validation GPT-4
├── content/
│   └── templates/      # Modèles de contenu
├── public/
│   └── images/         # Images optimisées
└── utils/
    ├── seo.js         # Helpers SEO
    └── netlify.js     # Déploiement
```

### Installation
```bash
# Configuration initiale
npm init -y
npm install @anthropic-ai/sdk openai @netlify/functions

# Fichier .env
CLAUDE_API_KEY=votre_cle_claude
OPENAI_API_KEY=votre_cle_openai
NETLIFY_TOKEN=votre_token_netlify
SITE_URL=https://votresite.com
```

---

## 2. Génération de Contenu avec Claude 4.5

### Prompt de Génération Initiale
```javascript
// prompts/content-generation.js
export const generateContentPrompt = (keyword) => `
Crée un contenu optimisé SEO pour: "${keyword}"

Exigences :
- Longueur: 2000-2500 mots
- Structure: H1, 4-6 H2, 2-3 H3 par H2
- Mots-clés: Densité 0.8-1.2%
- Images: 1 image/600 mots avec balises alt
- Liens: 5-8 liens internes pertinents

Ton: Professionnel et engageant
Public: Clients VTC premium en France

Format de sortie en HTML valide.`;
```

### Appel API Claude
```javascript
// ai/claude.js
import Anthropic from '@anthropic-ai/sdk';

const claude = new Anthropic(process.env.CLAUDE_API_KEY);

export async function generateContent({ prompt, model = 'claude-4.5-sonnet' }) {
  const response = await claude.messages.create({
    model,
    max_tokens: 4000,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });
  
  return response.content[0].text;
}
```

---

## 3. Validation SEO avec GPT-4

### Schéma de Validation
```javascript
// schemas/seo-validation.js
export const SEORules = {
  title: {
    minLength: 30,
    maxLength: 60,
    keywordPosition: 0 // Le mot-clé doit être au début
  },
  content: {
    minWords: 2000,
    maxLinks: 8,
    keywordDensity: { min: 0.8, max: 1.2 }
  },
  images: {
    requiredAlt: true,
    maxSize: 250 // Ko
  }
};
```

### Validateur GPT-4
```javascript
// ai/gpt-validator.js
export async function validateSEO(content) {
  const prompt = `Analyse SEO du contenu suivant selon les règles fournies.
  Retourne un JSON avec : score, issues[], metadata{}`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: 'Tu es un expert SEO technique.' },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' }
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

---

## 4. Boucle de Correction

### Algorithme Principal
```javascript
// workflows/generate-page.js
async function generateAndOptimize(keyword) {
  let content = await generateWithClaude(keyword);
  let validation = await validateWithGPT4(content);
  let attempt = 1;
  
  while (validation.score < 90 && attempt <= 3) {
    console.log(`🔄 Tentative ${attempt}: Score ${validation.score}/100`);
    content = await correctWithGPT4(content, validation);
    validation = await validateWithGPT4(content);
    attempt++;
  }
  
  if (validation.score >= 90) {
    await deployToNetlify(content);
    return { success: true, score: validation.score };
  }
  
  throw new Error(`Échec après ${attempt} tentatives`);
}
```

### Journalisation
```
📅 [2025-11-10T15:30:00] Début génération: "VTC Aéroport Nice"
✅ Contenu généré (2450 mots)
🔍 Analyse SEO...
⚠️ Score initial: 78/100

🔄 Correction 1/3
• Problème: Titre trop long (72/60)
• Correction appliquée
✅ Nouveau score: 85/100

🔄 Correction 2/3
• Problème: Densité mot-clé faible (0.6%)
• Correction appliquée
✅ Score final: 92/100

🚀 Déploiement en cours...
🌐 Page publiée: https://ecofundrive-vtc-nice-123.netlify.app
```

---

## 5. Déploiement Automatisé

### Configuration Netlify
```javascript
// utils/netlify.js
export async function deployToNetlify(htmlContent) {
  const siteName = `ecofundrive-${Date.now()}`;
  
  const response = await fetch('https://api.netlify.com/api/v1/sites', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}`,
      'Content-Type': 'application/zip'
    },
    body: createZipFromHtml(htmlContent)
  });
  
  if (!response.ok) throw new Error('Échec du déploiement');
  return response.json();
}
```

### Fichier de Configuration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 6. Exécution

### Ligne de Commande
```bash
# Génération d'une page
node generate-page.js "VTC Aéroport Nice"

# Génération par lot
node batch-generate.js keywords.txt
```

### Fichier de Sortie
```json
{
  "url": "https://ecofundrive-vtc-nice-123.netlify.app",
  "score": 94,
  "metrics": {
    "wordCount": 2345,
    "images": 4,
    "internalLinks": 6,
    "loadTime": "1.2s",
    "seoScore": 94
  },
  "timestamp": "2025-11-10T15:35:22Z"
}
```

---

## 7. Monitoring

### Métriques à Surveiller
1. Performance SEO (score/100)
2. Temps de génération moyen
3. Taux de réussite
4. Problèmes récurrents

### Alertes
- Score < 80 après 3 tentatives
- Échec de déploiement
- Problèmes critiques détectés

---

## 8. Maintenance

### Mises à Jour Mensuelles
1. Revue des règles SEO
2. Optimisation des prompts
3. Analyse des performances
4. Sauvegarde des données

### Journal des Modifications
```
# 2025-11-10 - v1.2.0
- Ajout support Claude 4.5
- Amélioration du système de correction
- Optimisation des temps de réponse
```
