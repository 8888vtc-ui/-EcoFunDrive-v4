import { generatePageContent } from '../lib/claude';
import validateSEO, { type SEOResultType } from '../validators/seo';
import type { V1GeneratorInput } from './types';

type GeneratedPageContent = Awaited<ReturnType<typeof generatePageContent>>;

export interface V1GeneratorResult {
  input: V1GeneratorInput;
  content: GeneratedPageContent;
  html: string;
  seo: SEOResultType;
}

export async function runV1Generator(input: V1GeneratorInput): Promise<V1GeneratorResult> {
  const claudeInput = {
    id: 1,
    keyword: input.keyword,
    language: input.language,
    category: input.category,
    location: input.location,
    authority: input.authority,
    mode: input.mode,
    wordcount: input.wordcount,
  };

  const content = await generatePageContent(claudeInput);

  const html = renderContentToHtml(content);
  let seo: SEOResultType;
  try {
    seo = await validateSEO(html, input.keyword);
  } catch (error: any) {
    console.warn('⚠️ SEO validation failed, using fallback SEO result:', error?.message || error);

    const h2Count = content.sections?.length || 0;
    const h3Count = Array.isArray(content.sections)
      ? content.sections.reduce((sum, s) => sum + ((s as any).h3?.length || 0), 0)
      : 0;

    seo = {
      score: 0,
      grade: 'F',
      issues: [],
      metrics: {
        wordCount: content.wordcount || 0,
        keywordDensity: 0,
        readabilityScore: 0,
        titleLength: content.meta_title?.length || 0,
        metaDescriptionLength: content.meta_description?.length || 0,
        headingCount: {
          h1: 1,
          h2: h2Count,
          h3: h3Count,
        },
        imageCount: 0,
        internalLinks: content.internal_links?.length || 0,
        externalLinks: 0,
      },
      recommendations: [],
      passedChecks: [],
      failedChecks: [],
    };
  }

  return {
    input,
    content,
    html,
    seo,
  };
}

function renderContentToHtml(content: GeneratedPageContent): string {
  const escape = (value: string): string =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const sectionsHtml = content.sections
    .map(section => {
      const h3Html = (section.h3 || [])
        .map(sub => `<h3>${escape(sub.title)}</h3><p>${escape(sub.content)}</p>`)
        .join('\n');

      return `<section><h2>${escape(section.h2)}</h2><p>${escape(section.content)}</p>${h3Html}</section>`;
    })
    .join('\n');

  const faqHtml = content.faq
    .map(item => `<section><h2>${escape(item.question)}</h2><p>${escape(item.answer)}</p></section>`)
    .join('\n');

  const linksHtml = content.internal_links
    .map(link => `<li><a href="${escape(link.url)}">${escape(link.anchor)}</a></li>`)
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${escape(content.meta_title)}</title>
  <meta name="description" content="${escape(content.meta_description)}" />
</head>
<body>
  <main>
    <h1>${escape(content.title)}</h1>
    <section>
      <p>${escape(content.introduction)}</p>
    </section>
    ${sectionsHtml}
    <section>
      <h2>FAQ</h2>
      ${faqHtml}
    </section>
    <nav>
      <ul>
        ${linksHtml}
      </ul>
    </nav>
  </main>
</body>
</html>`;

  return html;
}
