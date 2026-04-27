import { GameCard } from "@/components/dashboard/GameCard";
import { GAMES, getRedditSubFor, detectAnomalies } from "@/lib/games";
import { fetchSubreddit } from "@/lib/reddit";
import { fmtDateLong } from "@/lib/format";

export const revalidate = 300;

export default async function Home() {
  const today = new Date().toISOString().slice(0, 10);

  const cards = await Promise.all(
    GAMES.map(async (game) => {
      const sub = getRedditSubFor(game);
      const snap = sub
        ? await fetchSubreddit(sub)
        : null;
      const anomalies = snap ? detectAnomalies(snap) : [];
      return { game, snap, anomalies };
    }),
  );

  const totalAlerts = cards.reduce(
    (acc, c) => acc + c.anomalies.filter((a) => a.level !== "info").length,
    0,
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-1">
        <p className="text-xs text-subtle">{fmtDateLong(today)}</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          今日看板
        </h1>
        <p className="text-sm text-muted mt-1">
          {totalAlerts > 0
            ? `${totalAlerts} 个异常信号待关注 · 监控 ${GAMES.length} 款游戏`
            : `一切平稳 · 监控 ${GAMES.length} 款游戏`}
        </p>
        <p className="text-[11px] text-subtle mt-1">
          数据来源：Reddit 公共 API · 5 分钟刷新
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {cards.map(({ game, snap, anomalies }) => (
          <GameCard
            key={game.id}
            game={game}
            snapshot={snap}
            anomalies={anomalies}
          />
        ))}
      </section>
    </div>
  );
}
