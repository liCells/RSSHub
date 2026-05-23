import { describe, expect, it } from 'vitest';
import { parsePost, parseSitemap } from '@/routes/4think/utils';

describe('4think utils', () => {
    it('parses and sorts sitemap posts by lastmod descending', () => {
        const posts = parseSitemap(
            `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                    <loc>https://4think.blog/older-post/</loc>
                    <lastmod>2026-04-01T00:00:00.000Z</lastmod>
                </url>
                <url>
                    <loc>https://4think.blog/newer-post/</loc>
                    <lastmod>2026-05-01T00:00:00.000Z</lastmod>
                </url>
            </urlset>`,
            'https://4think.blog'
        );

        expect(posts).toEqual([
            {
                loc: 'https://4think.blog/newer-post/',
                lastmod: '2026-05-01T00:00:00.000Z',
            },
            {
                loc: 'https://4think.blog/older-post/',
                lastmod: '2026-04-01T00:00:00.000Z',
            },
        ]);
    });

    it('parses article metadata and body from post html', () => {
        const post = parsePost(
            `<!DOCTYPE html>
            <html>
                <head>
                    <meta property="og:title" content="無痛更新 | 深度解讀《逆思維》">
                    <meta property="article:published_time" content="2026-05-18T23:00:38.000Z">
                    <meta name="twitter:data1" content="Roxas 楊大輝">
                </head>
                <body>
                    <article class="gh-article">
                        <section class="gh-content">
                            <p>正文段落</p>
                        </section>
                    </article>
                </body>
            </html>`,
            'https://4think.blog/read-a-book-plus-003/'
        );

        expect(post).toEqual({
            title: '無痛更新 | 深度解讀《逆思維》',
            description: '<p>正文段落</p>',
            pubDate: '2026-05-18T23:00:38.000Z',
            link: 'https://4think.blog/read-a-book-plus-003/',
            author: 'Roxas 楊大輝',
        });
    });
});
