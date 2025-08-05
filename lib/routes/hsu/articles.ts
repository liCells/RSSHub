import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import { load } from 'cheerio';

export const route: Route = {
    path: '/articles',
    categories: ['blog'],
    example: '/articles',
    name: 'neverland - Chenyang “Platy” Hsu Blog',
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
    const rootUrl = 'https://hsu.cy/';
    const simpleRssUrl = `${rootUrl}/feed.xml`;

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

            const title = content('h1.post-title').text();
            const description = content('section.body').html();
            const pubDate = content('div.meta.date').html();
            const author = 'Chenyang “Platy” Hsu';

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
        title: 'neverland - Chenyang “Platy” Hsu',
        link: rootUrl,
        description: 'Chenyang “Platy” Hsu Blog RSS',
        item: items,
    };
}
