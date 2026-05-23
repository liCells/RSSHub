import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import { parseFeed } from '@/routes/slat/utils';

export const route: Route = {
    path: '/news',
    categories: ['other'],
    example: '/news',
    name: 'SLAT 最新消息',
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
    const rootUrl = 'https://slat.org';
    const feedUrl = `${rootUrl}/news/rss.xml`;
    const response = await ofetch(feedUrl, { parseResponse: (txt) => txt });
    const items = parseFeed(response);

    return {
        title: 'SLAT 中華民國軟體自由協會',
        link: rootUrl,
        description: 'SLAT - 最新消息',
        item: items,
    };
}
