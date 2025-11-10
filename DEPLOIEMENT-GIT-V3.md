# 🚀 Guide de Déploiement Git - ECOFUNDRIVE V3

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :
- Node.js 20.x installé
- pnpm 8.x installé
- Un compte GitHub
- Un compte Netlify
- Les clés API nécessaires

---

## 🔧 Étape 1: Configuration Locale

### 1.1 Cloner ou Initialiser
```bash
# Si vous partez de zéro
git clone https://github.com/votre-org/ecofundrive-v3.git
cd ecofundrive-v3

# Si vous utilisez le projet existant
cd D:\econfundrive
```

### 1.2 Installer les Dépendances
```bash
# Installer pnpm si nécessaire
npm install -g pnpm

# Installer les dépendances du projet
pnpm install
```

### 1.3 Configurer l'Environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Éditer avec vos clés API
notepad .env.local
```

Variables requises dans `.env.local` :
```env
CLAUDE_API_KEY=sk-ant-votre_cle_claude
OPENAI_API_KEY=sk-votre_cle_openai
REPLICATE_API_KEY=r8_votre_cle_replicate
NETLIFY_TOKEN=nfp_votre_token_netlify
NETLIFY_SITE_ID=votre_site_id
SITE_URL=https://votresite.com
```

---

## 🌐 Étape 2: Configuration GitHub

### 2.1 Créer le Repository
1. Allez sur [GitHub](https://github.com)
2. Créez un nouveau repository : `ecofundrive-v3`
3. Ne cochez pas "Add README" (nous en avons déjà un)

### 2.2 Configurer le Remote
```bash
git remote add origin https://github.com/votre-org/ecofundrive-v3.git
git branch -M main
```

### 2.3 Push Initial
```bash
git add .
git commit -m "🚀 Initial commit - ECOFUNDRIVE V3"
git push -u origin main
```

### 2.4 Configurer les Secrets GitHub
Dans GitHub > Settings > Secrets and variables > Actions :

```bash
# Secrets requis
NETLIFY_AUTH_TOKEN=nfp_votre_token_netlify
NETLIFY_SITE_ID=votre_site_id
SITE_URL=https://votresite.com
SLACK_WEBHOOK_URL=votre_webhook_slack
CLAUDE_API_KEY=sk-ant-votre_cle_claude
OPENAI_API_KEY=sk-votre_cle_openai
REPLICATE_API_KEY=r8_votre_cle_replicate
```

---

## 🚀 Étape 3: Configuration Netlify

### 3.1 Créer le Site Netlify
1. Connectez-vous à [Netlify](https://netlify.com)
2. Cliquez sur "Add new site" > "Import an existing project"
3. Connectez votre repository GitHub

### 3.2 Configuration Build
```
Build command: pnpm build
Publish directory: dist
Functions directory: netlify/functions
```

### 3.3 Variables d'Environnement Netlify
Dans Site settings > Environment variables :
```env
NODE_VERSION=20
CLAUDE_API_KEY=sk-ant-votre_cle_claude
OPENAI_API_KEY=sk-votre_cle_openai
REPLICATE_API_KEY=r8_votre_cle_replicate
SITE_URL=https://votresite.com
DEFAULT_LOCALE=fr
SUPPORTED_LOCALES=fr,en,he
```

---

## 🔄 Étape 4: Workflow de Déploiement

### 4.1 Branches
- `main` : Production
- `develop` : Développement
- `feature/*` : Nouvelles fonctionnalités

### 4.2 Déploiement Automatique
Le CI/CD s'active automatiquement sur :
- Push sur `main` → Déploiement production
- Pull Request → Déploiement preview
- Push sur `develop` → Déploiement staging

### 4.3 Déploiement Manuel
```bash
# Déploiement staging
pnpm deploy:staging

# Déploiement production
pnpm deploy:prod
```

---

## 🧪 Étape 5: Tests et Validation

### 5.1 Tests Locaux
```bash
# Tous les tests
pnpm test

# Tests unitaires
pnpm test:unit

# Tests d'intégration
pnpm test:integration

# Tests E2E
pnpm test:e2e
```

### 5.2 Validation SEO
```bash
# Valider une page
pnpm seo:validate

# Audit Lighthouse
pnpm lighthouse
```

### 5.3 Tests en Production
```bash
# Health check
curl https://votresite.com/health

# Validation SEO API
curl -X POST https://votresite.com/api/validate-seo \
  -H "Content-Type: application/json" \
  -d '{"url": "https://votresite.com"}'
```

---

## 📊 Étape 6: Monitoring

### 6.1 Dashboard Netlify
- Visitez `app.netlify.com/sites/votre-site/overview`
- Surveillez les déploiements
- Vérifiez les fonctions serverless

### 6.2 Alerts Slack
Configurez les notifications dans `.github/workflows/deploy.yml`

### 6.3 Analytics
- Google Tag Manager : configuré via `GTM_ID`
- Plausible Analytics : configuré via `PLAUSIBLE_DOMAIN`

---

## 🔧 Étape 7: Maintenance

### 7.1 Mises à Jour
```bash
# Mettre à jour les dépendances
pnpm update

# Vérifier les vulnérabilités
pnpm audit:security
```

### 7.2 Backup
```bash
# Exporter la configuration
netlify sites:list

# Backup du contenu généré
tar -czf backup-$(date +%Y%m%d).tar.gz src/content/generated/
```

### 7.3 Performance
```bash
# Audit mensuel
pnpm audit:performance

# Optimisation des images
pnpm optimize:images
```

---

## 🚨 Dépannage

### Problèmes Communs

#### Erreur de Build
```bash
# Vider le cache
pnpm cache:clear
pnpm clean
pnpm install
pnpm build
```

#### Erreur API
1. Vérifiez les clés API dans `.env.local`
2. Vérifiez les secrets GitHub
3. Vérifiez les variables Netlify

#### Déploiement Échoué
```bash
# Vérifier les logs Netlify
netlify status

# Redéploiement forcé
netlify deploy --prod --dir=dist
```

#### Performance Faible
```bash
# Audit Lighthouse
pnpm lighthouse:ci

# Optimisation
pnpm optimize:all
```

---

## 📞 Support

### Documentation
- [README Technique](./README-TECHNIQUE-V3.md)
- [Workflow SEO](./WORKFLOW-SEO.md)
- [Générateur SEO](./GENERATEUR-SEO-UNIVERSEL-V3.md)

### Contacts
- **Support technique** : tech@ecofundrive.com
- **Issues GitHub** : [Repository Issues](https://github.com/votre-org/ecofundrive-v3/issues)
- **Documentation** : docs@ecofundrive.com

### Ressources
- [Astro Documentation](https://docs.astro.build)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## ✅ Checklist de Déploiement

- [ ] Node.js 20.x installé
- [ ] pnpm configuré
- [ ] Repository GitHub créé
- [ ] Secrets GitHub configurés
- [ ] Site Netlify créé
- [ ] Variables d'environnement définies
- [ ] Tests locaux passants
- [ ] Premier déploiement réussi
- [ ] Monitoring configuré
- [ ] Documentation lue

---

**🎉 ECOFUNDRIVE V3 est maintenant déployé et opérationnel !**
