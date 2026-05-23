import { load } from 'cheerio';

type SitemapPost = {
    loc: string;
    lastmod: string;
};

export const parseSitemap = (xml: string, rootUrl: string): SitemapPost[] => {
    const $ = load(xml, { xmlMode: true });

    return $('url')
        .toArray()
        .map((url) => ({
            loc: $(url).find('loc').text(),
            lastmod: $(url).find('lastmod').text(),
        }))
        .filter((post) => post.loc && post.loc !== rootUrl && post.loc !== `${rootUrl}/`)
        .sort((a, b) => +new Date(b.lastmod) - +new Date(a.lastmod));
};

export const parsePost = (html: string, link: string) => {
    const $ = load(html);

    return {
        title: $('meta[property="og:title"]').attr('content') ?? $('h1.single-title').text().trim() ?? $('h1.gh-article-title').text().trim(),
        description: $('div.single-content.gh-content.gh-canvas').html() ?? $('div.single-content.gh-content').html() ?? $('section.gh-content').html() ?? '',
        pubDate: $('meta[property="article:published_time"]').attr('content'),
        link,
        author: $('meta[name="twitter:data1"]').attr('content') ?? $('a.gh-author-name').first().text().trim(),
    };
};
