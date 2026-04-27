import { GameCard } from "@/components/dashboard/GameCard";
import {
  MOCK_GAMES,
  getMetricsForGame,
  getAnomalies,
} from "@/lib/mock-data";
import { fmtDateLong } from "@/lib/format";

export default function Home() {
  const today = new Date().toISOString().slice(0, 10);
  const cards = MOCK_GAMES.map((game) => {
    const metrics = getMetricsForGame(game.id);
    const anomalies = getAnomalies(game, metrics);
    return { game, metrics, anomalies };
  });

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
            ? `${totalAlerts} 个异常信号待关注 · 监控 ${MOCK_GAMES.length} 款游戏`
            : `一切平稳 · 监控 ${MOCK_GAMES.length} 款游戏`}
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {cards.map(({ game, metrics, anomalies }) => (
          <GameCard
            key={game.id}
            game={game}
            metrics={metrics}
            anomalies={anomalies}
          />
        ))}
      </section>
    </div>
  );
}
