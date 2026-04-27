import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardSection } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { MOCK_BRIEFINGS } from "@/lib/mock-data";
import { renderMarkdown } from "@/lib/markdown";
import { fmtDateLong } from "@/lib/format";

export function generateStaticParams() {
  return MOCK_BRIEFINGS.map((b) => ({ id: b.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BriefingDetail({ params }: PageProps) {
  const { id } = await params;
  const briefing = MOCK_BRIEFINGS.find((b) => b.id === id);
  if (!briefing) notFound();

  const html = renderMarkdown(briefing.content_md);

  return (
    <div className="space-y-4">
      <Link
        href="/briefings"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        返回简报列表
      </Link>

      <Card>
        <CardSection>
          <div className="flex items-center gap-2 text-xs text-subtle mb-3">
            <span className="tabular">{fmtDateLong(briefing.date)}</span>
            {briefing.sent_at ? (
              <Pill tone="success">已发送</Pill>
            ) : (
              <Pill tone="muted">草稿</Pill>
            )}
          </div>
          <article
            className="prose-like space-y-1"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </CardSection>
      </Card>
    </div>
  );
}
