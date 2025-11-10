#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - CONFIGURATION NETLIFY API
// Gestion authentification et déploiement automatique
// ═══════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const https = require('https');

class NetlifyAPIManager {
  constructor() {
    this.config = {
      // Récupérer depuis variables d'environnement ou fichier config
      accessToken: process.env.NETLIFY_ACCESS_TOKEN,
      siteId: process.env.NETLIFY_SITE_ID,
      apiBaseUrl: 'https://api.netlify.com/api/v1',
      deployTimeout: 300000 // 5 minutes
    };
    
    this.configFile = './netlify-config.json';
    this.loadConfig();
  }

  // Charger la configuration depuis fichier ou variables d'environnement
  loadConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        const fileConfig = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        this.config = { ...this.config, ...fileConfig };
        console.log('✅ Configuration Netlify chargée depuis fichier');
      } else {
        console.log('ℹ️ Configuration depuis variables d\'environnement');
      }
    } catch (error) {
      console.warn('⚠️ Erreur chargement configuration:', error.message);
    }
  }

  // Sauvegarder la configuration
  saveConfig() {
    try {
      fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2), 'utf8');
      console.log('✅ Configuration Netlify sauvegardée');
    } catch (error) {
      console.error('❌ Erreur sauvegarde configuration:', error);
    }
  }

  // Vérifier la configuration
  validateConfig() {
    const errors = [];
    
    if (!this.config.accessToken) {
      errors.push('NETLIFY_ACCESS_TOKEN manquant');
    }
    
    if (!this.config.siteId) {
      errors.push('NETLIFY_SITE_ID manquant');
    }
    
    if (errors.length > 0) {
      console.error('❌ Configuration invalide:');
      errors.forEach(error => console.error(`  - ${error}`));
      return false;
    }
    
    console.log('✅ Configuration Netlify valide');
    return true;
  }

  // Créer un déploiement Netlify
  async createDeployment(files, deployMessage = 'Mise à jour incrémentale articles VTC') {
    if (!this.validateConfig()) {
      throw new Error('Configuration Netlify invalide');
    }

    console.log('🚀 Création déploiement Netlify...');
    
    try {
      // 1. Créer le déploiement
      const deployData = {
        files: files,
        draft: false,
        title: deployMessage
      };

      const deployResponse = await this.makeAPIRequest('/sites/' + this.config.siteId + '/deploys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.config.accessToken
        },
        body: JSON.stringify(deployData)
      });

      const deployment = JSON.parse(deployResponse);
      console.log(`✅ Déploiement créé: ${deployment.id}`);

      // 2. Uploader les fichiers
      console.log('📤 Upload fichiers...');
      await this.uploadDeploymentFiles(deployment.id, files);

      // 3. Attendre la fin du déploiement
      console.log('⏳ Attente fin déploiement...');
      const finalDeployment = await this.waitForDeployment(deployment.id);

      console.log(`🎉 Déploiement terminé: ${finalDeployment.ssl_url}`);
      return finalDeployment;

    } catch (error) {
      console.error('❌ Erreur déploiement Netlify:', error);
      throw error;
    }
  }

  // Uploader les fichiers du déploiement
  async uploadDeploymentFiles(deployId, files) {
    for (const [filePath, fileContent] of Object.entries(files)) {
      try {
        await this.uploadFile(deployId, filePath, fileContent);
        console.log(`  ✅ Upload: ${filePath}`);
      } catch (error) {
        console.error(`  ❌ Erreur upload ${filePath}:`, error);
        throw error;
      }
    }
  }

  // Uploader un fichier individuel
  async uploadFile(deployId, filePath, content) {
    const url = `/deploys/${deployId}/files${filePath}`;
    
    await this.makeAPIRequest(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': 'Bearer ' + this.config.accessToken
      },
      body: content
    });
  }

  // Attendre la fin d'un déploiement
  async waitForDeployment(deployId, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await this.makeAPIRequest('/deploys/' + deployId, {
          headers: {
            'Authorization': 'Bearer ' + this.config.accessToken
          }
        });

        const deployment = JSON.parse(response);
        
        if (deployment.state === 'ready') {
          return deployment;
        } else if (deployment.state === 'error') {
          throw new Error('Déploiement échoué: ' + (deployment.error_message || 'Erreur inconnue'));
        }

        console.log(`  ⏳ Déploiement en cours... (${i + 1}/${maxAttempts})`);
        await this.sleep(5000); // Attendre 5 secondes

      } catch (error) {
        console.error(`  ❌ Erreur vérification déploiement:`, error);
        throw error;
      }
    }

    throw new Error('Timeout déploiement Netlify');
  }

  // Faire une requête API générique
  async makeAPIRequest(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      const url = this.config.apiBaseUrl + endpoint;
      
      const requestOptions = {
        hostname: 'api.netlify.com',
        path: endpoint,
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'ECOFUNDRIVE-SEO-Updater/1.0',
          ...options.headers
        }
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`API Error: ${res.statusCode} ${res.statusMessage} - ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (options.body) {
        req.write(options.body);
      }

      req.setTimeout(this.config.deployTimeout);
      req.end();
    });
  }

  // Préparer les fichiers pour déploiement
  prepareFilesForDeployment(updatedFiles) {
    const files = {};
    
    updatedFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        const relativePath = filePath.replace('./public', '');
        const content = fs.readFileSync(filePath, 'utf8');
        files[relativePath] = content;
      }
    });

    return files;
  }

  // Obtenir les informations du site
  async getSiteInfo() {
    try {
      const response = await this.makeAPIRequest('/sites/' + this.config.siteId, {
        headers: {
          'Authorization': 'Bearer ' + this.config.accessToken
        }
      });

      return JSON.parse(response);
    } catch (error) {
      console.error('❌ Erreur récupération infos site:', error);
      throw error;
    }
  }

  // Lister les déploiements récents
  async getRecentDeployments(limit = 10) {
    try {
      const response = await this.makeAPIRequest('/sites/' + this.config.siteId + '/deploys?per_page=' + limit, {
        headers: {
          'Authorization': 'Bearer ' + this.config.accessToken
        }
      });

      return JSON.parse(response);
    } catch (error) {
      console.error('❌ Erreur récupération déploiements:', error);
      throw error;
    }
  }

  // Utilitaire: pause
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Afficher l'aide
  showHelp() {
    console.log(`
🚀 NETLIFY API MANAGER - ECOFUNDRIVE V3

Configuration requise:
1. NETLIFY_ACCESS_TOKEN: Token d'accès Netlify
2. NETLIFY_SITE_ID: ID du site Netlify

Variables d'environnement:
export NETLIFY_ACCESS_TOKEN="your-token-here"
export NETLIFY_SITE_ID="your-site-id-here"

Ou créer fichier netlify-config.json:
{
  "accessToken": "your-token-here",
  "siteId": "your-site-id-here"
}

Usage:
node netlify-api-manager.js --check     # Vérifier configuration
node netlify-api-manager.js --info      # Infos site
node netlify-api-manager.js --deploys   # Déploiements récents
`);
  }
}

// Exécution du script
async function main() {
  const apiManager = new NetlifyAPIManager();
  
  const command = process.argv[2];
  
  switch (command) {
    case '--check':
      apiManager.validateConfig();
      break;
      
    case '--info':
      if (apiManager.validateConfig()) {
        try {
          const siteInfo = await apiManager.getSiteInfo();
          console.log('📊 Informations site Netlify:');
          console.log(`  Nom: ${siteInfo.name}`);
          console.log(`  URL: ${siteInfo.ssl_url}`);
          console.log(`  État: ${siteInfo.state}`);
          console.log(`  Créé: ${new Date(siteInfo.created_at).toLocaleString()}`);
        } catch (error) {
          console.error('❌ Erreur récupération infos:', error);
        }
      }
      break;
      
    case '--deploys':
      if (apiManager.validateConfig()) {
        try {
          const deploys = await apiManager.getRecentDeployments();
          console.log('📋 Déploiements récents:');
          deploys.slice(0, 5).forEach(deploy => {
            console.log(`  ${deploy.created_at}: ${deploy.title} (${deploy.state})`);
          });
        } catch (error) {
          console.error('❌ Erreur récupération déploiements:', error);
        }
      }
      break;
      
    default:
      apiManager.showHelp();
      break;
  }
}

// Gestion des erreurs
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Lancer
if (require.main === module) {
  main();
}

module.exports = { NetlifyAPIManager };
