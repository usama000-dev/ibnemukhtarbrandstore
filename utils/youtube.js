// YouTube Video Helper Functions

/**
 * Extract YouTube video ID from various URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
export function getYouTubeVideoId(url) {
    if (!url) return null;

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Convert YouTube URL to embed URL with autoplay
 * @param {string} url - YouTube URL
 * @param {boolean} autoplay - Enable autoplay (default: true)
 * @param {boolean} mute - Mute video (default: true, required for autoplay)
 * @param {boolean} loop - Loop video (default: true)
 * @param {boolean} controls - Show controls (default: false)
 * @returns {string|null} - Embed URL or null if invalid
 */
export function getYouTubeEmbedUrl(url, options = {}) {
    const {
        autoplay = true,
        mute = true,
        loop = true,
        controls = false,
        modestbranding = true,
    } = options;

    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;

    const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        mute: mute ? '1' : '0',
        loop: loop ? '1' : '0',
        controls: controls ? '1' : '0',
        modestbranding: modestbranding ? '1' : '0',
        playlist: loop ? videoId : '', // Required for loop to work
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Validate if URL is a valid YouTube URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid YouTube URL
 */
export function isValidYouTubeUrl(url) {
    if (!url) return false;
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+/.test(url);
}
