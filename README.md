# 社区之眼 · Community Eye

游戏市场情报看板。每款游戏拥有独立的「游戏档案」（基础信息 / 社区地图 / 文化语境 / 信号模型 / 竞品关系），系统按档案中的基线与规则判断异常，**不套用统一公式**。

## Tech

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4（Apple 风格设计 token）
- Recharts（趋势 / 情绪曲线）
- Supabase（数据持久化，可选）
- Vercel 部署

## 开发

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 路由

- `/` 看板：所有监控游戏卡片，今日热度 + 异常信号
- `/games/[slug]` 游戏详情：趋势图（7/30/90 天）、情绪曲线、Reddit & YouTube 列表、完整档案
- `/briefings` 简报：每日邮件归档
- `/briefings/[id]` 简报详情
- `/settings` 游戏档案编辑器（基础 → 社区 → 文化 → 信号 → 竞品）

## Supabase

复制 `.env.local.example` 到 `.env.local` 并填入：

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

未配置时使用 mock 数据。建议表结构：

```sql
games (id uuid pk, name text, slug text unique, emoji text, accent_color text, profile jsonb, created_at timestamptz)
daily_metrics (id uuid pk, game_id uuid fk, date date, reddit_posts int, reddit_avg_upvotes int,
               youtube_videos int, x_mentions int, steam_concurrent int, discord_members int,
               sentiment_score numeric)
posts (id uuid pk, game_id uuid fk, date date, platform text, title text, url text, author text,
       upvotes int, comments int, views int, sentiment text)
briefings (id uuid pk, date date, content_md text, sent_at timestamptz, highlights jsonb)
```

`games.profile` 是结构化 JSONB（见 `src/lib/types.ts` 的 `GameProfile`）。

## 部署

推送到 GitHub 后在 Vercel import 即可。env vars 在 Vercel project settings 配置。
