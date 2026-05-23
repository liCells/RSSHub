import { describe, expect, it } from 'vitest';
import { parseFeed } from '@/routes/slat/utils';

describe('slat utils', () => {
    it('parses feed items and extracts schema text html from description', () => {
        const items = parseFeed(`<?xml version="1.0" encoding="utf-8" ?>
        <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
            <channel>
                <item>
                    <title>文章標題</title>
                    <link>http://slat.org/node/219</link>
                    <description>&lt;div property="schema:text"&gt;&lt;p&gt;文章內容&lt;/p&gt;&lt;/div&gt;</description>
                    <pubDate>Sun, 11 May 2025 03:19:08 +0000</pubDate>
                    <dc:creator>foolfitz</dc:creator>
                </item>
            </channel>
        </rss>`);

        expect(items).toEqual([
            {
                title: '文章標題',
                link: 'https://slat.org/node/219',
                description: '<p>文章內容</p>',
                pubDate: 'Sun, 11 May 2025 03:19:08 +0000',
                author: 'foolfitz',
            },
        ]);
    });
});
