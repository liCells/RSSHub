import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import { parsePost, parseSitemap } from '@/routes/4think/utils';

export const route: Route = {
    path: '/articles',
    categories: ['blog'],
    example: '/articles',
    name: '4THINK 历史文章',
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
    const rootUrl = 'https://4think.blog';
    const sitemapUrl = `${rootUrl}/sitemap-posts.xml`;

    const sitemap = await ofetch(sitemapUrl, { parseResponse: (txt) => txt });
    const posts = parseSitemap(sitemap, rootUrl);

    const items = await Promise.all(
        posts.map(async ({ loc }) => {
            const detail = await ofetch(loc, { parseResponse: (txt) => txt });
            return parsePost(detail, loc);
        })
    );

    return {
        title: '4THINK | 為自主思考而閲讀',
        link: rootUrl,
        description: '4THINK 历史文章',
        item: items,
    };
}
