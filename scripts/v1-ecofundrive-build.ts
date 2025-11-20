import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';

import { runV1Generator } from '../src/v1-generator';
import { vtcCoteAzurPagePlan } from '../src/v1-generator/vtc-pages-plan';

async function main() {
  const outDirArg = process.argv[2];
  const outDir = outDirArg
    ? path.resolve(outDirArg)
    : path.join(process.cwd(), '.out', 'v1-ecofundrive');

  console.log('🗂  V1 ECOFUNDRIVE build (dry-run)');
  console.log('📁 Output directory:', outDir);

  for (let i = 0; i < vtcCoteAzurPagePlan.length; i++) {
    const page = vtcCoteAzurPagePlan[i];
    const index = i + 1;

    console.log(`\n[${index}/${vtcCoteAzurPagePlan.length}] Generating ${page.language.toUpperCase()} - ${page.keyword}`);

    try {
      const result = await runV1Generator(page);

      const pageDir = path.join(outDir, page.slug);
      await fs.mkdir(pageDir, { recursive: true });

      const htmlPath = path.join(pageDir, 'index.html');
      const seoPath = path.join(pageDir, 'seo.json');
      const contentPath = path.join(pageDir, 'content.json');

      await fs.writeFile(htmlPath, result.html, 'utf8');
      await fs.writeFile(seoPath, JSON.stringify(result.seo, null, 2), 'utf8');
      await fs.writeFile(contentPath, JSON.stringify(result.content, null, 2), 'utf8');

      console.log('✅ OK ->', htmlPath);
    } catch (error: any) {
      console.error('❌ Error generating page for keyword:', page.keyword);
      console.error(error?.message || error);
    }
  }

  console.log('\n🏁 V1 ECOFUNDRIVE build completed (dry-run).');
}

main().catch(error => {
  console.error('❌ Fatal error in V1 ECOFUNDRIVE build script:', error);
  process.exit(1);
});
