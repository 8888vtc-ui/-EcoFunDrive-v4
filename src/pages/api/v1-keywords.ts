import type { APIRoute } from 'astro';
import { generateKeywordIdeas, type KeywordSeed } from '../../v1-generator/keywords';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));

    const activity = typeof body.activity === 'string' ? body.activity.trim() : '';
    const location = typeof body.location === 'string' ? body.location.trim() : '';
    const language = typeof body.language === 'string' ? body.language.trim() : 'fr';

    if (!activity) {
      return new Response(
        JSON.stringify({ ok: false, error: 'MISSING_ACTIVITY' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const seed: KeywordSeed = {
      activity,
      location,
      language,
      maxIdeas: 20,
    };

    const ideas = await generateKeywordIdeas(seed);

    return new Response(
      JSON.stringify({
        ok: true,
        seed,
        ideas,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    console.error('❌ Error in V1 keyword ideas API:', error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: 'INTERNAL_ERROR',
        message: error?.message || 'Unexpected error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
