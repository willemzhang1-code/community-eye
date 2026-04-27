import type {
  Game,
  DailyMetric,
  Post,
  Briefing,
  AnomalySignal,
} from "./types";

const NOW_ISO = new Date().toISOString();

export const MOCK_GAMES: Game[] = [
  {
    id: "bpsr",
    name: "Blue Protocol: Star Resonance",
    slug: "bpsr",
    emoji: "🔷",
    accent_color: "#0a84ff",
    profile: {
      basics: {
        developer: "Tencent / Bandai Namco Online",
        publisher: "Tencent",
        genre: "MMORPG",
        launch_date: "2025-12-12",
        platforms: ["PC"],
        lifecycle: "closed-beta",
        regions: ["CN", "Global"],
      },
      community: [
        {
          platform: "reddit",
          handle: "r/StarResonance",
          url: "https://reddit.com/r/StarResonance",
          is_primary: true,
          size: 38400,
          baseline_daily_posts: 24,
          notes: "EN community hub since CBT2",
        },
        {
          platform: "bilibili",
          handle: "蓝色星原",
          is_primary: false,
          size: 220000,
          notes: "CN gameplay guides + drama threads",
        },
        {
          platform: "x",
          handle: "@StarResonanceEN",
          is_primary: false,
          size: 96000,
        },
        {
          platform: "steam",
          handle: "Steam appid 3681810",
          is_primary: false,
          baseline_daily_posts: 0,
        },
      ],
      culture: {
        slang: [
          { term: "BPSR", meaning: "Blue Protocol: Star Resonance 简称" },
          { term: "Frost Mage", meaning: "CBT2 后的版本之子，AoE 神职" },
          { term: "key drop", meaning: "闭测激活码空投活动" },
        ],
        memes: [
          {
            name: "Server queue copium",
            context: "CBT2 长队列演变成的社区梗",
          },
        ],
        history: [
          {
            date: "2024-04-20",
            event: "原版 Blue Protocol（日服）停运",
            impact: "high",
          },
          {
            date: "2025-08-15",
            event: "腾讯以 Star Resonance 重启项目",
            impact: "high",
          },
          {
            date: "2025-11-02",
            event: "CBT2 开启，Steam appid 泄露",
            impact: "medium",
          },
        ],
        controversies: [
          {
            topic: "商城定价",
            status: "active",
            summary: "CBT2 时装定价引发差评轰炸预警",
          },
        ],
      },
      signals: {
        baselines: {
          reddit_posts_daily: 24,
          reddit_upvotes_avg: 65,
          youtube_videos_daily: 5,
          x_mentions_daily: 180,
          sentiment_baseline: 0.42,
          steam_concurrent: 13000,
        },
        rules: [
          {
            metric: "reddit_posts",
            comparator: "gte",
            value: 36,
            severity: "alert",
            label: "Reddit 量级飙升（≥1.5× 基线）",
          },
          {
            metric: "sentiment_score",
            comparator: "lte",
            value: 0.3,
            severity: "warn",
            label: "情绪跌破 0.30",
          },
          {
            metric: "steam_concurrent",
            comparator: "delta_pct_lte",
            value: -15,
            window_days: 1,
            severity: "warn",
            label: "Steam 在线人数 DoD 下跌 >15%",
          },
          {
            metric: "reddit_avg_upvotes",
            comparator: "gte",
            value: 90,
            severity: "info",
            label: "高互动（平均点赞 ≥ 90）",
          },
        ],
      },
      competitors: [
        {
          name: "Genshin Impact",
          relation: "indirect",
          overlap_pct: 35,
          notes: "二次元美术受众交集",
        },
        {
          name: "Tower of Fantasy",
          relation: "direct",
          overlap_pct: 60,
          notes: "同 MMO-Gacha 混合赛道",
        },
        { name: "Wuthering Waves", relation: "indirect", overlap_pct: 28 },
      ],
      keywords: ["Blue Protocol", "Star Resonance", "BPSR", "蓝色星原"],
      updated_at: NOW_ISO,
    },
  },
  {
    id: "bleach",
    name: "Bleach: Soul Resonance",
    slug: "bleach",
    emoji: "⚔️",
    accent_color: "#ff9f0a",
    profile: {
      basics: {
        developer: "KLab",
        publisher: "KLab / 集英社",
        genre: "Gacha",
        launch_date: "2026-02-05",
        platforms: ["iOS", "Android"],
        lifecycle: "soft-launch",
        regions: ["JP", "SEA", "Global"],
      },
      community: [
        {
          platform: "reddit",
          handle: "r/Bleach_SoulResonance",
          url: "https://reddit.com/r/Bleach_SoulResonance",
          is_primary: true,
          size: 8200,
          baseline_daily_posts: 11,
        },
        {
          platform: "discord",
          handle: "Bleach SR Official",
          is_primary: true,
          size: 42215,
          notes: "官方服务器 — 开发组在此回复",
        },
        {
          platform: "youtube",
          handle: "Various creators",
          is_primary: false,
          baseline_daily_posts: 3,
        },
      ],
      culture: {
        slang: [
          { term: "BSR", meaning: "Bleach: Soul Resonance 简称" },
          { term: "rate-up", meaning: "概率提升的限定卡池" },
          { term: "reroll", meaning: "重抽（删档刷初始）" },
        ],
        memes: [
          {
            name: "Aizen banner when",
            context: "玩家催 Aizen 限定的口头梗",
          },
        ],
        history: [
          {
            date: "2025-09-10",
            event: "国服 NetEase 代理软启动",
            impact: "medium",
          },
          {
            date: "2026-01-20",
            event: "全球预约突破 100 万",
            impact: "medium",
          },
        ],
        controversies: [
          {
            topic: "抽卡概率透明度",
            status: "active",
            summary: "玩家统计与官方公示概率存在偏差",
          },
        ],
      },
      signals: {
        baselines: {
          reddit_posts_daily: 11,
          reddit_upvotes_avg: 22,
          youtube_videos_daily: 3,
          x_mentions_daily: 95,
          sentiment_baseline: 0.18,
          discord_members: 42215,
        },
        rules: [
          {
            metric: "reddit_posts",
            comparator: "gte",
            value: 25,
            severity: "alert",
            label: "Reddit 量级飙升（≥2× 基线）",
          },
          {
            metric: "sentiment_score",
            comparator: "lte",
            value: 0.2,
            severity: "warn",
            label: "情绪跌破 0.20 阈值",
          },
          {
            metric: "discord_members",
            comparator: "delta_pct_gte",
            value: 5,
            window_days: 7,
            severity: "info",
            label: "Discord WoW +5%（增长信号）",
          },
        ],
      },
      competitors: [
        {
          name: "One Piece: Project Fighter",
          relation: "direct",
          overlap_pct: 70,
          notes: "集英社 IP 抽卡受众",
        },
        { name: "Dragon Ball Legends", relation: "direct", overlap_pct: 55 },
        { name: "Genshin Impact", relation: "indirect", overlap_pct: 18 },
      ],
      keywords: ["Bleach Soul Resonance", "BSR", "魂之共鸣"],
      updated_at: NOW_ISO,
    },
  },
];

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface MetricBase {
  posts: number;
  upvotes: number;
  youtube: number;
  x: number;
  steam?: number;
  discord?: number;
  sent: number;
}

function gen(game_id: string, base: MetricBase): DailyMetric[] {
  const out: DailyMetric[] = [];
  for (let i = 89; i >= 0; i--) {
    const seed = (game_id.charCodeAt(0) + i) * 7;
    const r = seededRandom(seed);
    const r2 = seededRandom(seed + 1);
    const trendBoost = i < 14 ? 1 + (14 - i) * 0.04 : 1;
    out.push({
      id: `${game_id}-${i}`,
      game_id,
      date: isoDaysAgo(i),
      reddit_posts: Math.round(base.posts * (0.6 + r * 0.9) * trendBoost),
      reddit_avg_upvotes: Math.round(
        base.upvotes * (0.5 + r2 * 1.1) * trendBoost,
      ),
      youtube_videos: Math.round(base.youtube * (0.4 + r * 1.4) * trendBoost),
      x_mentions: Math.round(base.x * (0.5 + r2 * 1.3) * trendBoost),
      steam_concurrent: base.steam
        ? Math.round(base.steam * (0.7 + r * 0.6) * trendBoost)
        : null,
      discord_members: base.discord
        ? Math.round(base.discord * (0.98 + r * 0.04) * (1 + (89 - i) * 0.001))
        : null,
      sentiment_score: Math.max(
        -1,
        Math.min(1, base.sent + (r - 0.5) * 0.6),
      ),
    });
  }
  return out;
}

export const MOCK_METRICS: DailyMetric[] = [
  ...gen("bpsr", {
    posts: 24,
    upvotes: 68,
    youtube: 6,
    x: 180,
    steam: 14000,
    sent: 0.42,
  }),
  ...gen("bleach", {
    posts: 11,
    upvotes: 22,
    youtube: 3,
    x: 95,
    discord: 42215,
    sent: 0.18,
  }),
];

const REDDIT_BPSR_TITLES = [
  "Star Resonance closed beta thoughts after 12 hours",
  "Comparison: BPSR vs Genshin combat feel",
  "Server queues are insane right now",
  "Found a hidden boss in the western desert zone",
  "Why is the cash shop pricing like this?",
  "Build guide: Frost Mage AoE for late game",
  "Honest review — beautiful but grind-heavy",
  "Patch notes leaked? Read inside",
];

const REDDIT_BLEACH_TITLES = [
  "Soul Resonance launch megathread — bugs and impressions",
  "Tier list updated for current banner",
  "Is the gacha rate actually fair? Math inside",
  "Summary of CN livestream announcements",
  "Reroll guide for global launch",
  "Aizen banner when?",
  "Server stability has been rough this week",
];

const YT_BPSR_TITLES = [
  "I played 50 hours of Star Resonance — full review",
  "Star Resonance Endgame Explained",
  "Top 5 classes ranked",
  "BPSR open world tour 4K",
];

const YT_BLEACH_TITLES = [
  "Bleach Soul Resonance global launch first look",
  "Best F2P units to invest in",
  "Soul Resonance combat showcase",
];

function makePosts(
  game_id: string,
  redditTitles: string[],
  ytTitles: string[],
  redditSub: string,
): Post[] {
  const posts: Post[] = [];
  redditTitles.forEach((title, i) => {
    const r = seededRandom(game_id.charCodeAt(0) + i * 3);
    posts.push({
      id: `${game_id}-r-${i}`,
      game_id,
      date: isoDaysAgo(i % 7),
      platform: "reddit",
      title,
      url: `https://reddit.com/r/${redditSub}/comments/mock${i}`,
      author: `u/user${100 + i}`,
      upvotes: Math.round(50 + r * 800),
      comments: Math.round(8 + r * 220),
      sentiment: r > 0.66 ? "positive" : r > 0.33 ? "neutral" : "negative",
    });
  });
  ytTitles.forEach((title, i) => {
    const r = seededRandom(game_id.charCodeAt(0) + i * 5 + 100);
    posts.push({
      id: `${game_id}-y-${i}`,
      game_id,
      date: isoDaysAgo(i % 7),
      platform: "youtube",
      title,
      url: `https://youtube.com/watch?v=mock${game_id}${i}`,
      author: `Channel ${i + 1}`,
      upvotes: Math.round(200 + r * 5000),
      comments: Math.round(40 + r * 600),
      views: Math.round(8000 + r * 220000),
      sentiment: r > 0.5 ? "positive" : "neutral",
    });
  });
  return posts;
}

export const MOCK_POSTS: Post[] = [
  ...makePosts("bpsr", REDDIT_BPSR_TITLES, YT_BPSR_TITLES, "StarResonance"),
  ...makePosts(
    "bleach",
    REDDIT_BLEACH_TITLES,
    YT_BLEACH_TITLES,
    "Bleach_SoulResonance",
  ),
];

export const MOCK_BRIEFINGS: Briefing[] = [
  {
    id: "br-0",
    date: isoDaysAgo(0),
    sent_at: new Date().toISOString(),
    highlights: [
      "BPSR Reddit 量级 +38% WoW",
      "Bleach SR 情绪跌至 0.12（低于阈值）",
      "YouTube 爆款：Star Resonance Endgame 视频 220K 播放",
    ],
    content_md: `# 社区之眼 · 每日简报 — ${isoDaysAgo(0)}

## 头条
**Star Resonance** 创下近 30 天最强社区日，**Bleach: Soul Resonance** 因抽卡概率争议情绪持续下滑。

## 高亮
- **BPSR**：33 条 Reddit 帖子（+38% WoW），平均 71 点赞，情绪 0.48。
- **Bleach SR**：9 条帖子，平均 19 点赞，情绪 **0.12** — 低于阈值 0.20。
- **YouTube**：「Star Resonance Endgame Explained」24h 内 220K 播放。

## 关注
- Bleach SR 抽卡争议若 48h 内官方未表态，可能演变为有组织的差评轰炸。
- BPSR Steam 在线 14.8K，逼近 CBT 峰值。
`,
  },
  {
    id: "br-1",
    date: isoDaysAgo(1),
    sent_at: new Date(Date.now() - 86400000).toISOString(),
    highlights: ["两款游戏均无异常", "Bleach SR Discord 突破 42K 成员"],
    content_md: `# 社区之眼 · 每日简报 — ${isoDaysAgo(1)}

## 概述
平稳一天，无异常触发。Bleach SR Discord 成员数突破 **42,215**。

## BPSR
- 22 条 Reddit 帖子，情绪 0.41。
- Steam 在线：13.2K（-4% DoD）。

## Bleach SR
- 8 条 Reddit 帖子，情绪 0.21。
- Discord：42,215（+1.2% DoD）。
`,
  },
  {
    id: "br-2",
    date: isoDaysAgo(2),
    sent_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    highlights: ["BPSR CBT key giveaway 推动 2.4× 帖子量"],
    content_md: `# 社区之眼 · 每日简报 — ${isoDaysAgo(2)}

## 头条
BPSR 闭测 key 抽奖把 r/StarResonance 帖子量推高 **2.4×**。

## BPSR
- 58 条 Reddit 帖子（基线 24），多为 key drop 相关。
- 情绪：0.55 — 本周最高。

## Bleach SR
- 11 条 Reddit 帖子，情绪稳定在 0.24。
`,
  },
];

function metricValue(m: DailyMetric, metric: string): number | null {
  switch (metric) {
    case "reddit_posts":
      return m.reddit_posts;
    case "reddit_avg_upvotes":
      return m.reddit_avg_upvotes;
    case "youtube_videos":
      return m.youtube_videos;
    case "x_mentions":
      return m.x_mentions;
    case "steam_concurrent":
      return m.steam_concurrent;
    case "sentiment_score":
      return m.sentiment_score;
    case "discord_members":
      return m.discord_members ?? null;
    default:
      return null;
  }
}

export function getAnomalies(
  game: Game,
  metrics: DailyMetric[],
): AnomalySignal[] {
  const signals: AnomalySignal[] = [];
  const today = metrics[metrics.length - 1];
  const yesterday = metrics[metrics.length - 2];
  if (!today) return signals;

  for (const rule of game.profile.signals.rules) {
    const v = metricValue(today, rule.metric);
    if (v == null) continue;

    let triggered = false;
    if (rule.comparator === "gte") triggered = v >= rule.value;
    else if (rule.comparator === "lte") triggered = v <= rule.value;
    else if (yesterday) {
      const prev = metricValue(yesterday, rule.metric);
      if (prev != null && prev !== 0) {
        const deltaPct = ((v - prev) / Math.abs(prev)) * 100;
        if (rule.comparator === "delta_pct_gte")
          triggered = deltaPct >= rule.value;
        if (rule.comparator === "delta_pct_lte")
          triggered = deltaPct <= rule.value;
      }
    }
    if (triggered) signals.push({ level: rule.severity, label: rule.label });
  }
  return signals;
}

export function getMetricsForGame(gameId: string, days = 90): DailyMetric[] {
  return MOCK_METRICS.filter((m) => m.game_id === gameId).slice(-days);
}

export function getPostsForGame(gameId: string): Post[] {
  return MOCK_POSTS.filter((p) => p.game_id === gameId);
}

export function getGame(slug: string): Game | undefined {
  return MOCK_GAMES.find((g) => g.slug === slug);
}
