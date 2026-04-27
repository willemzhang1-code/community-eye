import { notFound } from "next/navigation";
import Link from "next/link";
import { GameDetailView } from "@/components/game/GameDetailView";
import {
  GAMES,
  getGame,
  getRedditSubFor,
  detectAnomalies,
} from "@/lib/games";
import { fetchSubreddit } from "@/lib/reddit";

export const revalidate = 300;

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  const sub = getRedditSubFor(game);
  const snap = sub ? await fetchSubreddit(sub) : null;
  const anomalies = snap ? detectAnomalies(snap) : [];

  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        返回看板
      </Link>
      <GameDetailView game={game} snapshot={snap} anomalies={anomalies} />
    </div>
  );
}
