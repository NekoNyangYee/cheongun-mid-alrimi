const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://cheongun-mid-alrimi.vercel.app/';

const pages = [
    ``,
    'schoolschedules',
    'timetable',
    'mealinfo'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => {
    return `<url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.85</priority>
    </url>`;
})
        .join('')}
</urlset>`;

fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemap, 'utf8');

console.log('Sitemap generated.');