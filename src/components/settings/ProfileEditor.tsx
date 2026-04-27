"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { Card, CardSection } from "@/components/ui/Card";
import type {
  Game,
  GameProfile,
  CommunityChannel,
  Platform,
  SignalRule,
  SignalMetric,
} from "@/lib/types";

const STEPS = [
  { key: "basics", label: "基础" },
  { key: "community", label: "社区" },
  { key: "culture", label: "文化" },
  { key: "signals", label: "信号" },
  { key: "competitors", label: "竞品" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

const PLATFORMS: Platform[] = [
  "reddit",
  "youtube",
  "x",
  "discord",
  "bilibili",
  "tieba",
  "steam",
];

const platformLabel: Record<Platform, string> = {
  reddit: "Reddit",
  youtube: "YouTube",
  x: "X / Twitter",
  discord: "Discord",
  bilibili: "Bilibili",
  tieba: "贴吧",
  steam: "Steam",
};

const METRIC_OPTIONS: { v: SignalMetric; label: string }[] = [
  { v: "reddit_posts", label: "Reddit 帖子数" },
  { v: "reddit_avg_upvotes", label: "Reddit 平均点赞" },
  { v: "youtube_videos", label: "YouTube 视频数" },
  { v: "x_mentions", label: "X 提及" },
  { v: "steam_concurrent", label: "Steam 在线" },
  { v: "discord_members", label: "Discord 成员" },
  { v: "sentiment_score", label: "情绪分值" },
];

const COMPARATOR_OPTIONS = [
  { v: "gte", label: "≥" },
  { v: "lte", label: "≤" },
  { v: "delta_pct_gte", label: "Δ% ≥" },
  { v: "delta_pct_lte", label: "Δ% ≤" },
] as const;

interface Props {
  game: Game;
}

export function ProfileEditor({ game }: Props) {
  const [step, setStep] = useState<StepKey>("basics");
  const [draft, setDraft] = useState<GameProfile>(() =>
    structuredClone(game.profile),
  );
  const [dirty, setDirty] = useState(false);

  const completion = useMemo(() => computeCompletion(draft), [draft]);

  function patch<K extends keyof GameProfile>(k: K, v: GameProfile[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {game.emoji} {game.name}
          </h2>
          <p className="text-xs text-subtle mt-1">
            档案完整度 · {completion}%
          </p>
        </div>
        {dirty && (
          <button
            className="px-4 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
            onClick={() => {
              alert("演示版：仅本地保存。接入 Supabase 后将实际写入。");
              setDirty(false);
            }}
          >
            保存档案
          </button>
        )}
      </div>

      <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="inline-flex p-1 rounded-full bg-foreground/[.05] hairline">
          {STEPS.map((s) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className={clsx(
                "px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                step === s.key
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {step === "basics" && (
        <BasicsStep
          value={draft}
          onChange={(b) => patch("basics", b)}
          onKeywordsChange={(k) => patch("keywords", k)}
        />
      )}
      {step === "community" && (
        <CommunityStep
          value={draft.community}
          onChange={(c) => patch("community", c)}
        />
      )}
      {step === "culture" && (
        <CultureStep
          value={draft.culture}
          onChange={(c) => patch("culture", c)}
        />
      )}
      {step === "signals" && (
        <SignalsStep
          value={draft.signals}
          onChange={(s) => patch("signals", s)}
        />
      )}
      {step === "competitors" && (
        <CompetitorsStep
          value={draft.competitors}
          onChange={(c) => patch("competitors", c)}
        />
      )}
    </div>
  );
}

function computeCompletion(p: GameProfile): number {
  let score = 0;
  let total = 0;
  const checks: boolean[] = [
    !!p.basics.developer,
    !!p.basics.genre,
    p.basics.platforms.length > 0,
    p.basics.regions.length > 0,
    p.community.length > 0,
    p.community.some((c) => c.is_primary),
    p.culture.slang.length > 0,
    p.culture.history.length > 0,
    p.signals.rules.length > 0,
    Object.keys(p.signals.baselines).length > 0,
    p.competitors.length > 0,
    p.keywords.length > 0,
  ];
  for (const c of checks) {
    total++;
    if (c) score++;
  }
  return Math.round((score / total) * 100);
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-wide text-subtle mb-1.5">
        {label}
      </div>
      {children}
      {hint && <div className="text-[11px] text-subtle mt-1">{hint}</div>}
    </label>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-xl bg-foreground/[.04] hairline border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-surface placeholder:text-subtle";

function BasicsStep({
  value,
  onChange,
  onKeywordsChange,
}: {
  value: GameProfile;
  onChange: (b: GameProfile["basics"]) => void;
  onKeywordsChange: (k: string[]) => void;
}) {
  const b = value.basics;
  return (
    <Card>
      <CardSection className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="开发商">
            <input
              className={inputCls}
              value={b.developer}
              onChange={(e) => onChange({ ...b, developer: e.target.value })}
            />
          </Field>
          <Field label="发行商">
            <input
              className={inputCls}
              value={b.publisher ?? ""}
              onChange={(e) => onChange({ ...b, publisher: e.target.value })}
            />
          </Field>
          <Field label="类型">
            <select
              className={inputCls}
              value={b.genre}
              onChange={(e) =>
                onChange({ ...b, genre: e.target.value as typeof b.genre })
              }
            >
              {[
                "MMORPG",
                "Gacha",
                "ARPG",
                "Shooter",
                "Strategy",
                "Roguelike",
                "Survival",
                "Other",
              ].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
          <Field label="生命周期">
            <select
              className={inputCls}
              value={b.lifecycle}
              onChange={(e) =>
                onChange({
                  ...b,
                  lifecycle: e.target.value as typeof b.lifecycle,
                })
              }
            >
              {[
                "pre-announce",
                "announced",
                "closed-beta",
                "open-beta",
                "soft-launch",
                "live",
                "sunset",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="上线日期">
            <input
              type="date"
              className={inputCls}
              value={b.launch_date ?? ""}
              onChange={(e) => onChange({ ...b, launch_date: e.target.value })}
            />
          </Field>
        </div>
        <Field label="平台" hint="多选">
          <div className="flex flex-wrap gap-2">
            {(["PC", "iOS", "Android", "PS5", "Xbox", "Switch", "Web"] as const).map(
              (p) => {
                const on = b.platforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    className={clsx(
                      "px-3 py-1.5 rounded-full text-xs font-medium hairline border transition-colors",
                      on
                        ? "bg-accent text-white border-accent"
                        : "bg-surface text-muted hover:text-foreground",
                    )}
                    onClick={() =>
                      onChange({
                        ...b,
                        platforms: on
                          ? b.platforms.filter((x) => x !== p)
                          : [...b.platforms, p],
                      })
                    }
                  >
                    {p}
                  </button>
                );
              },
            )}
          </div>
        </Field>
        <Field label="发行地区" hint="多选">
          <div className="flex flex-wrap gap-2">
            {(["CN", "JP", "KR", "SEA", "NA", "EU", "Global"] as const).map(
              (r) => {
                const on = b.regions.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    className={clsx(
                      "px-3 py-1.5 rounded-full text-xs font-medium hairline border transition-colors",
                      on
                        ? "bg-accent text-white border-accent"
                        : "bg-surface text-muted hover:text-foreground",
                    )}
                    onClick={() =>
                      onChange({
                        ...b,
                        regions: on
                          ? b.regions.filter((x) => x !== r)
                          : [...b.regions, r],
                      })
                    }
                  >
                    {r}
                  </button>
                );
              },
            )}
          </div>
        </Field>
        <Field label="关键词" hint="逗号分隔，用于跨平台抓取">
          <input
            className={inputCls}
            value={value.keywords.join(", ")}
            onChange={(e) =>
              onKeywordsChange(
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
      </CardSection>
    </Card>
  );
}

function CommunityStep({
  value,
  onChange,
}: {
  value: CommunityChannel[];
  onChange: (c: CommunityChannel[]) => void;
}) {
  function update(i: number, patch: Partial<CommunityChannel>) {
    onChange(value.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([
      ...value,
      { platform: "reddit", handle: "", is_primary: false },
    ]);
  }

  return (
    <Card>
      <CardSection className="space-y-4">
        {value.length === 0 && (
          <p className="text-sm text-subtle">尚未配置社区渠道</p>
        )}
        {value.map((c, i) => (
          <div
            key={i}
            className="rounded-2xl hairline border bg-foreground/[.02] p-4 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="平台">
                <select
                  className={inputCls}
                  value={c.platform}
                  onChange={(e) =>
                    update(i, { platform: e.target.value as Platform })
                  }
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {platformLabel[p]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="频道 / 句柄">
                <input
                  className={inputCls}
                  value={c.handle}
                  placeholder="r/StarResonance"
                  onChange={(e) => update(i, { handle: e.target.value })}
                />
              </Field>
              <Field label="规模 (订阅 / 成员)">
                <input
                  type="number"
                  className={inputCls}
                  value={c.size ?? ""}
                  onChange={(e) =>
                    update(i, {
                      size: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </Field>
              <Field label="URL">
                <input
                  className={inputCls}
                  value={c.url ?? ""}
                  onChange={(e) => update(i, { url: e.target.value })}
                />
              </Field>
              <Field label="日均帖子基线">
                <input
                  type="number"
                  className={inputCls}
                  value={c.baseline_daily_posts ?? ""}
                  onChange={(e) =>
                    update(i, {
                      baseline_daily_posts: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </Field>
              <Field label="主社区">
                <button
                  type="button"
                  className={clsx(
                    "w-full px-3 py-2 rounded-xl text-sm font-medium border hairline",
                    c.is_primary
                      ? "bg-accent text-white border-accent"
                      : "bg-surface text-muted",
                  )}
                  onClick={() => update(i, { is_primary: !c.is_primary })}
                >
                  {c.is_primary ? "✓ 主社区" : "标记为主"}
                </button>
              </Field>
            </div>
            <Field label="备注">
              <input
                className={inputCls}
                value={c.notes ?? ""}
                onChange={(e) => update(i, { notes: e.target.value })}
              />
            </Field>
            <div className="flex justify-end">
              <button
                onClick={() => remove(i)}
                className="text-xs text-danger hover:underline"
              >
                删除渠道
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={add}
          className="w-full py-3 rounded-2xl border border-dashed hairline text-sm text-muted hover:text-foreground hover:bg-foreground/[.04] transition-colors"
        >
          + 添加社区渠道
        </button>
      </CardSection>
    </Card>
  );
}

function CultureStep({
  value,
  onChange,
}: {
  value: GameProfile["culture"];
  onChange: (c: GameProfile["culture"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardSection className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">俚语 / 黑话</h3>
            <button
              className="text-xs text-accent hover:underline"
              onClick={() =>
                onChange({
                  ...value,
                  slang: [...value.slang, { term: "", meaning: "" }],
                })
              }
            >
              + 添加
            </button>
          </div>
          {value.slang.map((s, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                className={inputCls + " sm:col-span-1"}
                value={s.term}
                placeholder="术语"
                onChange={(e) => {
                  const next = [...value.slang];
                  next[i] = { ...next[i], term: e.target.value };
                  onChange({ ...value, slang: next });
                }}
              />
              <input
                className={inputCls + " sm:col-span-2"}
                value={s.meaning}
                placeholder="含义"
                onChange={(e) => {
                  const next = [...value.slang];
                  next[i] = { ...next[i], meaning: e.target.value };
                  onChange({ ...value, slang: next });
                }}
              />
            </div>
          ))}
        </CardSection>
      </Card>

      <Card>
        <CardSection className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">重大事件</h3>
            <button
              className="text-xs text-accent hover:underline"
              onClick={() =>
                onChange({
                  ...value,
                  history: [
                    ...value.history,
                    { date: "", event: "", impact: "medium" },
                  ],
                })
              }
            >
              + 添加
            </button>
          </div>
          {value.history.map((h, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-6 gap-2">
              <input
                type="date"
                className={inputCls + " sm:col-span-2"}
                value={h.date}
                onChange={(e) => {
                  const next = [...value.history];
                  next[i] = { ...next[i], date: e.target.value };
                  onChange({ ...value, history: next });
                }}
              />
              <input
                className={inputCls + " sm:col-span-3"}
                value={h.event}
                placeholder="事件"
                onChange={(e) => {
                  const next = [...value.history];
                  next[i] = { ...next[i], event: e.target.value };
                  onChange({ ...value, history: next });
                }}
              />
              <select
                className={inputCls + " sm:col-span-1"}
                value={h.impact}
                onChange={(e) => {
                  const next = [...value.history];
                  next[i] = {
                    ...next[i],
                    impact: e.target.value as "low" | "medium" | "high",
                  };
                  onChange({ ...value, history: next });
                }}
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
          ))}
        </CardSection>
      </Card>

      <Card>
        <CardSection className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">争议话题</h3>
            <button
              className="text-xs text-accent hover:underline"
              onClick={() =>
                onChange({
                  ...value,
                  controversies: [
                    ...value.controversies,
                    { topic: "", status: "active", summary: "" },
                  ],
                })
              }
            >
              + 添加
            </button>
          </div>
          {value.controversies.map((c, i) => (
            <div key={i} className="space-y-2 rounded-xl bg-foreground/[.02] hairline border p-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  className={inputCls + " sm:col-span-2"}
                  value={c.topic}
                  placeholder="话题"
                  onChange={(e) => {
                    const next = [...value.controversies];
                    next[i] = { ...next[i], topic: e.target.value };
                    onChange({ ...value, controversies: next });
                  }}
                />
                <select
                  className={inputCls}
                  value={c.status}
                  onChange={(e) => {
                    const next = [...value.controversies];
                    next[i] = {
                      ...next[i],
                      status: e.target.value as "active" | "resolved",
                    };
                    onChange({ ...value, controversies: next });
                  }}
                >
                  <option value="active">进行中</option>
                  <option value="resolved">已平息</option>
                </select>
              </div>
              <textarea
                className={inputCls + " min-h-[60px]"}
                value={c.summary}
                placeholder="简述"
                onChange={(e) => {
                  const next = [...value.controversies];
                  next[i] = { ...next[i], summary: e.target.value };
                  onChange({ ...value, controversies: next });
                }}
              />
            </div>
          ))}
        </CardSection>
      </Card>
    </div>
  );
}

function SignalsStep({
  value,
  onChange,
}: {
  value: GameProfile["signals"];
  onChange: (s: GameProfile["signals"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardSection>
          <h3 className="text-sm font-semibold mb-3">基线值</h3>
          <p className="text-xs text-subtle mb-3">
            告诉系统什么是「正常」。每个游戏的基线不同，不要套用统一公式。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                ["reddit_posts_daily", "Reddit 日均帖"],
                ["reddit_upvotes_avg", "平均点赞"],
                ["youtube_videos_daily", "YouTube 日均视频"],
                ["x_mentions_daily", "X 日均提及"],
                ["sentiment_baseline", "情绪基线 (-1 ~ 1)"],
                ["discord_members", "Discord 成员"],
                ["steam_concurrent", "Steam 在线"],
              ] as const
            ).map(([k, label]) => (
              <Field key={k} label={label}>
                <input
                  type="number"
                  step="any"
                  className={inputCls}
                  value={(value.baselines[k] as number | undefined) ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      baselines: {
                        ...value.baselines,
                        [k]: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      },
                    })
                  }
                />
              </Field>
            ))}
          </div>
        </CardSection>
      </Card>

      <Card>
        <CardSection className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">异常规则</h3>
            <button
              className="text-xs text-accent hover:underline"
              onClick={() =>
                onChange({
                  ...value,
                  rules: [
                    ...value.rules,
                    {
                      metric: "reddit_posts",
                      comparator: "gte",
                      value: 0,
                      severity: "info",
                      label: "新规则",
                    },
                  ],
                })
              }
            >
              + 添加规则
            </button>
          </div>
          {value.rules.map((r, i) => (
            <RuleRow
              key={i}
              rule={r}
              onChange={(next) => {
                const arr = [...value.rules];
                arr[i] = next;
                onChange({ ...value, rules: arr });
              }}
              onDelete={() =>
                onChange({
                  ...value,
                  rules: value.rules.filter((_, idx) => idx !== i),
                })
              }
            />
          ))}
        </CardSection>
      </Card>
    </div>
  );
}

function RuleRow({
  rule,
  onChange,
  onDelete,
}: {
  rule: SignalRule;
  onChange: (r: SignalRule) => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl bg-foreground/[.02] hairline border p-3 space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <select
          className={inputCls + " sm:col-span-2"}
          value={rule.metric}
          onChange={(e) =>
            onChange({ ...rule, metric: e.target.value as SignalMetric })
          }
        >
          {METRIC_OPTIONS.map((o) => (
            <option key={o.v} value={o.v}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className={inputCls}
          value={rule.comparator}
          onChange={(e) =>
            onChange({
              ...rule,
              comparator: e.target.value as SignalRule["comparator"],
            })
          }
        >
          {COMPARATOR_OPTIONS.map((c) => (
            <option key={c.v} value={c.v}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="any"
          className={inputCls}
          value={rule.value}
          onChange={(e) => onChange({ ...rule, value: Number(e.target.value) })}
        />
        <select
          className={inputCls}
          value={rule.severity}
          onChange={(e) =>
            onChange({
              ...rule,
              severity: e.target.value as SignalRule["severity"],
            })
          }
        >
          <option value="info">信号</option>
          <option value="warn">警告</option>
          <option value="alert">异常</option>
        </select>
      </div>
      <input
        className={inputCls}
        placeholder="标签（在卡片上显示）"
        value={rule.label}
        onChange={(e) => onChange({ ...rule, label: e.target.value })}
      />
      <div className="flex justify-end">
        <button
          onClick={onDelete}
          className="text-xs text-danger hover:underline"
        >
          删除
        </button>
      </div>
    </div>
  );
}

function CompetitorsStep({
  value,
  onChange,
}: {
  value: GameProfile["competitors"];
  onChange: (c: GameProfile["competitors"]) => void;
}) {
  return (
    <Card>
      <CardSection className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">竞品</h3>
          <button
            className="text-xs text-accent hover:underline"
            onClick={() =>
              onChange([...value, { name: "", relation: "direct" }])
            }
          >
            + 添加竞品
          </button>
        </div>
        {value.map((c, i) => (
          <div
            key={i}
            className="rounded-xl bg-foreground/[.02] hairline border p-3 space-y-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
              <input
                className={inputCls + " sm:col-span-3"}
                value={c.name}
                placeholder="竞品名"
                onChange={(e) => {
                  const next = [...value];
                  next[i] = { ...next[i], name: e.target.value };
                  onChange(next);
                }}
              />
              <select
                className={inputCls + " sm:col-span-1"}
                value={c.relation}
                onChange={(e) => {
                  const next = [...value];
                  next[i] = {
                    ...next[i],
                    relation: e.target.value as "direct" | "indirect",
                  };
                  onChange(next);
                }}
              >
                <option value="direct">直接</option>
                <option value="indirect">间接</option>
              </select>
              <input
                type="number"
                className={inputCls + " sm:col-span-2"}
                placeholder="重叠 %"
                value={c.overlap_pct ?? ""}
                onChange={(e) => {
                  const next = [...value];
                  next[i] = {
                    ...next[i],
                    overlap_pct: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  };
                  onChange(next);
                }}
              />
            </div>
            <input
              className={inputCls}
              placeholder="备注"
              value={c.notes ?? ""}
              onChange={(e) => {
                const next = [...value];
                next[i] = { ...next[i], notes: e.target.value };
                onChange(next);
              }}
            />
            <div className="flex justify-end">
              <button
                className="text-xs text-danger hover:underline"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              >
                删除
              </button>
            </div>
          </div>
        ))}
        {value.length === 0 && (
          <p className="text-sm text-subtle">尚未添加竞品</p>
        )}
      </CardSection>
    </Card>
  );
}

