import { Buffer } from 'node:buffer';
import type { KeywordIdea } from './keywords';

export interface KeywordWithMetrics extends KeywordIdea {
  volume: number | null;
  competition: number | null;
  cpc: number | null;
  seoScore: number | null;
}

interface DataForSeoAuth {
  login: string;
  password: string;
}

function getDataForSeoAuth(): DataForSeoAuth {
  const login = process.env.DATAFORSEO_API_LOGIN || '';
  const password = process.env.DATAFORSEO_API_PASSWORD || '';

  if (!login || !password) {
    throw new Error('DATAFORSEO_API_LOGIN et DATAFORSEO_API_PASSWORD doivent être définis dans le fichier .env');
  }

  return { login, password };
}

function normalizeForMap(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

interface KeywordMetricsRaw {
  keyword: string;
  searchVolume: number | null;
  competition: number | null;
  cpc: number | null;
}

async function fetchBatchMetrics(
  keywords: string[],
  languageCode: string,
  locationName: string,
): Promise<Map<string, KeywordMetricsRaw>> {
  if (!keywords.length) {
    return new Map();
  }

  const { login, password } = getDataForSeoAuth();

  const auth = Buffer.from(`${login}:${password}`).toString('base64');

  const body = [
    {
      keywords,
      language_code: languageCode,
      location_name: locationName,
    },
  ];

  const response = await fetch('https://api.dataforseo.com/v3/keywords_data/google/search_volume/live', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`DataForSEO error ${response.status}: ${text}`);
  }

  const json: any = await response.json();

  const map = new Map<string, KeywordMetricsRaw>();

  const tasks = Array.isArray(json?.tasks) ? json.tasks : [];

  for (const task of tasks) {
    const results = Array.isArray(task?.result) ? task.result : [];
    for (const result of results) {
      const pushItem = (item: any) => {
        const kw: string | undefined = item?.keyword || item?.keyword_info?.keyword;
        if (!kw || typeof kw !== 'string') return;

        const searchVolume: number | null =
          typeof item?.search_volume === 'number'
            ? item.search_volume
            : typeof item?.keyword_info?.search_volume === 'number'
            ? item.keyword_info.search_volume
            : null;

        let competitionRaw: number | null = null;
        if (typeof item?.competition === 'number') {
          competitionRaw = item.competition;
        } else if (typeof item?.competition_index === 'number') {
          competitionRaw = item.competition_index;
        } else if (typeof item?.keyword_info?.competition === 'number') {
          competitionRaw = item.keyword_info.competition;
        }

        const cpc: number | null =
          typeof item?.cpc === 'number'
            ? item.cpc
            : typeof item?.keyword_info?.cpc === 'number'
            ? item.keyword_info.cpc
            : null;

        map.set(normalizeForMap(kw), {
          keyword: kw,
          searchVolume,
          competition: competitionRaw,
          cpc,
        });
      };

      // Cas 1 : certains endpoints renvoient result.items[]
      const items = Array.isArray(result?.items) ? result.items : null;
      if (items && items.length) {
        for (const item of items) {
          pushItem(item);
        }
      } else {
        // Cas 2 : pour google/search_volume/live, chaque élément de result est déjà un item
        pushItem(result);
      }
    }
  }

  return map;
}

function computeSeoScore(volume: number | null, competition: number | null, maxVolume: number): number | null {
  if (!volume || volume <= 0 || !maxVolume || maxVolume <= 0) {
    return null;
  }

  const volumeNorm = volume / maxVolume;

  let compNorm: number;
  if (competition == null || competition < 0) {
    compNorm = 0.5;
  } else if (competition > 1 && competition <= 100) {
    compNorm = competition / 100;
  } else {
    compNorm = Math.max(0, Math.min(1, competition));
  }

  const denom = 0.3 + compNorm;
  return volumeNorm / denom;
}

export async function enrichKeywordsWithSeoMetrics(
  ideas: KeywordIdea[],
  languageCode: string,
  locationName: string,
): Promise<KeywordWithMetrics[]> {
  if (!ideas.length) {
    return [];
  }

  const batchSize = 80;
  const allKeywords = ideas.map((idea) => idea.keyword);
  const rawMetricsMaps: Map<string, KeywordMetricsRaw>[] = [];

  for (let i = 0; i < allKeywords.length; i += batchSize) {
    const slice = allKeywords.slice(i, i + batchSize);
    const map = await fetchBatchMetrics(slice, languageCode, locationName);
    rawMetricsMaps.push(map);
  }

  const merged = new Map<string, KeywordMetricsRaw>();
  for (const map of rawMetricsMaps) {
    for (const [key, value] of map.entries()) {
      merged.set(key, value);
    }
  }

  const volumes: number[] = [];
  for (const metrics of merged.values()) {
    if (metrics.searchVolume && metrics.searchVolume > 0) {
      volumes.push(metrics.searchVolume);
    }
  }

  const maxVolume = volumes.length ? Math.max(...volumes) : 0;

  const enriched: KeywordWithMetrics[] = ideas.map((idea) => {
    const key = normalizeForMap(idea.keyword);
    const metrics = merged.get(key);

    const volume = metrics?.searchVolume ?? null;
    const competition = metrics?.competition ?? null;
    const cpc = metrics?.cpc ?? null;
    const seoScore = computeSeoScore(volume, competition, maxVolume);

    return {
      ...idea,
      volume,
      competition,
      cpc,
      seoScore,
    };
  });

  return enriched;
}
