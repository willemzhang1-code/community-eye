"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { DailyMetric } from "@/lib/types";
import { fmtDate } from "@/lib/format";

interface Props {
  metrics: DailyMetric[];
  baseline?: number;
}

export function SentimentChart({ metrics, baseline }: Props) {
  const data = metrics.map((m) => ({
    date: fmtDate(m.date),
    sentiment: Number(m.sentiment_score.toFixed(3)),
  }));

  return (
    <div className="w-full h-56">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            domain={[-1, 1]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => v.toFixed(1)}
            width={36}
          />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <ReferenceLine
            y={0}
            stroke="var(--border-strong)"
            strokeDasharray="2 4"
          />
          {baseline != null && (
            <ReferenceLine
              y={baseline}
              stroke="var(--chart-2)"
              strokeDasharray="3 3"
              label={{
                value: "基线",
                position: "right",
                fill: "var(--chart-2)",
                fontSize: 10,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="sentiment"
            name="情绪"
            stroke="var(--chart-2)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
