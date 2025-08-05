import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import { load } from 'cheerio';

export const route: Route = {
    path: '/articles',
    categories: ['blog'],
    example: '/articles',
    name: '宝玉的分享',
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
    const rootUrl = 'https://baoyu.io/';
    const simpleRssUrl = 'https://s.baoyu.io/feed.xml';

    const response = await ofetch(simpleRssUrl, { parseResponse: (txt) => txt });
    const $ = load(response, { xmlMode: true });

    const posts: any[] = [];

    $('item').each((index, element) => {
        const title = $(element).find('title').text();
        const link = $(element).find('link').text();
        const description = $(element).find('description').text();
        const guid = $(element).find('guid').text();
        const pubDate = $(element).find('pubDate').text();
        const author = $(element).find('author').text();

        const post = {
            title,
            link,
            description,
            guid,
            pubDate,
            author,
        };

        posts.push(post);
    });

    const items = await Promise.all(
        posts.map(async (post) => {
            const link = post.link;
            const detailResponse = await ofetch(link, { parseResponse: (txt) => txt });
            const content = load(detailResponse);

            const title = post.title;
            const description = content('div.prose').html();
            const pubDate = post.pubDate;
            const author = post.author;

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
        title: '宝玉的分享',
        link: rootUrl,
        description: '宝玉的分享',
        item: items,
    };
}
