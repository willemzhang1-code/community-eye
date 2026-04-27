import { SettingsView } from "@/components/settings/SettingsView";
import { MOCK_GAMES } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          游戏档案
        </h1>
        <p className="text-sm text-muted mt-1">
          每款游戏拥有独立档案。系统按档案中的基线和规则判断异常，不套用统一公式。
        </p>
      </header>
      <SettingsView games={MOCK_GAMES} />
    </div>
  );
}
