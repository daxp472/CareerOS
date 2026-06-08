import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { OverviewCharts } from "@/components/overview-charts";
import { ModuleCard } from "@/components/module-card";
import { Card } from "@/components/ui";
import { analyticsSeries } from "@/lib/app-data";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Measure your placement journey with monthly trends, offer conversion, rejection rate, and interview conversion." actionLabel="Export analytics" />
      <section className="grid gap-4 md:grid-cols-4">
        <ModuleCard title="Offer conversion" value="18.7%" caption="Selected / total tracked" />
        <ModuleCard title="Rejection rate" value="14.9%" caption="Closed without selection" />
        <ModuleCard title="Interview conversion" value="41.2%" caption="Applications that reached interviews" />
        <ModuleCard title="Monthly trend" value="+32%" caption="Compared to previous month" />
      </section>
      <OverviewCharts data={analyticsSeries} />
      <Card className="border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold text-white">Insights</h3>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"><TrendingUp className="mb-2 h-4 w-4 text-emerald-300" />More interviews are converting from OA-cleared roles.</div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"><TrendingDown className="mb-2 h-4 w-4 text-rose-300" />Rejections drop when follow-up reminders are active.</div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">Focus on backend + system design roles to increase offer probability.</div>
        </div>
      </Card>
    </div>
  );
}
