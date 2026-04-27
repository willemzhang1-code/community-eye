import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { fmtNum } from "@/lib/format";
import type { Game, AnomalySignal } from "@/lib/types";
import type { SubredditSnapshot } from "@/lib/reddit";

interface Props {
  game: Game;
  snapshot: SubredditSnapshot | null;
  anomalies: AnomalySignal[];
}

const lifecycleLabel: Record<string, string> = {
  "pre-announce": "预公布",
  announced: "已公布",
  "closed-beta": "闭测",
  "open-beta": "公测",
  "soft-launch": "软启",
  live: "在运",
  sunset: "停运",
};

export function GameCard({ game, snapshot, anomalies }: Props) {
  const topSignal =
    anomalies.find((a) => a.level === "alert") ??
    anomalies.find((a) => a.level === "warn") ??
    anomalies[0];

  return (
    <Link href={`/games/${game.slug}`} className="block">
      <Card className="hover-lift overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{
                  background: `${game.accent_color ?? "#0071e3"}1a`,
                }}
              >
                <span>{game.emoji ?? "🎮"}</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold tracking-tight text-[17px] truncate">
                  {game.name}
                </h3>
                <p className="text-xs text-subtle mt-0.5">
                  {game.profile.basics.developer} ·{" "}
                  {game.profile.basics.genre} ·{" "}
                  {lifecycleLabel[game.profile.basics.lifecycle] ?? "—"}
                </p>
              </div>
            </div>
            {snapshot?.error ? (
              <Pill tone="danger">抓取失败</Pill>
            ) : topSignal ? (
              <Pill
                tone={
                  topSignal.level === "alert"
                    ? "danger"
                    : topSignal.level === "warn"
                      ? "warning"
                      : "accent"
                }
              >
                {topSignal.level === "alert"
                  ? "异常"
                  : topSignal.level === "warn"
                    ? "警告"
                    : "信号"}
              </Pill>
            ) : (
              <Pill tone="success">正常</Pill>
            )}
          </div>

          {snapshot ? (
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat
                label="Reddit 24h"
                value={fmtNum(snapshot.postsLast24h)}
                hint="新帖"
              />
              <Stat
                label="平均 ups"
                value={
                  snapshot.posts.length
                    ? fmtNum(Math.round(snapshot.avgUpvotes))
                    : "—"
                }
                hint={`抓样 ${snapshot.posts.length}`}
              />
              <Stat
                label="订阅"
                value={
                  snapshot.subscribers != null
                    ? fmtNum(snapshot.subscribers)
                    : "—"
                }
                hint="r/sub"
              />
            </div>
          ) : (
            <div className="mt-5 text-xs text-subtle">未配置 Reddit 频道</div>
          )}

          {anomalies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {anomalies.slice(0, 3).map((a, i) => (
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
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="text-[11px] text-subtle uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold tabular tracking-tight">
        {value}
      </div>
      {hint && (
        <div className="text-[11px] text-subtle tabular mt-0.5">{hint}</div>
      )}
    </div>
  );
}
