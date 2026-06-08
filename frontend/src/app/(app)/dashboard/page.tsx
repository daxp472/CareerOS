import { ArrowRight, BellRing, CheckCircle2, FileText, Target, Trophy, Workflow } from "lucide-react";
import Link from "next/link";
import { OverviewCharts } from "@/components/overview-charts";
import { ModuleCard } from "@/components/module-card";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui";
import { analyticsSeries, dashboardActivities, dashboardReminders, dashboardStats, goalList, skillList } from "@/lib/app-data";
import { quickActions } from "@/lib/navigation";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your personal career command center for applications, reminders, skills, goals, interview notes, and progress tracking."
        actionLabel="Add application"
        secondaryLabel="Open reminders"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <ModuleCard key={item.label} title={item.label} value={item.value} caption={item.delta} tone={`bg-gradient-to-br ${item.tone}`} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <OverviewCharts data={analyticsSeries} />
        <Card className="border-white/10 bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Quick actions</p>
              <h3 className="text-xl font-semibold text-white">Command shortcuts</h3>
            </div>
            <Workflow className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:bg-white/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{action.label}</p>
                    <p className="text-xs text-slate-400">Open module</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-500" />
                </Link>
              );
            })}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="border-white/10 bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70">Upcoming reminders</p>
              <h3 className="text-xl font-semibold text-white">Do not miss these</h3>
            </div>
            <BellRing className="h-5 w-5 text-amber-300" />
          </div>
          <div className="space-y-3">
            {dashboardReminders.map((reminder) => (
              <div key={reminder.title} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                <p className="font-medium text-white">{reminder.title}</p>
                <p className="mt-1 text-sm text-slate-400">{reminder.dueDate}</p>
                <p className="mt-1 text-xs text-amber-200/80">Priority: {reminder.priority} · {reminder.status}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">Recent activity</p>
              <h3 className="text-xl font-semibold text-white">Timeline</h3>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
          </div>
          <div className="space-y-3">
            {dashboardActivities.map((activity) => (
              <div key={activity} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-200">
                {activity}
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/70">Progress</p>
              <h3 className="text-xl font-semibold text-white">Goals and skills</h3>
            </div>
            <Target className="h-5 w-5 text-fuchsia-300" />
          </div>
          <div className="space-y-4">
            {goalList.slice(0, 2).map((goal) => (
              <div key={goal.title}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-white">{goal.title}</span>
                  <span className="text-slate-400">{goal.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400" style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            ))}
            {skillList.slice(0, 2).map((skill) => (
              <div key={skill.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-white">{skill.name}</span>
                  <span className="text-slate-400">{skill.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-fuchsia-300 to-pink-400" style={{ width: `${skill.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
