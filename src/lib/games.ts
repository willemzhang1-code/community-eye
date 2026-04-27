import type { Game, AnomalySignal } from "./types";
import type { SubredditSnapshot } from "./reddit";

export const GAMES: Game[] = [
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
        platforms: ["PC"],
        lifecycle: "live",
        regions: ["Global"],
      },
      community: [
        {
          platform: "reddit",
          handle: "r/StarResonance",
          url: "https://www.reddit.com/r/StarResonance",
          is_primary: true,
        },
      ],
      culture: {
        slang: [],
        memes: [],
        history: [],
        controversies: [],
      },
      signals: {
        baselines: {},
        rules: [],
      },
      competitors: [],
      keywords: ["Blue Protocol", "Star Resonance", "BPSR"],
      updated_at: new Date().toISOString(),
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
        platforms: ["iOS", "Android"],
        lifecycle: "soft-launch",
        regions: ["Global"],
      },
      community: [
        {
          platform: "reddit",
          handle: "r/Bleach_SoulResonance",
          url: "https://www.reddit.com/r/Bleach_SoulResonance",
          is_primary: true,
        },
      ],
      culture: {
        slang: [],
        memes: [],
        history: [],
        controversies: [],
      },
      signals: {
        baselines: {},
        rules: [],
      },
      competitors: [],
      keywords: ["Bleach Soul Resonance", "BSR"],
      updated_at: new Date().toISOString(),
    },
  },
];

export function getGame(slug: string): Game | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function getRedditSubFor(game: Game): string | null {
  const reddit = game.profile.community.find((c) => c.platform === "reddit");
  if (!reddit) return null;
  return reddit.handle.replace(/^r\//, "");
}

export function detectAnomalies(snap: SubredditSnapshot): AnomalySignal[] {
  const out: AnomalySignal[] = [];
  if (snap.error) {
    out.push({ level: "warn", label: `Reddit 抓取失败：${snap.error}` });
    return out;
  }
  if (snap.posts.length === 0) {
    out.push({ level: "info", label: "暂无 Reddit 数据" });
    return out;
  }
  if (snap.postsLast24h >= 20) {
    out.push({
      level: "alert",
      label: `24h 内 ${snap.postsLast24h} 帖（活跃异常）`,
    });
  }
  if (snap.avgUpvoteRatio < 0.7 && snap.posts.length >= 5) {
    out.push({
      level: "warn",
      label: `平均 upvote 率 ${(snap.avgUpvoteRatio * 100).toFixed(0)}%（低于 70%）`,
    });
  }
  if (snap.avgUpvotes >= 100) {
    out.push({
      level: "info",
      label: `高互动（平均 ${Math.round(snap.avgUpvotes)} ups）`,
    });
  }
  return out;
}
