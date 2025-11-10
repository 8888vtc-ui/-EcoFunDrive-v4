# 🚀 ECOFUNDRIVE V3 - Documentation Technique Complète

## 📋 Vue d'Ensemble

ECOFUNDRIVE V3 est un générateur de contenu SEO automatisé utilisant une approche par prompts divisés pour une fiabilité maximale.

### Architecture Principale
- **Frontend** : Astro 4.x (SSG)
- **Backend** : Node.js 20.x + TypeScript
- **AI APIs** : Claude 4.5 (génération), GPT-4 (validation), Replicate (images)
- **Déploiement** : Netlify (Edge Functions)

---

## 🏗️ Structure du Projet

```
ecofundrive-v3/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Tests automatiques
│       └── deploy.yml          # Déploiement Netlify
├── docs/
│   ├── api/                    # Documentation API
│   ├── guides/                 # Guides d'utilisation
│   └── architecture/           # Architecture technique
├── src/
│   ├── components/             # Composants Astro
│   │   ├── seo/
│   │   │   ├── StructuredData.astro
│   │   │   └── MetaTags.astro
│   │   └── layout/
│   │       ├── Header.astro
│   │       └── Footer.astro
│   ├── content/
│   │   └── generated/          # Pages générées
│   ├── generators/
│   │   ├── structure.ts        # Génération structure
│   │   ├── sections.ts         # Génération sections
│   │   ├── optimizer.ts        # Optimisation SEO
│   │   └── images.ts           # Génération images
│   ├── validators/
│   │   ├── seo.ts              # Validation SEO
│   │   └── content.ts          # Validation contenu
│   ├── api/
│   │   ├── claude.ts           # Client Claude 4.5
│   │   ├── gpt.ts              # Client GPT-4
│   │   └── replicate.ts        # Client Replicate
│   ├── utils/
│   │   ├── prompts.ts          # Gestion prompts
│   │   ├── metrics.ts          # Métriques
│   │   └── cache.ts            # Cache Edge
│   ├── types/
│   │   ├── seo.ts              # Types SEO
│   │   └── content.ts          # Types contenu
│   └── pages/
│       ├── index.astro         # Homepage
│       └── [...slug].astro     # Pages dynamiques
├── netlify/
│   └── functions/
│       ├── generate.ts         # Endpoint génération
│       └── validate.ts         # Endpoint validation
├── tests/
│   ├── unit/                   # Tests unitaires
│   ├── integration/            # Tests d'intégration
│   └── e2e/                    # Tests end-to-end
├── scripts/
│   ├── build.ts                # Build optimisé
│   ├── deploy.ts               # Déploiement
│   └── generate-batch.ts       # Génération par lot
├── .env.example                # Variables d'environnement
├── package.json                # Dépendances
├── tsconfig.json               # Config TypeScript
├── astro.config.mjs            # Config Astro
├── netlify.toml                # Config Netlify
└── README.md                   # Documentation
```

---

## 🔧 Prérequis Techniques

### Système Requis
- **Node.js** : 20.x LTS ou supérieur
- **pnpm** : 8.x ou supérieur (recommandé)
- **Git** : 2.30 ou supérieur

### APIs Externes
1. **Claude API** (Anthropic)
   - Endpoint : `https://api.anthropic.com`
   - Modèles : `claude-4.5-sonnet`
   - Rate Limit : 1000 req/min

2. **OpenAI API** (GPT-4)
   - Endpoint : `https://api.openai.com`
   - Modèles : `gpt-4-turbo`
   - Rate Limit : 500 req/min

3. **Replicate API** (Flux Pro)
   - Endpoint : `https://api.replicate.com`
   - Modèles : `flux-pro`
   - Rate Limit : 120 req/min

---

## 📦 Installation

### 1. Cloner le Repository
```bash
git clone https://github.com/votre-org/ecofundrive-v3.git
cd ecofundrive-v3
```

### 2. Installation des Dépendances
```bash
# Avec pnpm (recommandé)
pnpm install

# Ou avec npm
npm install
```

### 3. Configuration Environnement
```bash
cp .env.example .env.local
# Éditer .env.local avec vos clés API
```

### 4. Variables d'Environnement
```env
# APIs AI
CLAUDE_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx
REPLICATE_API_KEY=r8_xxx

# Netlify
NETLIFY_TOKEN=nfp_xxx
NETLIFY_SITE_ID=xxx

# Configuration
SITE_URL=https://votresite.com
DEFAULT_LOCALE=fr
SUPPORTED_LOCALES=fr,en,he

# Performance
ENABLE_EDGE_CACHE=true
IMAGE_QUALITY=85
GTM_ID=GTM-XXXXXXX
```

---

## 🚀 Développement

### Lancement Local
```bash
# Développement
pnpm dev

# Build local
pnpm build

# Preview
pnpm preview
```

### Génération de Contenu
```bash
# Génération d'une page
pnpm generate "VTC Aéroport Nice"

# Génération par lot
pnpm generate:batch keywords.txt

# Génération avec validation
pnpm generate:validated "Votre mot-clé"
```

---

## 🧪 Tests

### Suite de Tests
```bash
# Tests unitaires
pnpm test:unit

# Tests d'intégration
pnpm test:integration

# Tests end-to-end
pnpm test:e2e

# Tous les tests
pnpm test

# Coverage
pnpm test:coverage
```

### Tests Critiques
1. **Validation SEO**
   - Score minimum 90/100
   - Structure H1/H2/H3 correcte
   - Méta-données complètes

2. **Performance**
   - Lighthouse 95/100 minimum
   - Core Web Vitals dans les seuils
   - Temps de chargement <3s

3. **Accessibilité**
   - WCAG 2.1 AA
   - Alt text sur toutes les images
   - Navigation au clavier

---

## 📊 Monitoring

### Métriques Suivies
- **Score SEO** par page générée
- **Temps de génération** moyen
- **Taux de réussite** des validations
- **Coûts API** par page
- **Performance** Lighthouse

### Dashboard
- Grafana pour les métriques temps réel
- Alertes Slack pour les échecs
- Rapports hebdomadaires automatiques

---

## 🔒 Sécurité

### Mesures Implémentées
- **HTTPS** obligatoire (TLS 1.3)
- **CORS** configuré
- **Rate Limiting** par IP
- **Sanitization** des entrées
- **RGPD** conforme

### Headers de Sécurité
```http
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
```

---

## 🚀 Déploiement

### Netlify (Production)
```bash
# Déploiement automatique via CI/CD
git push main

# Déploiement manuel
pnpm deploy:prod
```

### Configuration Netlify
```toml
[build]
  command = "pnpm build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

---

## 📈 Performance

### Optimisations
- **Images** : WebP/AVIF, lazy loading
- **CSS/JS** : Minifiés, compressés
- **Cache** : Edge caching activé
- **CDN** : Netlify Edge global

### Core Web Vitals Cibles
- **LCP** : <2.5s
- **CLS** : <0.1
- **FID** : <100ms
- **INP** : <200ms

---

## 🔧 Maintenance

### Tâches Mensuelles
1. **Mise à jour** des dépendances
2. **Optimisation** des prompts AI
3. **Analyse** des performances
4. **Sauvegarde** des données

### Monitoring Continu
- Dashboard temps réel
- Alertes automatiques
- Rapports de performance
- Analyse des coûts

---

## 🆘 Support

### Documentation
- [Guide d'installation](./docs/guides/installation.md)
- [Référence API](./docs/api/README.md)
- [Architecture](./docs/architecture/README.md)
- [Dépannage](./docs/guides/troubleshooting.md)

### Contact
- **Support technique** : tech@ecofundrive.com
- **Documentation** : docs@ecofundrive.com
- **Issues GitHub** : [Repository Issues](https://github.com/votre-org/ecofundrive-v3/issues)

---

## 📝 Changelog

### v3.0.0 (2025-11-10)
- ✨ Nouvelle architecture par prompts divisés
- ⚡ Performance +40% plus rapide
- 💰 Coûts -40% réduits
- 🛡️ Fiabilité +30% améliorée
- 🎯 Score SEO initial 85/100

---

**ECOFUNDRIVE V3** - Générateur SEO de nouvelle génération
