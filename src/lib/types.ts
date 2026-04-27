export type Platform =
  | "reddit"
  | "youtube"
  | "x"
  | "discord"
  | "bilibili"
  | "tieba"
  | "steam";

export type Sentiment = "positive" | "neutral" | "negative";

export type GameGenre =
  | "MMORPG"
  | "Gacha"
  | "ARPG"
  | "Shooter"
  | "Strategy"
  | "Roguelike"
  | "Survival"
  | "Other";

export type LifecycleStage =
  | "pre-announce"
  | "announced"
  | "closed-beta"
  | "open-beta"
  | "soft-launch"
  | "live"
  | "sunset";

export type Region = "CN" | "JP" | "KR" | "SEA" | "NA" | "EU" | "Global";
export type DevicePlatform = "PC" | "iOS" | "Android" | "PS5" | "Xbox" | "Switch" | "Web";

export interface GameBasics {
  developer: string;
  publisher?: string;
  genre: GameGenre;
  launch_date?: string;
  platforms: DevicePlatform[];
  lifecycle: LifecycleStage;
  regions: Region[];
}

export interface CommunityChannel {
  platform: Platform;
  handle: string;
  url?: string;
  is_primary: boolean;
  size?: number;
  baseline_daily_posts?: number;
  notes?: string;
}

export interface SlangEntry {
  term: string;
  meaning: string;
}
export interface MemeEntry {
  name: string;
  context: string;
}
export interface HistoryEntry {
  date: string;
  event: string;
  impact: "low" | "medium" | "high";
}
export interface ControversyEntry {
  topic: string;
  status: "active" | "resolved";
  summary: string;
}

export interface CulturalContext {
  slang: SlangEntry[];
  memes: MemeEntry[];
  history: HistoryEntry[];
  controversies: ControversyEntry[];
}

export type SignalMetric =
  | "reddit_posts"
  | "reddit_avg_upvotes"
  | "youtube_videos"
  | "x_mentions"
  | "steam_concurrent"
  | "sentiment_score"
  | "discord_members";

export interface SignalRule {
  metric: SignalMetric;
  comparator: "gte" | "lte" | "delta_pct_gte" | "delta_pct_lte";
  value: number;
  window_days?: number;
  severity: "info" | "warn" | "alert";
  label: string;
}

export interface SignalBaselines {
  reddit_posts_daily?: number;
  reddit_upvotes_avg?: number;
  youtube_videos_daily?: number;
  x_mentions_daily?: number;
  sentiment_baseline?: number;
  discord_members?: number;
  steam_concurrent?: number;
}

export interface SignalModel {
  baselines: SignalBaselines;
  rules: SignalRule[];
}

export interface CompetitorRef {
  name: string;
  game_id?: string;
  relation: "direct" | "indirect";
  overlap_pct?: number;
  notes?: string;
}

export interface GameProfile {
  basics: GameBasics;
  community: CommunityChannel[];
  culture: CulturalContext;
  signals: SignalModel;
  competitors: CompetitorRef[];
  keywords: string[];
  updated_at: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  emoji?: string;
  accent_color?: string;
  profile: GameProfile;
}

export interface DailyMetric {
  id: string;
  game_id: string;
  date: string;
  reddit_posts: number;
  reddit_avg_upvotes: number;
  youtube_videos: number;
  x_mentions: number;
  steam_concurrent: number | null;
  discord_members?: number | null;
  sentiment_score: number;
}

export interface Post {
  id: string;
  game_id: string;
  date: string;
  platform: Platform;
  title: string;
  url: string;
  author?: string;
  upvotes: number;
  comments: number;
  views?: number;
  sentiment: Sentiment;
  thumbnail?: string;
}

export interface Briefing {
  id: string;
  date: string;
  content_md: string;
  sent_at: string | null;
  highlights: string[];
}

export interface AnomalySignal {
  level: "info" | "warn" | "alert";
  label: string;
}
