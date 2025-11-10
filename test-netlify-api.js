// ═══════════════════════════════════════════════════════════
// TEST API NETLIFY - VÉRIFICATION CONFIGURATION
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const https = require('https');

// Charger la configuration
const config = JSON.parse(fs.readFileSync('./netlify-config.json', 'utf8'));

console.log('🔍 TEST API NETLIFY - ECOFUNDRIVE');
console.log('======================================');
console.log(`🔑 Token: ${config.netlify.accessToken.substring(0, 10)}...`);
console.log(`🆔 Site ID: ${config.netlify.siteId}`);
console.log(`🌐 API: ${config.netlify.apiBaseUrl}`);
console.log('');

// Test de connexion à l'API Netlify
const testNetlifyAPI = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.netlify.com',
      port: 443,
      path: `/api/v1/sites/${config.netlify.siteId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.netlify.accessToken}`,
        'User-Agent': 'ECOFUNDRIVE-Generator/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          const siteInfo = JSON.parse(data);
          console.log('✅ CONNEXION NETLIFY RÉUSSIE !');
          console.log('================================');
          console.log(`📛 Nom du site: ${siteInfo.name}`);
          console.log(`🌐 URL: ${siteInfo.url}`);
          console.log(`📊 État: ${siteInfo.state}`);
          console.log(`🔧 SSL: ${siteInfo.ssl ? 'Activé' : 'Désactivé'}`);
          console.log(`📈 Créé le: ${new Date(siteInfo.created_at).toLocaleDateString()}`);
          console.log('');
          console.log('🎯 CONFIGURATION NETLIFY PRÊTE POUR DÉPLOIEMENT !');
          resolve(true);
        } else {
          console.log('❌ ERREUR CONNEXION NETLIFY');
          console.log('==========================');
          console.log(`📊 Status: ${res.statusCode}`);
          console.log(`📝 Message: ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('💥 ERREUR RÉSEAU');
      console.log('================');
      console.log(error.message);
      resolve(false);
    });

    req.end();
  });
};

// Exécuter le test
testNetlifyAPI().then(success => {
  if (success) {
    console.log('');
    console.log('🚀 PROCHAINES ÉTAPES:');
    console.log('====================');
    console.log('1. Installer Node.js');
    console.log('2. Lancer la génération du site');
    console.log('3. Déploiement automatique');
    console.log('');
    console.log('✅ VOTRE CONFIGURATION NETLIFY EST 100% FONCTIONNELLE !');
  } else {
    console.log('');
    console.log('🔧 ACTIONS REQUISES:');
    console.log('====================');
    console.log('1. Vérifiez votre token Netlify');
    console.log('2. Vérifiez votre Site ID');
    console.log('3. Réessayez le test');
  }
});
