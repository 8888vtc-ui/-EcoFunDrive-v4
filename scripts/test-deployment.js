#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - SCRIPT TEST DÉPLOIEMENT SEO
// Vérifie que tous les fichiers sont créés correctement
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

class SEODeploymentTester {
  constructor() {
    this.outputDir = './public';
    this.testResults = [];
  }

  testFileExists(filePath, description) {
    const fullPath = path.join(this.outputDir, filePath);
    const exists = fs.existsSync(fullPath);
    
    this.testResults.push({
      file: filePath,
      description,
      status: exists ? '✅ PASS' : '❌ FAIL',
      path: fullPath
    });
    
    return exists;
  }

  testFileContent(filePath, expectedContent, description) {
    const fullPath = path.join(this.outputDir, filePath);
    
    if (!fs.existsSync(fullPath)) {
      this.testResults.push({
        file: filePath,
        description,
        status: '❌ FAIL - File not found',
        path: fullPath
      });
      return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasExpectedContent = content.includes(expectedContent);
    
    this.testResults.push({
      file: filePath,
      description,
      status: hasExpectedContent ? '✅ PASS' : '❌ FAIL - Content mismatch',
      path: fullPath
    });
    
    return hasExpectedContent;
  }

  runAllTests() {
    console.log('🧪 TESTS DÉPLOIEMENT SEO ECOFUNDRIVE');
    console.log('===================================');
    
    let allPassed = true;
    
    // Test 1: Sitemap
    console.log('\n📋 Test 1: Sitemap.xml');
    allPassed &= this.testFileExists('sitemap.xml', 'Sitemap file exists');
    allPassed &= this.testFileContent('sitemap.xml', 'https://ecofundrive.com/', 'Sitemap contains ECOFUNDRIVE URLs');
    allPassed &= this.testFileContent('sitemap.xml', 'vtc-nice', 'Sitemap contains VTC Nice page');
    
    // Test 2: Robots.txt
    console.log('\n🤖 Test 2: Robots.txt');
    allPassed &= this.testFileExists('robots.txt', 'Robots.txt file exists');
    allPassed &= this.testFileContent('robots.txt', 'Sitemap: https://ecofundrive.com/sitemap.xml', 'Robots.txt references sitemap');
    allPassed &= this.testFileContent('robots.txt', 'User-agent: *', 'Robots.txt has user-agent rules');
    
    // Test 3: .htaccess
    console.log('\n⚡ Test 3: .htaccess');
    allPassed &= this.testFileExists('.htaccess', '.htaccess file exists');
    allPassed &= this.testFileContent('.htaccess', 'mod_deflate', '.htaccess has compression rules');
    allPassed &= this.testFileContent('.htaccess', 'ExpiresActive On', '.htaccess has caching rules');
    
    // Test 4: Analytics script
    console.log('\n📈 Test 4: Analytics script');
    allPassed &= this.testFileExists('scripts/analytics.js', 'Analytics script exists');
    allPassed &= this.testFileContent('scripts/analytics.js', 'gtag(', 'Analytics script has Google Analytics');
    allPassed &= this.testFileContent('scripts/analytics.js', 'trackWhatsAppClick', 'Analytics script has custom tracking');
    
    // Test 5: VTC Page
    console.log('\n📝 Test 5: VTC Page');
    allPassed &= this.testFileExists('pages/vtc-nice.html', 'VTC Nice page exists');
    allPassed &= this.testFileContent('pages/vtc-nice.html', 'ECOFUNDRIVE VTC Tesla', 'VTC page has correct title');
    allPassed &= this.testFileContent('pages/vtc-nice.html', 'facebook.com/fastcab.vtc', 'VTC page has Facebook review link');
    
    // Test 6: Report
    console.log('\n📊 Test 6: Deployment report');
    allPassed &= this.testFileExists('seo/deployment-report.json', 'Deployment report exists');
    
    return allPassed;
  }

  generateTestReport(allPassed) {
    console.log('\n📋 RAPPORT COMPLET DES TESTS');
    console.log('===========================');
    
    this.testResults.forEach(result => {
      console.log(`${result.status} ${result.file} - ${result.description}`);
    });
    
    console.log('\n🎯 RÉSUMÉ:');
    console.log('=========');
    
    const passed = this.testResults.filter(r => r.status.includes('PASS')).length;
    const total = this.testResults.length;
    
    console.log(`✅ Tests passés: ${passed}/${total}`);
    console.log(`❌ Tests échoués: ${total - passed}/${total}`);
    
    if (allPassed) {
      console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
      console.log('✅ Déploiement SEO prêt pour production');
      console.log('🌐 Site prêt: https://ecofundrive.com');
    } else {
      console.log('\n❌ CERTAINS TESTS ONT ÉCHOUÉ');
      console.log('🔧 Vérifiez les erreurs ci-dessus');
    }
    
    return allPassed;
  }

  showNextSteps() {
    console.log('\n🚀 PROCHAINES ÉTAPES:');
    console.log('======================');
    console.log('1. Copier les fichiers du dossier ./public vers votre serveur');
    console.log('2. Tester: https://ecofundrive.com/sitemap.xml');
    console.log('3. Tester: https://ecofundrive.com/robots.txt');
    console.log('4. Tester: https://ecofundrive.com/pages/vtc-nice.html');
    console.log('5. Soumettre sitemap à Google Search Console');
    console.log('6. Configurer Google Analytics avec votre ID');
    console.log('7. Monitorer les performances avec Google PageSpeed Insights');
  }
}

// Exécution des tests
async function main() {
  const tester = new SEODeploymentTester();
  
  try {
    const allPassed = tester.runAllTests();
    tester.generateTestReport(allPassed);
    tester.showNextSteps();
    
    process.exit(allPassed ? 0 : 1);
    
  } catch (error) {
    console.error('❌ ERREUR TESTS:', error);
    process.exit(1);
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

// Lancer les tests
if (require.main === module) {
  main();
}

module.exports = { SEODeploymentTester };
