/**
 * Social Media Embed Utilities
 *
 * Detects and converts social media URLs to embeddable content
 */

export interface EmbedData {
  type: 'youtube' | 'twitter' | 'instagram' | 'tiktok' | 'facebook' | 'linkedin' | 'vimeo' | 'spotify';
  url: string;
  embedCode: string;
  title?: string;
  thumbnail?: string;
}

/**
 * YouTube URL patterns and embed generation
 */
const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/watch\?.*&v=([a-zA-Z0-9_-]{11})/,
];

/**
 * Twitter URL patterns
 */
const TWITTER_PATTERNS = [
  /https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
];

/**
 * Instagram URL patterns
 */
const INSTAGRAM_PATTERNS = [
  /https?:\/\/(www\.)?instagram\.com\/(p|reel)\/([a-zA-Z0-9_-]+)/,
];

/**
 * TikTok URL patterns
 */
const TIKTOK_PATTERNS = [
  /https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
  /https?:\/\/vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
];

/**
 * Vimeo URL patterns
 */
const VIMEO_PATTERNS = [
  /https?:\/\/(www\.)?vimeo\.com\/(\d+)/,
];

/**
 * Spotify URL patterns
 */
const SPOTIFY_PATTERNS = [
  /https?:\/\/open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/,
];

/**
 * Extract YouTube video ID from URL
 */
function extractYouTubeId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract Twitter status ID from URL
 */
function extractTwitterId(url: string): string | null {
  for (const pattern of TWITTER_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[3];
  }
  return null;
}

/**
 * Extract Instagram post ID from URL
 */
function extractInstagramId(url: string): string | null {
  for (const pattern of INSTAGRAM_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[3];
  }
  return null;
}

/**
 * Extract TikTok video ID from URL
 */
function extractTikTokId(url: string): string | null {
  for (const pattern of TIKTOK_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[2] || match[1];
  }
  return null;
}

/**
 * Extract Vimeo video ID from URL
 */
function extractVimeoId(url: string): string | null {
  for (const pattern of VIMEO_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[2];
  }
  return null;
}

/**
 * Extract Spotify content ID and type from URL
 */
function extractSpotifyData(url: string): { type: string; id: string } | null {
  for (const pattern of SPOTIFY_PATTERNS) {
    const match = url.match(pattern);
    if (match) return { type: match[1], id: match[2] };
  }
  return null;
}

/**
 * Generate YouTube embed code
 */
function generateYouTubeEmbed(videoId: string): string {
  return `<div class="video-embed youtube-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000;">
    <iframe
      src="https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
      frameborder="0"
      allowfullscreen
      title="YouTube video player">
    </iframe>
  </div>`;
}

/**
 * Generate Twitter embed code
 */
function generateTwitterEmbed(tweetId: string): string {
  return `<div class="twitter-embed" style="margin: 1.5rem 0;">
    <blockquote class="twitter-tweet" data-theme="light">
      <a href="https://twitter.com/x/status/${tweetId}"></a>
    </blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  </div>`;
}

/**
 * Generate Instagram embed code
 */
function generateInstagramEmbed(postId: string): string {
  return `<div class="instagram-embed" style="margin: 1.5rem 0; text-align: center;">
    <blockquote
      class="instagram-media"
      data-instgrm-permalink="https://www.instagram.com/p/${postId}/"
      data-instgrm-version="14"
      style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
    </blockquote>
    <script async src="//www.instagram.com/embed.js"></script>
  </div>`;
}

/**
 * Generate TikTok embed code
 */
function generateTikTokEmbed(videoId: string): string {
  return `<div class="tiktok-embed" style="margin: 1.5rem 0; text-align: center;">
    <blockquote
      class="tiktok-embed"
      cite="https://www.tiktok.com/@user/video/${videoId}"
      data-video-id="${videoId}"
      style="max-width: 605px; min-width: 325px;">
    </blockquote>
    <script async src="https://www.tiktok.com/embed.js"></script>
  </div>`;
}

/**
 * Generate Vimeo embed code
 */
function generateVimeoEmbed(videoId: string): string {
  return `<div class="video-embed vimeo-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000;">
    <iframe
      src="https://player.vimeo.com/video/${videoId}?color=ffffff&title=0&byline=0&portrait=0"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      title="Vimeo video player">
    </iframe>
  </div>`;
}

/**
 * Generate Spotify embed code
 */
function generateSpotifyEmbed(type: string, id: string): string {
  const height = type === 'track' ? '152' : type === 'album' ? '352' : '432';
  return `<div class="spotify-embed" style="margin: 1.5rem 0;">
    <iframe
      src="https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0"
      width="100%"
      height="${height}"
      frameborder="0"
      allowfullscreen=""
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy">
    </iframe>
  </div>`;
}

/**
 * Detect if a URL is a supported social media URL
 */
export function isSocialMediaUrl(url: string): boolean {
  return !!(
    extractYouTubeId(url) ||
    extractTwitterId(url) ||
    extractInstagramId(url) ||
    extractTikTokId(url) ||
    extractVimeoId(url) ||
    extractSpotifyData(url)
  );
}

/**
 * Convert social media URL to embed data
 */
export function generateSocialEmbed(url: string): EmbedData | null {
  // YouTube
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return {
      type: 'youtube',
      url,
      embedCode: generateYouTubeEmbed(youtubeId),
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    };
  }

  // Twitter
  const twitterId = extractTwitterId(url);
  if (twitterId) {
    return {
      type: 'twitter',
      url,
      embedCode: generateTwitterEmbed(twitterId)
    };
  }

  // Instagram
  const instagramId = extractInstagramId(url);
  if (instagramId) {
    return {
      type: 'instagram',
      url,
      embedCode: generateInstagramEmbed(instagramId)
    };
  }

  // TikTok
  const tiktokId = extractTikTokId(url);
  if (tiktokId) {
    return {
      type: 'tiktok',
      url,
      embedCode: generateTikTokEmbed(tiktokId)
    };
  }

  // Vimeo
  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return {
      type: 'vimeo',
      url,
      embedCode: generateVimeoEmbed(vimeoId),
      thumbnail: `https://vumbnail.com/${vimeoId}.jpg`
    };
  }

  // Spotify
  const spotifyData = extractSpotifyData(url);
  if (spotifyData) {
    return {
      type: 'spotify',
      url,
      embedCode: generateSpotifyEmbed(spotifyData.type, spotifyData.id)
    };
  }

  return null;
}

/**
 * Replace social media URLs in content with embeds
 */
export function replaceSocialMediaUrls(content: string): string {
  const urlPattern = /(https?:\/\/[^\s<>"]+)/g;

  return content.replace(urlPattern, (match) => {
    const embedData = generateSocialEmbed(match);
    if (embedData) {
      return embedData.embedCode;
    }
    return match;
  });
}

/**
 * Extract all social media URLs from content
 */
export function extractSocialMediaUrls(content: string): string[] {
  const urlPattern = /(https?:\/\/[^\s<>"]+)/g;
  const urls: string[] = [];
  let match;

  while ((match = urlPattern.exec(content)) !== null) {
    if (isSocialMediaUrl(match[1])) {
      urls.push(match[1]);
    }
  }

  return urls;
}