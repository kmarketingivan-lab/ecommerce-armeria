import { requireAdmin } from "@/lib/auth/helpers";
import { getSettings } from "@/lib/dal/settings";
import { SettingsForm } from "./settings-form";
import type { SiteSetting } from "@/types/database";

export default async function AdminSettingsPage() {
  await requireAdmin();

  let settings: SiteSetting[] = [];
  try {
    settings = await getSettings();
  } catch {
    // Settings may not exist yet
  }

  const settingsMap: Record<string, unknown> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
      <SettingsForm settings={settingsMap} />
    </div>
  );
}
