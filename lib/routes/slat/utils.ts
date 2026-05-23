import { load } from 'cheerio';

export const parseFeed = (xml: string) => {
    const $ = load(xml, { xmlMode: true });

    return $('item')
        .toArray()
        .map((item) => {
            const title = $(item).find('title').first().text().trim();
            const link = $(item).find('link').first().text().trim().replace(/^http:\/\//, 'https://');
            const rawDescription = $(item).find('description').first().text();
            const content = load(rawDescription);
            const description = content('[property="schema:text"]').first().html() ?? rawDescription;
            const pubDate = $(item).find('pubDate').first().text().trim();
            const author = $(item).find('dc\\:creator, creator').first().text().trim();

            return {
                title,
                link,
                description,
                pubDate,
                author,
            };
        });
};
