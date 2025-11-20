import 'dotenv/config';
import { generateKeywordIdeas, type KeywordSeed, type KeywordIdea } from '../src/v1-generator/keywords';
import { vtcBaseKeywordIdeas } from '../src/v1-generator/keywords-vtc';

async function main() {
  const activityFromCli = process.argv.slice(2).join(' ').trim();

  const seed: KeywordSeed = {
    activity:
      activityFromCli ||
      "Activité de VTC / chauffeur privé sur l'ensemble de la Côte d'Azur (Nice, Cannes, Monaco, transferts aéroport, tourisme, business, événements)",
    location: 'Côte d\'Azur (Nice, Cannes, Monaco)',
    language: 'fr',
    maxIdeas: 60,
  };

  console.log('🔎 V1 keyword generation seed:', seed);

  try {
    const ideas = await generateKeywordIdeas(seed);

    const normalize = (value: string): string =>
      value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const existingSet = new Set<string>(
      vtcBaseKeywordIdeas.map((idea: KeywordIdea) => normalize(idea.keyword)),
    );

    const newIdeas = ideas.filter((idea) => {
      const n = normalize(idea.keyword);
      return n && !existingSet.has(n);
    });

    console.log(`\nBase existante: ${vtcBaseKeywordIdeas.length} mots-clés.`);
    console.log(`Nouvelles idées (hors doublons): ${newIdeas.length}.\n`);

    newIdeas.forEach((idea, index) => {
      const idx = String(index + 1).padStart(2, '0');
      const notes = idea.notes ? ` - ${idea.notes}` : '';
      console.log(`${idx}. [${idea.intent}] ${idea.keyword}${notes}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors de la génération des mots-clés V1:', error);
    process.exit(1);
  }
}

main();
