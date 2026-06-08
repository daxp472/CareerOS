import { PageHeader } from "@/components/page-header";
import { Card, Button } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage CareerOS preferences, API connection details, theme, and session state." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Application settings</h3>
          <p className="mt-2 text-sm text-slate-400">Frontend API base: NEXT_PUBLIC_API_URL</p>
          <p className="mt-2 text-sm text-slate-400">Theme: dark mode enabled</p>
          <p className="mt-2 text-sm text-slate-400">Notifications: browser-to-toast system</p>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Maintenance</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button className="bg-white/10 text-slate-100 hover:bg-white/15">Export data</Button>
            <Button className="bg-white/10 text-slate-100 hover:bg-white/15">Clear cache</Button>
            <Button className="bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">Sync session</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
