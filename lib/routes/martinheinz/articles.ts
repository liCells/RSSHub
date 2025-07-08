import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import { load } from 'cheerio';

export const route: Route = {
    path: '/articles',
    categories: ['blog'],
    example: '/articles',
    name: 'Martin Heinz Blog',
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
    const rootUrl = 'https://martinheinz.dev';
    const simpleRssUrl = `${rootUrl}/rss`;

    const response = await ofetch(simpleRssUrl, { parseResponse: (txt) => txt });
    const $ = load(response, { xmlMode: true });

    const posts: any[] = [];

    $('item').each((index, element) => {
        const title = $(element).find('title').text();
        const link = $(element).find('link').text();
        const description = $(element).find('description').text();
        const guid = $(element).find('guid').text();
        const pubDate = $(element).find('pubDate').text();

        const post = {
            title,
            link,
            description,
            guid,
            pubDate,
        };

        posts.push(post);
    });

    const items = await Promise.all(
        posts.map(async (post) => {
            const link = post.link;
            const detailResponse = await ofetch(link, { parseResponse: (txt) => txt });
            const content = load(detailResponse);

            const title = content('h1.posttitle').text();
            const description = content('article').html();
            const pubDate = content('span.postdate').html();
            const author = content('span.author').text();

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
        title: 'Martin Heinz Blog',
        link: rootUrl,
        description: 'Martin Heinz Blog RSS',
        item: items,
    };
}
