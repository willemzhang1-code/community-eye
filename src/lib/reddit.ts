export interface RedditPost {
  id: string;
  title: string;
  url: string;
  author: string;
  ups: number;
  num_comments: number;
  upvote_ratio: number;
  created_utc: number;
  flair: string | null;
  is_self: boolean;
  permalink: string;
}

export interface SubredditSnapshot {
  subreddit: string;
  subscribers: number | null;
  posts: RedditPost[];
  postsLast24h: number;
  postsLast7d: number;
  avgUpvotes: number;
  avgUpvoteRatio: number;
  totalUpvotes: number;
  totalComments: number;
  fetchedAt: string;
  error: string | null;
}

const UA =
  "web:community-eye:0.1.0 (server-side dashboard for game community signals)";

interface RawListingChild {
  data: {
    id: string;
    title: string;
    author: string;
    ups: number;
    num_comments: number;
    upvote_ratio: number;
    created_utc: number;
    link_flair_text?: string | null;
    is_self: boolean;
    permalink: string;
    url: string;
  };
}

async function fetchListing(sub: string): Promise<RawListingChild[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${encodeURIComponent(sub)}/new.json?limit=100&raw_json=1`,
    {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 300 },
    },
  );
  if (!res.ok) {
    throw new Error(`Reddit listing ${sub} → HTTP ${res.status}`);
  }
  const json = (await res.json()) as { data?: { children?: RawListingChild[] } };
  return json.data?.children ?? [];
}

async function fetchAbout(sub: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${encodeURIComponent(sub)}/about.json?raw_json=1`,
      {
        headers: { "User-Agent": UA, Accept: "application/json" },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { subscribers?: number };
    };
    return json.data?.subscribers ?? null;
  } catch {
    return null;
  }
}

export async function fetchSubreddit(sub: string): Promise<SubredditSnapshot> {
  const fetchedAt = new Date().toISOString();
  try {
    const [children, subscribers] = await Promise.all([
      fetchListing(sub),
      fetchAbout(sub),
    ]);

    const posts: RedditPost[] = children.map((c) => ({
      id: c.data.id,
      title: c.data.title,
      url: `https://www.reddit.com${c.data.permalink}`,
      author: c.data.author,
      ups: c.data.ups,
      num_comments: c.data.num_comments,
      upvote_ratio: c.data.upvote_ratio,
      created_utc: c.data.created_utc,
      flair: c.data.link_flair_text ?? null,
      is_self: c.data.is_self,
      permalink: c.data.permalink,
    }));

    const nowSec = Date.now() / 1000;
    const day = 86400;
    const postsLast24h = posts.filter((p) => nowSec - p.created_utc <= day).length;
    const postsLast7d = posts.filter((p) => nowSec - p.created_utc <= 7 * day).length;
    const totalUpvotes = posts.reduce((s, p) => s + p.ups, 0);
    const totalComments = posts.reduce((s, p) => s + p.num_comments, 0);
    const avgUpvotes = posts.length ? totalUpvotes / posts.length : 0;
    const avgUpvoteRatio =
      posts.length
        ? posts.reduce((s, p) => s + p.upvote_ratio, 0) / posts.length
        : 0;

    return {
      subreddit: sub,
      subscribers,
      posts,
      postsLast24h,
      postsLast7d,
      avgUpvotes,
      avgUpvoteRatio,
      totalUpvotes,
      totalComments,
      fetchedAt,
      error: null,
    };
  } catch (err) {
    return {
      subreddit: sub,
      subscribers: null,
      posts: [],
      postsLast24h: 0,
      postsLast7d: 0,
      avgUpvotes: 0,
      avgUpvoteRatio: 0,
      totalUpvotes: 0,
      totalComments: 0,
      fetchedAt,
      error: err instanceof Error ? err.message : "unknown error",
    };
  }
}

export function topPosts(snap: SubredditSnapshot, n = 8): RedditPost[] {
  return [...snap.posts]
    .sort((a, b) => b.ups - a.ups)
    .slice(0, n);
}

export function newestPosts(snap: SubredditSnapshot, n = 8): RedditPost[] {
  return [...snap.posts]
    .sort((a, b) => b.created_utc - a.created_utc)
    .slice(0, n);
}
