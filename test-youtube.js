// Test YouTube Shorts URL parsing
const { getYouTubeVideoId, getYouTubeEmbedUrl, isValidYouTubeUrl } = require('./utils/youtube.js');

const testUrls = [
    'https://www.youtube.com/shorts/uXN4JtdElRU',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
];

console.log('Testing YouTube URL Parser\n');
console.log('='.repeat(60));

testUrls.forEach(url => {
    console.log(`\nURL: ${url}`);
    console.log(`Valid: ${isValidYouTubeUrl(url)}`);
    console.log(`Video ID: ${getYouTubeVideoId(url)}`);
    console.log(`Embed URL: ${getYouTubeEmbedUrl(url)}`);
    console.log('-'.repeat(60));
});
