import 'dotenv/config';
import { vtcBaseKeywordIdeas } from '../src/v1-generator/keywords-vtc';
import { enrichKeywordsWithSeoMetrics, type KeywordWithMetrics } from '../src/v1-generator/keyword-metrics';

async function main() {
  const languageCode = 'fr';
  const locationName = 'France';

  console.log(`🔎 Enrichissement SEO pour ${vtcBaseKeywordIdeas.length} mots-clés VTC (DataForSEO)...`);

  try {
    const enriched: KeywordWithMetrics[] = await enrichKeywordsWithSeoMetrics(
      vtcBaseKeywordIdeas,
      languageCode,
      locationName,
    );

    const withScore = enriched.filter((k) => k.seoScore != null);
    const withoutScore = enriched.filter((k) => k.seoScore == null);

    withScore.sort((a, b) => (b.seoScore || 0) - (a.seoScore || 0));

    console.log('\n🏆 Top 20 mots-clés par score SEO (volume élevé / concurrence plus faible):\n');
    withScore.slice(0, 20).forEach((k, index) => {
      const idx = String(index + 1).padStart(2, '0');
      const volume = k.volume != null ? k.volume : '-';
      const competition = k.competition != null ? k.competition.toFixed(2) : '-';
      const score = k.seoScore != null ? k.seoScore.toFixed(3) : '-';
      console.log(
        `${idx}. ${k.keyword} | volume=${volume} | concurrence=${competition} | score=${score} | intent=${k.intent}`,
      );
    });

    if (withoutScore.length) {
      console.log(`\nℹ️ ${withoutScore.length} mots-clés sans données de volume retournées par l'API.`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'appel DataForSEO:', error);
    process.exit(1);
  }
}

main();
