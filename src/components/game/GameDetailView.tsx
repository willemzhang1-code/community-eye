import { Card, CardSection } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { fmtNum } from "@/lib/format";
import type { Game, AnomalySignal } from "@/lib/types";
import {
  topPosts,
  newestPosts,
  type SubredditSnapshot,
  type RedditPost,
} from "@/lib/reddit";

const lifecycleLabel: Record<string, string> = {
  "pre-announce": "预公布",
  announced: "已公布",
  "closed-beta": "闭测",
  "open-beta": "公测",
  "soft-launch": "软启",
  live: "在运",
  sunset: "停运",
};

interface Props {
  game: Game;
  snapshot: SubredditSnapshot | null;
  anomalies: AnomalySignal[];
}

export function GameDetailView({ game, snapshot, anomalies }: Props) {
  const sub = snapshot?.subreddit;

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
          style={{ background: `${game.accent_color ?? "#0071e3"}1a` }}
        >
          {game.emoji ?? "🎮"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {game.name}
            </h1>
            <Pill tone="muted">
              {lifecycleLabel[game.profile.basics.lifecycle]}
            </Pill>
          </div>
          <p className="text-sm text-muted mt-1">
            {game.profile.basics.developer} · {game.profile.basics.genre} ·{" "}
            {game.profile.basics.regions.join(" / ")}
          </p>
          {sub && (
            <p className="text-xs text-subtle mt-1">
              数据源：
              <a
                href={`https://www.reddit.com/r/${sub}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                r/{sub}
              </a>
              {snapshot?.fetchedAt && (
                <>
                  {" "}
                  · 抓取于 {new Date(snapshot.fetchedAt).toLocaleString("zh-CN")}
                </>
              )}
            </p>
          )}
        </div>
      </header>

      {snapshot?.error && (
        <Card className="border-danger/30">
          <CardSection className="text-sm text-danger">
            Reddit 抓取失败：{snapshot.error}
          </CardSection>
        </Card>
      )}

      {anomalies.length > 0 && (
        <Card className="border-warning/30">
          <CardSection className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-subtle mr-1">
              今日信号
            </span>
            {anomalies.map((a, i) => (
              <Pill
                key={i}
                tone={
                  a.level === "alert"
                    ? "danger"
                    : a.level === "warn"
                      ? "warning"
                      : "accent"
                }
              >
                {a.label}
              </Pill>
            ))}
          </CardSection>
        </Card>
      )}

      {snapshot && !snapshot.error && (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KPI label="24h 帖子" value={fmtNum(snapshot.postsLast24h)} />
          <KPI label="7d 帖子" value={fmtNum(snapshot.postsLast7d)} />
          <KPI
            label="平均 ups"
            value={
              snapshot.posts.length
                ? fmtNum(Math.round(snapshot.avgUpvotes))
                : "—"
            }
          />
          <KPI
            label="订阅"
            value={
              snapshot.subscribers != null
                ? fmtNum(snapshot.subscribers)
                : "—"
            }
          />
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">趋势</h2>
        <Card>
          <CardSection className="py-10 text-center">
            <div className="text-sm text-muted">数据收集中</div>
            <p className="text-xs text-subtle mt-2 max-w-md mx-auto">
              系统刚启用 Reddit 实时抓取，需积累至少 7 天的快照后才会生成趋势图。当前先看下方的活跃帖子。
            </p>
          </CardSection>
        </Card>
      </section>

      {snapshot && snapshot.posts.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PostList
            title={`Reddit · ${sub ? `r/${sub}` : ""} · 最热`}
            posts={topPosts(snapshot, 10)}
          />
          <PostList
            title={`Reddit · ${sub ? `r/${sub}` : ""} · 最新`}
            posts={newestPosts(snapshot, 10)}
          />
        </section>
      )}

      {snapshot && snapshot.posts.length === 0 && !snapshot.error && (
        <Card>
          <CardSection className="py-8 text-center text-sm text-subtle">
            该 subreddit 当前抓样为空
          </CardSection>
        </Card>
      )}
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardSection className="!p-4">
        <div className="text-[11px] uppercase tracking-wide text-subtle">
          {label}
        </div>
        <div className="mt-1 text-2xl font-semibold tabular tracking-tight">
          {value}
        </div>
      </CardSection>
    </Card>
  );
}

function PostList({ title, posts }: { title: string; posts: RedditPost[] }) {
  return (
    <Card>
      <CardSection>
        <h3 className="text-sm font-semibold mb-3">{title}</h3>
        <ul className="divide-y hairline -mx-1">
          {posts.length === 0 && (
            <li className="text-sm text-subtle py-2 px-1">暂无数据</li>
          )}
          {posts.map((p) => (
            <li key={p.id} className="py-2.5 px-1">
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80"
              >
                <div className="text-sm font-medium leading-snug line-clamp-2">
                  {p.title}
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-subtle tabular flex-wrap">
                  <span>↑ {fmtNum(p.ups)}</span>
                  <span>💬 {fmtNum(p.num_comments)}</span>
                  <span>{(p.upvote_ratio * 100).toFixed(0)}%</span>
                  <span className="truncate">u/{p.author}</span>
                  {p.flair && <Pill tone="muted">{p.flair}</Pill>}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </CardSection>
    </Card>
  );
}
