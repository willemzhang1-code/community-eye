import { Card, CardSection } from "@/components/ui/Card";

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

      <Card>
        <CardSection className="py-12 text-center">
          <div className="text-sm font-medium">暂无简报</div>
          <p className="text-xs text-subtle mt-2 max-w-md mx-auto leading-relaxed">
            自动简报生成尚未启用。配置 LLM 摘要管道后，每日抓取的 Reddit 数据会被汇总为邮件简报，并归档在此处。
          </p>
        </CardSection>
      </Card>
    </div>
  );
}
