# 社区之眼 · Community Eye

游戏市场情报看板。每款游戏的看板与详情页直接抓取 Reddit 公共数据，KPI（24h / 7d 帖子数、平均 ups、订阅数）与异常信号都从真实 listing 计算，**没有 mock 数据**。

## Tech

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Reddit JSON / OAuth API
- Vercel

## 路由

- `/` 看板：所有监控游戏卡片，24h 帖子量 + 异常信号
- `/games/[slug]` 游戏详情：KPI、最热 / 最新真实帖子列表（点击直达 Reddit）、游戏档案
- `/briefings` 简报：占位（自动简报管道未启用）
- `/settings` 游戏档案编辑器

趋势 / 情绪曲线已下线，会等积累至少 7 天的快照后再加。

## Reddit OAuth（部署到 Vercel 必需）

Reddit 在 2023 年开始拦截数据中心 IP 的匿名 JSON 请求（包括 Vercel）。本地开发可以匿名抓取，但 Vercel 上必须用 OAuth client_credentials。

1. 打开 <https://www.reddit.com/prefs/apps>，点 **create another app**
2. 填：
   - name: `community-eye`
   - 选 **script**（或 **web app**）
   - redirect uri: `http://localhost`（不会真的跳转）
3. 创建后能看到 `client_id`（在 app 名字下面，14 位字符串）和 `secret`
4. 在 Vercel project settings → Environment Variables 加：
   - `REDDIT_CLIENT_ID`
   - `REDDIT_CLIENT_SECRET`
   - `REDDIT_USER_AGENT`（推荐 `web:community-eye:0.2.0 (by /u/<your-reddit-username>)`，遵循 Reddit 的 UA 规范）
5. Redeploy

没有 OAuth 凭据时代码会回退到匿名 `www.reddit.com` 端点 —— 本地开发可用，Vercel 上会 403。

## 开发

```bash
npm install
npm run dev
```

访问 <http://localhost:3000>。

## 数据缓存

- 子版块 listing：`revalidate: 300`（5 分钟）
- about（订阅数）：`revalidate: 3600`（1 小时）
- OAuth token：`revalidate: 3000`（~50 分钟，token 1 小时过期）
