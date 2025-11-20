import Anthropic from '@anthropic-ai/sdk';

function getAnthropicApiKey(): string {
  const fromImportMeta = (import.meta as any)?.env?.ANTHROPIC_API_KEY as string | undefined;
  const fromProcess = process.env.ANTHROPIC_API_KEY;
  const apiKey = fromImportMeta || fromProcess;

  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Définis cette variable dans ton fichier .env ou dans les variables d\'environnement du système.',
    );
  }

  return apiKey;
}

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: getAnthropicApiKey(),
    });
  }

  return anthropicClient;
}

export interface KeywordSeed {
  activity: string;
  location?: string;
  language: string; // ex: 'fr', 'en'
  maxIdeas?: number;
}

export type KeywordIntent =
  | 'informational'
  | 'transactional'
  | 'local'
  | 'navigational'
  | 'other';

export interface KeywordIdea {
  keyword: string;
  intent: KeywordIntent;
  notes?: string;
}

interface ClaudeKeywordIdeasResponse {
  ideas: KeywordIdea[];
}

export async function generateKeywordIdeas(seed: KeywordSeed): Promise<KeywordIdea[]> {
  const { activity, location = '', language, maxIdeas = 20 } = seed;

  if (!activity || !language) {
    throw new Error('Missing required fields: activity and language');
  }

  const prompt = buildKeywordPrompt({ activity, location, language, maxIdeas });

  const response = await getAnthropicClient().messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1500,
    temperature: 0.5,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const first = response.content?.[0];
  const text = first && first.type === 'text' ? first.text : '';
  if (!text) {
    throw new Error('Empty response from Claude for keyword ideas');
  }

  const ideas = parseAndDeduplicateIdeas(text);
  return ideas;
}

function buildKeywordPrompt(params: {
  activity: string;
  location: string;
  language: string;
  maxIdeas: number;
}): string {
  const { activity, location, language, maxIdeas } = params;

  return `
Tu es un expert en recherche de mots-clés SEO.

OBJECTIF:
- Partir d'une description libre d'activité et proposer une liste d'idées de mots-clés UNIQUEMENT
  (pas de scoring, pas de volume, pas de difficulté) pour préparer la structure d'un site web.

CONTEXTE FOURNI PAR L'UTILISATEUR (DESCRIPTION BRUTE):
"""${activity}"""

SYNTHÈSE ATTENDUE AVANT DE PROPOSER LES MOTS-CLÉS:
- Déduis le secteur d'activité, les principaux services, les types de clients et les cas d'usage.
- Localisation principale: ${location || 'non précisée'}
- Langue de recherche: ${language}

COMPORTEMENT SELON LA LOCALISATION:
- Si une localisation claire est fournie (ville / région / pays), privilégie des requêtes locales:
  service + ville, service + région, transferts aéroport, gares, hôtels, etc.
- Si aucune localisation n'est fournie, génère des mots-clés plus généralistes (niveau national / en ligne).

CONTRAINTES:
- Propose entre 20 et ${maxIdeas} idées maximum.
- Varie les intentions:
  - informationnelles (questions, recherches d'infos),
  - transactionnelles (réservation, prix, devis),
  - locales (service + ville / région).
- Chaque mot-clé doit être une expression naturelle que taperait un utilisateur réel.
- Ne FOURNIS AUCUN score, volume, CPC, difficulté ou pourcentage.
- Évite les doublons et les variantes quasi identiques (camel case, pluriels évidents, accents).

FORMAT DE SORTIE STRICT (JSON UNIQUEMENT):
{
  "ideas": [
    {
      "keyword": "exemple de mot clé",
      "intent": "local | transactional | informational | other",
      "notes": "contexte ou précision facultative"
    }
  ]
}

IMPORTANT:
- Retourne UNIQUEMENT le JSON, sans texte avant ou après.
- Les mots-clés doivent être UNIQUES une fois normalisés (minuscules, accents supprimés, espaces normalisés).
`;
}

function parseAndDeduplicateIdeas(text: string): KeywordIdea[] {
  let jsonText = text.trim();

  let parsed: ClaudeKeywordIdeasResponse;
  try {
    // 1) Essayer d'extraire un bloc ```json ... ``` n'importe où dans le texte
    const fenceMatch = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)```/i);
    if (fenceMatch && fenceMatch[1]) {
      jsonText = fenceMatch[1].trim();
    }

    // 2) Tentative directe de parse
    try {
      parsed = JSON.parse(jsonText) as ClaudeKeywordIdeasResponse;
    } catch (innerError) {
      // 3) En dernier recours, on extrait du premier "{" au dernier "}" si possible
      const firstBrace = jsonText.indexOf('{');
      const lastBrace = jsonText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const candidate = jsonText.slice(firstBrace, lastBrace + 1);
        parsed = JSON.parse(candidate) as ClaudeKeywordIdeasResponse;
      } else {
        throw innerError;
      }
    }
  } catch (error) {
    console.warn('⚠️ Keyword ideas JSON invalid, using fallback extraction.', error);

    // Fallback: extraire tous les "keyword": "..." même si le JSON est imparfait
    const fallbackSeen = new Set<string>();
    const fallback: KeywordIdea[] = [];
    const keywordRegex = /"keyword"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    let match: RegExpExecArray | null;

    while ((match = keywordRegex.exec(jsonText)) !== null) {
      const raw = match[1].trim();
      if (!raw) continue;

      const normalized = raw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ');

      if (!normalized) continue;
      if (fallbackSeen.has(normalized)) continue;
      fallbackSeen.add(normalized);

      fallback.push({
        keyword: raw,
        intent: 'other',
      });
    }

    if (!fallback.length) {
      throw new Error('Invalid JSON returned for keyword ideas');
    }

    return fallback;
  }

  const rawIdeas = Array.isArray(parsed.ideas) ? parsed.ideas : [];

  const seen = new Set<string>();
  const deduped: KeywordIdea[] = [];

  for (const idea of rawIdeas) {
    if (!idea || !idea.keyword) continue;
    const raw = idea.keyword.trim();
    if (!raw) continue;

    const normalized = raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');

    if (!normalized) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);

    deduped.push({
      keyword: raw,
      intent: (idea.intent as KeywordIntent) || 'other',
      notes: idea.notes?.trim() || undefined,
    });
  }

  return deduped;
}
