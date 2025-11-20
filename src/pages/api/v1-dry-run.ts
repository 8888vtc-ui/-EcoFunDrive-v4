import type { APIRoute } from 'astro';
import { runV1Generator, type V1GeneratorInput } from '../../v1-generator';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const keyword = typeof body.keyword === 'string' ? body.keyword.trim() : '';
    const language = typeof body.language === 'string' ? body.language.trim() : 'fr';

    if (!keyword) {
      return new Response(
        JSON.stringify({ ok: false, error: 'MISSING_KEYWORD' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const input: V1GeneratorInput = {
      keyword,
      language,
      category: 'transactional',
      location: 'France',
      authority: false,
      mode: 'standard',
      wordcount: 2200,
    };

    const result = await runV1Generator(input);

    const payload = {
      ok: true,
      input: result.input,
      seo: {
        score: result.seo.score,
        grade: result.seo.grade,
        issues: result.seo.issues.slice(0, 10),
        metrics: result.seo.metrics ?? null,
      },
      contentMeta: {
        title: result.content.title,
        meta_title: result.content.meta_title,
        meta_description: result.content.meta_description,
        wordcount: result.content.wordcount,
      },
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Error in V1 dry-run API:', error);

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
