"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";
import { AlertTriangle, ArrowRight, BellRing, CalendarCheck, CheckCircle2, Clock, Sparkles, Target, Trophy, Workflow } from "lucide-react";
import { OverviewCharts } from "@/components/overview-charts";
import { ModuleCard } from "@/components/module-card";
import { PageHeader } from "@/components/page-header";
import { Badge, Card } from "@/components/ui";
import { quickActions } from "@/lib/navigation";
import {
  seedIfEmpty,
  getDashboardStats,
  getUpcomingItems,
  getApplications,
  getReminders,
  getGoals,
  getSkills,
  getActivities,
  getInterviews,
  type ApplicationStatus,
  getStageInfo,
} from "@/lib/store";

function formatSmartDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  if (isToday(d)) return `Today, ${format(d, "h:mm a")}`;
  if (isTomorrow(d)) return `Tomorrow, ${format(d, "h:mm a")}`;
  if (isPast(d)) return `${formatDistanceToNow(d)} ago`;
  return format(d, "MMM d, h:mm a");
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedIfEmpty();
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" /></div>;
  }

  const stats = getDashboardStats();
  const upcoming = getUpcomingItems();
  const activities = getActivities().slice(0, 6);
  const goals = getGoals().slice(0, 3);
  const skills = getSkills().slice(0, 3);
  const apps = getApplications();
  const interviews = getInterviews();
  const reminders = getReminders().filter((r) => r.status === "PENDING").slice(0, 4);

  // Chart data from applications (group by month)
  const monthMap: Record<string, { applications: number; offers: number; rejections: number }> = {};
  for (const app of apps) {
    const monthKey = app.applicationDate ? format(new Date(app.applicationDate), "MMM") : "Other";
    if (!monthMap[monthKey]) monthMap[monthKey] = { applications: 0, offers: 0, rejections: 0 };
    monthMap[monthKey].applications++;
    if (app.status === "OFFER_RECEIVED" || app.status === "ACCEPTED") monthMap[monthKey].offers++;
    if (app.status === "REJECTED") monthMap[monthKey].rejections++;
  }
  const chartData = Object.entries(monthMap).map(([month, data]) => ({ month, ...data }));
  if (chartData.length === 0) {
    chartData.push({ month: "Jun", applications: 0, offers: 0, rejections: 0 });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your personal career command center. Never miss an interview, deadline, or opportunity."
        actionHref="/applications/new"
        actionLabel="Add application"
        secondaryHref="/reminders"
        secondaryLabel="Open reminders"
      />

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <ModuleCard key={item.label} title={item.label} value={item.value} caption={item.delta} tone={`bg-gradient-to-br ${item.tone}`} />
        ))}
      </section>

      {/* Upcoming alerts */}
      {upcoming.length > 0 && (
        <section>
          <Card className="border-amber-400/20 bg-amber-500/5">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-300" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70">Don&apos;t miss these</p>
                <h3 className="text-xl font-semibold text-white">Upcoming deadlines &amp; interviews</h3>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {upcoming.slice(0, 4).map((item) => (
                <div key={item.title + item.date} className={`rounded-2xl border p-4 ${item.urgency === "high" ? "border-rose-400/30 bg-rose-500/10" : item.urgency === "medium" ? "border-amber-400/30 bg-amber-500/10" : "border-white/10 bg-slate-950/35"}`}>
                  <div className="flex items-start gap-2">
                    {item.type === "interview" && <CalendarCheck className="mt-0.5 h-4 w-4 text-violet-300 shrink-0" />}
                    {item.type === "reminder" && <BellRing className="mt-0.5 h-4 w-4 text-amber-300 shrink-0" />}
                    {item.type === "deadline" && <Clock className="mt-0.5 h-4 w-4 text-rose-300 shrink-0" />}
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-400 truncate">{item.subtitle}</p>
                      <p className="mt-1 text-xs font-medium text-amber-200">{formatSmartDate(item.date)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Charts + Quick actions */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <OverviewCharts data={chartData} />
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
                <Link key={action.href} href={action.href} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:bg-white/5 hover:border-cyan-400/20">
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

      {/* Bottom grid */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Pending reminders */}
        <Card className="border-white/10 bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70">Pending reminders</p>
              <h3 className="text-xl font-semibold text-white">Stay on track</h3>
            </div>
            <BellRing className="h-5 w-5 text-amber-300" />
          </div>
          <div className="space-y-3">
            {reminders.length === 0 ? (
              <p className="text-sm text-slate-400">No pending reminders. You&apos;re all caught up!</p>
            ) : (
              reminders.map((reminder) => (
                <div key={reminder.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <p className="font-medium text-white">{reminder.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{formatSmartDate(reminder.dueDate)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className={`text-[10px] ${reminder.priority === "HIGH" ? "border-rose-400/30 bg-rose-400/10 text-rose-200" : reminder.priority === "MEDIUM" ? "border-amber-400/30 bg-amber-400/10 text-amber-200" : "border-slate-400/30"}`}>
                      {reminder.priority}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="border-white/10 bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">Recent activity</p>
              <h3 className="text-xl font-semibold text-white">Timeline</h3>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
          </div>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-sm text-slate-400">No activity yet. Start adding applications!</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-cyan-300 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-200">{activity.message}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDistanceToNow(new Date(activity.timestamp))} ago</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Progress */}
        <Card className="border-white/10 bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/70">Progress</p>
              <h3 className="text-xl font-semibold text-white">Goals &amp; skills</h3>
            </div>
            <Target className="h-5 w-5 text-fuchsia-300" />
          </div>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-white">{goal.title}</span>
                  <span className="text-slate-400">{goal.progressPercentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 transition-all duration-500" style={{ width: `${goal.progressPercentage}%` }} />
                </div>
              </div>
            ))}
            {skills.map((skill) => (
              <div key={skill.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-white">{skill.skillName}</span>
                  <span className="text-slate-400">{skill.progressPercentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-fuchsia-300 to-pink-400 transition-all duration-500" style={{ width: `${skill.progressPercentage}%` }} />
                </div>
              </div>
            ))}
            {goals.length === 0 && skills.length === 0 && (
              <p className="text-sm text-slate-400">Add goals and skills to track your progress here.</p>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
