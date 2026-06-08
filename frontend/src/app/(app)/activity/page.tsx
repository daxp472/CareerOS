import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui";
import { dashboardActivities } from "@/lib/app-data";

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Activity" description="A private timeline of things you changed across CareerOS." />
      <Card className="border-white/10 bg-white/5">
        <div className="space-y-3">
          {dashboardActivities.map((activity, index) => (
            <div key={activity} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
              <div>
                <p className="text-sm text-white">{activity}</p>
                <p className="mt-1 text-xs text-slate-500">{index + 1}m ago</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
