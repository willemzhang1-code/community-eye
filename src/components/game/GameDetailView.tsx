"use client";

import { useMemo, useState } from "react";
import { Card, CardSection } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { TrendChart } from "@/components/charts/TrendChart";
import { SentimentChart } from "@/components/charts/SentimentChart";
import { RangeTabs, type RangeKey } from "./RangeTabs";
import { fmtNum, fmtSent, pctDelta } from "@/lib/format";
import type { Game, DailyMetric, Post, AnomalySignal } from "@/lib/types";

const lifecycleLabel: Record<string, string> = {
  "pre-announce": "预公布",
  announced: "已公布",
  "closed-beta": "闭测",
  "open-beta": "公测",
  "soft-launch": "软启",
  live: "在运",
  sunset: "停运",
};

const platformLabel: Record<string, string> = {
  reddit: "Reddit",
  youtube: "YouTube",
  x: "X / Twitter",
  discord: "Discord",
  bilibili: "Bilibili",
  tieba: "贴吧",
  steam: "Steam",
};

interface Props {
  game: Game;
  metrics: DailyMetric[];
  posts: Post[];
  anomalies: AnomalySignal[];
}

export function GameDetailView({ game, metrics, posts, anomalies }: Props) {
  const [range, setRange] = useState<RangeKey>("30d");

  const sliced = useMemo(() => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    return metrics.slice(-days);
  }, [metrics, range]);

  const today = metrics[metrics.length - 1];
  const yesterday = metrics[metrics.length - 2];

  const baseline = game.profile.signals.baselines.sentiment_baseline;

  const redditPosts = posts.filter((p) => p.platform === "reddit");
  const ytPosts = posts.filter((p) => p.platform === "youtube");

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
        </div>
      </header>

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

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPI label="Reddit 帖" value={fmtNum(today.reddit_posts)} prev={yesterday?.reddit_posts} curr={today.reddit_posts} />
        <KPI label="平均点赞" value={fmtNum(today.reddit_avg_upvotes)} prev={yesterday?.reddit_avg_upvotes} curr={today.reddit_avg_upvotes} />
        <KPI label="YouTube" value={fmtNum(today.youtube_videos)} prev={yesterday?.youtube_videos} curr={today.youtube_videos} />
        <KPI
          label="情绪"
          value={fmtSent(today.sentiment_score)}
          prev={yesterday?.sentiment_score}
          curr={today.sentiment_score}
          isAbs
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">趋势</h2>
          <RangeTabs value={range} onChange={setRange} />
        </div>

        <Card>
          <CardSection>
            <div className="text-xs text-subtle mb-2">活跃度</div>
            <TrendChart
              metrics={sliced}
              series={["reddit_posts", "youtube_videos", "x_mentions"]}
            />
          </CardSection>
        </Card>

        <Card>
          <CardSection>
            <div className="text-xs text-subtle mb-2">情绪曲线</div>
            <SentimentChart metrics={sliced} baseline={baseline} />
          </CardSection>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PostList
          title={`Reddit · ${game.profile.community.find((c) => c.platform === "reddit")?.handle ?? "—"}`}
          posts={redditPosts}
        />
        <PostList title="YouTube 视频" posts={ytPosts} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">游戏档案</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardSection>
              <h3 className="text-sm font-semibold mb-3">社区地图</h3>
              <ul className="space-y-2.5">
                {game.profile.community.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="font-medium">
                        {platformLabel[c.platform] ?? c.platform}
                        {c.is_primary && (
                          <Pill tone="accent" className="ml-2">
                            主社区
                          </Pill>
                        )}
                      </div>
                      <div className="text-xs text-subtle truncate">
                        {c.handle}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {c.size != null && (
                        <div className="tabular text-sm">
                          {fmtNum(c.size)}
                        </div>
                      )}
                      {c.baseline_daily_posts != null && (
                        <div className="text-[11px] text-subtle">
                          基线 {c.baseline_daily_posts}/日
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardSection>
          </Card>

          <Card>
            <CardSection>
              <h3 className="text-sm font-semibold mb-3">文化语境</h3>
              <div className="text-xs uppercase tracking-wide text-subtle mt-1 mb-1.5">
                俚语
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {game.profile.culture.slang.map((s, i) => (
                  <Pill key={i} tone="muted" title={s.meaning}>
                    {s.term}
                  </Pill>
                ))}
              </div>
              <div className="text-xs uppercase tracking-wide text-subtle mb-1.5">
                争议
              </div>
              <ul className="space-y-1.5 text-sm">
                {game.profile.culture.controversies.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Pill
                      tone={c.status === "active" ? "warning" : "muted"}
                      className="mt-0.5"
                    >
                      {c.status === "active" ? "进行中" : "已平息"}
                    </Pill>
                    <div>
                      <div className="font-medium">{c.topic}</div>
                      <div className="text-xs text-muted">{c.summary}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="text-xs uppercase tracking-wide text-subtle mt-4 mb-1.5">
                重大事件
              </div>
              <ul className="space-y-1.5 text-sm">
                {game.profile.culture.history.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-xs tabular text-subtle w-20 shrink-0 pt-0.5">
                      {h.date}
                    </span>
                    <span>{h.event}</span>
                  </li>
                ))}
              </ul>
            </CardSection>
          </Card>

          <Card>
            <CardSection>
              <h3 className="text-sm font-semibold mb-3">信号模型</h3>
              <ul className="space-y-2 text-sm">
                {game.profile.signals.rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Pill
                      tone={
                        r.severity === "alert"
                          ? "danger"
                          : r.severity === "warn"
                            ? "warning"
                            : "accent"
                      }
                      className="mt-0.5"
                    >
                      {r.severity === "alert"
                        ? "异常"
                        : r.severity === "warn"
                          ? "警告"
                          : "信号"}
                    </Pill>
                    <span>{r.label}</span>
                  </li>
                ))}
              </ul>
            </CardSection>
          </Card>

          <Card>
            <CardSection>
              <h3 className="text-sm font-semibold mb-3">竞品关系</h3>
              <ul className="space-y-2 text-sm">
                {game.profile.competitors.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Pill tone={c.relation === "direct" ? "accent" : "muted"}>
                        {c.relation === "direct" ? "直接" : "间接"}
                      </Pill>
                      <span className="truncate">{c.name}</span>
                    </div>
                    {c.overlap_pct != null && (
                      <span className="text-xs text-subtle tabular shrink-0">
                        重叠 {c.overlap_pct}%
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </CardSection>
          </Card>
        </div>
      </section>
    </div>
  );
}

function KPI({
  label,
  value,
  prev,
  curr,
  isAbs,
}: {
  label: string;
  value: string;
  prev?: number;
  curr: number;
  isAbs?: boolean;
}) {
  const delta =
    prev != null ? (isAbs ? (curr - prev) * 100 : pctDelta(curr, prev)) : 0;
  const positive = delta >= 0;
  return (
    <Card>
      <CardSection className="!p-4">
        <div className="text-[11px] uppercase tracking-wide text-subtle">
          {label}
        </div>
        <div className="mt-1 text-2xl font-semibold tabular tracking-tight">
          {value}
        </div>
        {prev != null && Math.abs(delta) >= 0.5 && (
          <div
            className={`text-[11px] tabular mt-0.5 ${
              positive ? "text-success" : "text-danger"
            }`}
          >
            {positive ? "▲" : "▼"} {Math.abs(delta).toFixed(isAbs ? 0 : 1)}
            {isAbs ? "" : "%"}
          </div>
        )}
      </CardSection>
    </Card>
  );
}

function PostList({ title, posts }: { title: string; posts: Post[] }) {
  return (
    <Card>
      <CardSection>
        <h3 className="text-sm font-semibold mb-3">{title}</h3>
        <ul className="divide-y hairline -mx-1">
          {posts.length === 0 && (
            <li className="text-sm text-subtle py-2 px-1">暂无数据</li>
          )}
          {posts.slice(0, 6).map((p) => (
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
                <div className="mt-1 flex items-center gap-3 text-[11px] text-subtle tabular">
                  <span>↑ {fmtNum(p.upvotes)}</span>
                  <span>💬 {fmtNum(p.comments)}</span>
                  {p.views != null && <span>▶ {fmtNum(p.views)}</span>}
                  <Pill
                    tone={
                      p.sentiment === "positive"
                        ? "success"
                        : p.sentiment === "negative"
                          ? "danger"
                          : "muted"
                    }
                  >
                    {p.sentiment === "positive"
                      ? "正面"
                      : p.sentiment === "negative"
                        ? "负面"
                        : "中性"}
                  </Pill>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </CardSection>
    </Card>
  );
}
