"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Card, CardSection } from "@/components/ui/Card";
import { ProfileEditor } from "./ProfileEditor";
import type { Game } from "@/lib/types";

interface Props {
  games: Game[];
}

export function SettingsView({ games }: Props) {
  const [activeId, setActiveId] = useState<string>(games[0]?.id ?? "");

  const game = games.find((g) => g.id === activeId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 sm:gap-8">
      <aside>
        <Card>
          <CardSection className="!p-2 space-y-1">
            {games.map((g) => (
              <button
                key={g.id}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors",
                  activeId === g.id
                    ? "bg-foreground/[.06] text-foreground"
                    : "text-muted hover:text-foreground hover:bg-foreground/[.04]",
                )}
                onClick={() => setActiveId(g.id)}
              >
                <span className="text-xl">{g.emoji}</span>
                <span className="flex-1 truncate">{g.name}</span>
              </button>
            ))}
            <button
              onClick={() =>
                alert(
                  "演示版：新增游戏档案需引导填写完整结构（基础 → 社区 → 文化 → 信号 → 竞品）。",
                )
              }
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-accent hover:bg-accent/10 transition-colors"
            >
              <span className="text-xl">＋</span>
              <span>新增游戏档案</span>
            </button>
          </CardSection>
        </Card>

        <p className="text-[11px] text-subtle mt-3 px-1 leading-relaxed">
          每款游戏使用独立档案，包括基础信息、社区地图、文化语境、信号模型、竞品关系。系统不套用统一公式。
        </p>
      </aside>

      {game && <ProfileEditor key={game.id} game={game} />}
    </div>
  );
}
