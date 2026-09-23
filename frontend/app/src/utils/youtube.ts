const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

const isYoutubeVideoId = (value: string) => /^[\w-]{11}$/.test(value);

export const extractYoutubeVideoId = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (isYoutubeVideoId(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const hostname = url.hostname.toLowerCase();

    if (hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId && isYoutubeVideoId(videoId) ? videoId : undefined;
    }

    if (!YOUTUBE_HOSTS.has(hostname)) {
      return undefined;
    }

    const queryVideoId = url.searchParams.get("v");
    if (queryVideoId && isYoutubeVideoId(queryVideoId)) {
      return queryVideoId;
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    if (["embed", "shorts", "live"].includes(pathParts[0] ?? "")) {
      const videoId = pathParts[1];
      return videoId && isYoutubeVideoId(videoId) ? videoId : undefined;
    }
  } catch {
    return undefined;
  }

  return undefined;
};

export const getYoutubeThumbnailUrl = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
