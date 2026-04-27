"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import type { DailyMetric } from "@/lib/types";
import { fmtDate, fmtNum } from "@/lib/format";

type Series = "reddit_posts" | "reddit_avg_upvotes" | "youtube_videos" | "x_mentions";

const SERIES_META: Record<
  Series,
  { label: string; color: string; key: keyof DailyMetric }
> = {
  reddit_posts: {
    label: "Reddit 帖",
    color: "var(--chart-1)",
    key: "reddit_posts",
  },
  reddit_avg_upvotes: {
    label: "平均点赞",
    color: "var(--chart-2)",
    key: "reddit_avg_upvotes",
  },
  youtube_videos: {
    label: "YouTube",
    color: "var(--chart-3)",
    key: "youtube_videos",
  },
  x_mentions: {
    label: "X 提及",
    color: "var(--chart-5)",
    key: "x_mentions",
  },
};

interface Props {
  metrics: DailyMetric[];
  series: Series[];
}

export function TrendChart({ metrics, series }: Props) {
  const data = metrics.map((m) => ({
    date: fmtDate(m.date),
    reddit_posts: m.reddit_posts,
    reddit_avg_upvotes: m.reddit_avg_upvotes,
    youtube_videos: m.youtube_videos,
    x_mentions: m.x_mentions,
  }));

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient
                key={s}
                id={`g-${s}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={SERIES_META[s].color}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={SERIES_META[s].color}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => fmtNum(v)}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
            iconType="circle"
          />
          {series.map((s) => (
            <Area
              key={s}
              type="monotone"
              dataKey={s}
              name={SERIES_META[s].label}
              stroke={SERIES_META[s].color}
              fill={`url(#g-${s})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
