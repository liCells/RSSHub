import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import { load } from 'cheerio';

export const route: Route = {
    path: '/articles',
    categories: ['blog'],
    example: '/articles',
    name: 'Owlswims Blog',
    maintainers: ['lizz'],
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    handler,
};

async function handler() {
    const rootUrl = 'https://owlswims.com';
    const sitemapUrl = `${rootUrl}/post-sitemap.xml`;

    const response = await ofetch(sitemapUrl, { parseResponse: (txt) => txt });
    const $ = load(response, { xmlMode: true });

    const posts = $('url')
        .toArray()
        .map((url) => {
            const loc = $(url).find('loc').text();
            const lastmod = $(url).find('lastmod').text();
            return { loc, lastmod };
        })
        // Filter out URLs that exactly match the root URL
        .filter((post) => post.loc !== rootUrl && post.loc !== `${rootUrl}/`);

    // 按 lastmod 降序排序
    posts.sort((a, b) => new Date(b.lastmod) - new Date(a.lastmod));

    const items = await Promise.all(
        posts.map(async (post) => {
            const link = post.loc;
            const detailResponse = await ofetch(link, { parseResponse: (txt) => txt });
            const content = load(detailResponse);

            const title = content('h1.post_title').text();
            const description = content('article.post_body').html();
            const pubDate = content('span.post_date').text();
            const author = content('span.index_author').text();

            return {
                title,
                description,
                pubDate,
                link,
                author,
            };
        })
    );

    return {
        title: 'Owlswims Blog',
        link: rootUrl,
        description: 'Owlswims Blog RSS',
        item: items,
    };
}
