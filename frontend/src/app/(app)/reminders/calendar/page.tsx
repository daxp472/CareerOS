import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui";
import { dashboardReminders } from "@/lib/app-data";

export default function ReminderCalendarPage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      <PageHeader title="Reminder Calendar" description="A lightweight planning view for the next placement actions and deadlines." />
      <Card className="border-white/10 bg-white/5">
        <div className="grid gap-3 md:grid-cols-7">
          {days.map((day) => (
            <div key={day} className="rounded-2xl border border-white/10 bg-slate-950/35 p-3 text-sm text-slate-300">
              <p className="font-medium text-white">{day}</p>
              <div className="mt-3 space-y-2">
                {dashboardReminders.slice(0, 1).map((reminder) => (
                  <div key={reminder.title} className="rounded-xl bg-cyan-400/10 p-2 text-xs text-cyan-100">{reminder.title}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
