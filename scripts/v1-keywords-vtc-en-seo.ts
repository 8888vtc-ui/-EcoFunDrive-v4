import 'dotenv/config';
import { generateKeywordIdeas, type KeywordSeed } from '../src/v1-generator/keywords';
import { enrichKeywordsWithSeoMetrics, type KeywordWithMetrics } from '../src/v1-generator/keyword-metrics';

async function main() {
  const seed: KeywordSeed = {
    activity:
      'Luxury private driver / VTC service on the French Riviera (Nice, Cannes, Monaco, Saint-Tropez, airport transfers, business trips, events)',
    location: "French Riviera (Nice, Cannes, Monaco)",
    language: 'en',
    maxIdeas: 80,
  };

  console.log('🔎 V1 EN keyword generation seed:', seed);

  try {
    const ideas = await generateKeywordIdeas(seed);

    console.log(`\n✅ ${ideas.length} EN keyword ideas generated (unique before SEO metrics).`);

    const languageCode = 'en';
    const locationName = 'France';

    console.log('\n🔎 Enriching EN keywords with SEO metrics via DataForSEO...');

    const enriched: KeywordWithMetrics[] = await enrichKeywordsWithSeoMetrics(
      ideas,
      languageCode,
      locationName,
    );

    const withScore = enriched.filter((k) => k.seoScore != null);
    const withoutScore = enriched.filter((k) => k.seoScore == null);

    withScore.sort((a, b) => (b.seoScore || 0) - (a.seoScore || 0));

    console.log('\n🏆 Top 20 EN keywords by SEO score (high volume / lower competition):\n');
    withScore.slice(0, 20).forEach((k, index) => {
      const idx = String(index + 1).padStart(2, '0');
      const volume = k.volume != null ? k.volume : '-';
      const competition = k.competition != null ? k.competition.toFixed(2) : '-';
      const score = k.seoScore != null ? k.seoScore.toFixed(3) : '-';
      console.log(
        `${idx}. ${k.keyword} | volume=${volume} | competition=${competition} | score=${score} | intent=${k.intent}`,
      );
    });

    if (withoutScore.length) {
      console.log(`\nℹ️ ${withoutScore.length} EN keywords without search volume data from the API.`);
    }
  } catch (error) {
    console.error('❌ Error during EN keyword SEO pipeline:', error);
    process.exit(1);
  }
}

main();
