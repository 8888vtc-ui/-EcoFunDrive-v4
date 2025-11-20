import { runV1Generator, type V1GeneratorInput } from '../src/v1-generator';

async function main() {
  const keywordFromCli = process.argv[2];

  const input: V1GeneratorInput = {
    keyword: keywordFromCli || 'creation site vitrine',
    language: 'fr',
    category: 'transactional',
    location: 'France',
    authority: false,
    mode: 'standard',
    wordcount: 2200,
  };

  console.log('🔎 V1 dry-run with input:', input);

  try {
    const result = await runV1Generator(input);

    console.log('✅ Generation OK');
    console.log('SEO score:', result.seo.score, 'grade:', result.seo.grade);
    console.log('Issues (top 5):');
    result.seo.issues.slice(0, 5).forEach((issue: any, index: number) => {
      console.log(
        `#${index + 1} [${issue.severity}] ${issue.type} - ${issue.message}`,
      );
    });
  } catch (error) {
    console.error('❌ Error during V1 dry-run:', error);
    process.exit(1);
  }
}

main();
