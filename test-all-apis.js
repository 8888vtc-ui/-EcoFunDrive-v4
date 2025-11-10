// ═══════════════════════════════════════════════════════════
// TEST COMPLET DES APIS - ECOFUNDRIVE V3
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const https = require('https');

// Charger la configuration
const config = JSON.parse(fs.readFileSync('./netlify-config.json', 'utf8'));

console.log('🚀 TEST COMPLET DES APIS - ECOFUNDRIVE V3');
console.log('==========================================');

// Test OpenAI API
const testOpenAI = () => {
  return new Promise((resolve) => {
    console.log('🤖 Test OpenAI API...');
    
    const postData = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Test connexion ECOFUNDRIVE V3" }],
      max_tokens: 10
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.api.openai}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ OpenAI API - Connexion réussie');
          resolve(true);
        } else {
          console.log('❌ OpenAI API - Erreur:', res.statusCode);
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log('❌ OpenAI API - Erreur réseau');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
};

// Test Anthropic API
const testAnthropic = () => {
  return new Promise((resolve) => {
    console.log('🧠 Test Anthropic API...');
    
    const postData = JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 10,
      messages: [{ role: "user", content: "Test connexion ECOFUNDRIVE V3" }]
    });

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'x-api-key': config.api.anthropic,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Anthropic API - Connexion réussie');
          resolve(true);
        } else {
          console.log('❌ Anthropic API - Erreur:', res.statusCode);
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log('❌ Anthropic API - Erreur réseau');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
};

// Test Replicate API
const testReplicate = () => {
  return new Promise((resolve) => {
    console.log('🖼️ Test Replicate API...');
    
    const options = {
      hostname: 'api.replicate.com',
      port: 443,
      path: '/v1/models',
      method: 'GET',
      headers: {
        'Authorization': `Token ${config.api.replicate}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Replicate API - Connexion réussie');
          resolve(true);
        } else {
          console.log('❌ Replicate API - Erreur:', res.statusCode);
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log('❌ Replicate API - Erreur réseau');
      resolve(false);
    });

    req.end();
  });
};

// Test DataForSEO API
const testDataForSEO = () => {
  return new Promise((resolve) => {
    console.log('📊 Test DataForSEO API...');
    
    const postData = JSON.stringify({
      "target": "ecofundrive.com",
      "location_name": "France",
      "language": "fr"
    });

    const options = {
      hostname: 'api.dataforseo.com',
      port: 443,
      path: '/v3/serp/google/organic/live/advanced',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${config.api.dataforseo.login}:${config.api.dataforseo.password}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ DataForSEO API - Connexion réussie');
          resolve(true);
        } else {
          console.log('❌ DataForSEO API - Erreur:', res.statusCode);
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log('❌ DataForSEO API - Erreur réseau');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
};

// Test Netlify API
const testNetlify = () => {
  return new Promise((resolve) => {
    console.log('🚀 Test Netlify API...');
    
    const options = {
      hostname: 'api.netlify.com',
      port: 443,
      path: `/api/v1/sites/${config.netlify.siteId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.netlify.accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Netlify API - Connexion réussie');
          resolve(true);
        } else {
          console.log('❌ Netlify API - Erreur:', res.statusCode);
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log('❌ Netlify API - Erreur réseau');
      resolve(false);
    });

    req.end();
  });
};

// Exécuter tous les tests
async function runAllTests() {
  console.log('🔍 Démarrage tests des APIs...\n');
  
  const results = {
    openai: await testOpenAI(),
    anthropic: await testAnthropic(),
    replicate: await testReplicate(),
    dataforseo: await testDataForSEO(),
    netlify: await testNetlify()
  };
  
  console.log('\n📊 RÉSULTATS DES TESTS:');
  console.log('========================');
  
  Object.entries(results).forEach(([api, success]) => {
    const status = success ? '✅ ACTIF' : '❌ INACTIF';
    console.log(`${api.toUpperCase()}: ${status}`);
  });
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 BILAN: ${successCount}/${totalCount} APIs fonctionnelles`);
  
  if (successCount === totalCount) {
    console.log('\n🚀 TOUTES LES APIS SONT PRÊTES !');
    console.log('✅ Vous pouvez lancer la génération complète');
  } else {
    console.log('\n⚠️ Certaines APIs ne répondent pas');
    console.log('🔧 Vérifiez les clés ou la connexion');
  }
}

// Lancer les tests
runAllTests().catch(console.error);
