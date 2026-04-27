import Link from "next/link";
import { Card, CardSection } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { MOCK_BRIEFINGS } from "@/lib/mock-data";
import { fmtDateLong } from "@/lib/format";

export default function BriefingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          每日简报
        </h1>
        <p className="text-sm text-muted mt-1">
          每日邮件简报归档，可回溯查看完整内容。
        </p>
      </header>

      <div className="space-y-3">
        {MOCK_BRIEFINGS.map((b) => (
          <Link key={b.id} href={`/briefings/${b.id}`} className="block">
            <Card className="hover-lift">
              <CardSection className="!py-4 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold tabular">
                      {fmtDateLong(b.date)}
                    </span>
                    {b.sent_at ? (
                      <Pill tone="success">已发送</Pill>
                    ) : (
                      <Pill tone="muted">草稿</Pill>
                    )}
                  </div>
                  <ul className="mt-2 space-y-1">
                    {b.highlights.slice(0, 3).map((h, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted flex items-start gap-2"
                      >
                        <span className="text-subtle mt-1">•</span>
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-subtle shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </CardSection>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
