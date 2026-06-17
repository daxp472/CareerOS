"use client";

import { useEffect, useState } from "react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { toast } from "sonner";
import { BellRing, Check, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, Card, Input, Label, Select, Textarea } from "@/components/ui";
import { getReminders, addReminder, updateReminder, deleteReminder, seedIfEmpty, type Reminder } from "@/lib/store";

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", priority: "MEDIUM" as Reminder["priority"], reminderType: "CUSTOM" });
  const [mounted, setMounted] = useState(false);

  function reload() { setReminders(getReminders()); }

  useEffect(() => { seedIfEmpty(); reload(); setMounted(true); }, []);

  if (!mounted) return <div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" /></div>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    addReminder({ ...form, status: "PENDING" });
    setForm({ title: "", description: "", dueDate: "", priority: "MEDIUM", reminderType: "CUSTOM" });
    reload();
    toast.success("Reminder created!");
  }

  function handleComplete(id: string) { updateReminder(id, { status: "COMPLETED" }); reload(); toast.success("Marked complete"); }
  function handleDelete(id: string) { deleteReminder(id); reload(); toast.success("Reminder deleted"); }

  const pending = reminders.filter((r) => r.status === "PENDING").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completed = reminders.filter((r) => r.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <PageHeader title="Reminders" description="Track OA dates, interview prep, deadlines, follow-ups, and custom tasks." />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card className="border-white/10 bg-white/5">
            <div className="flex items-center gap-2 mb-4">
              <BellRing className="h-5 w-5 text-amber-300" />
              <h3 className="text-lg font-semibold text-white">Pending ({pending.length})</h3>
            </div>
            {pending.length === 0 ? (
              <p className="text-sm text-slate-400">All clear! No pending reminders.</p>
            ) : (
              <div className="space-y-3">
                {pending.map((r) => {
                  const overdue = r.dueDate && isPast(new Date(r.dueDate));
                  return (
                    <div key={r.id} className={`rounded-2xl border p-4 text-sm ${overdue ? "border-rose-400/30 bg-rose-500/5" : "border-white/10 bg-slate-950/35"}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-white">{r.title}</p>
                          {r.description && <p className="mt-1 text-slate-400">{r.description}</p>}
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            {r.dueDate && (
                              <span className={`text-xs ${overdue ? "text-rose-300 font-medium" : "text-slate-400"}`}>
                                {overdue ? "⚠️ Overdue" : format(new Date(r.dueDate), "MMM d, h:mm a")}
                              </span>
                            )}
                            <Badge className={`text-[10px] ${r.priority === "HIGH" ? "border-rose-400/30 bg-rose-400/10 text-rose-200" : r.priority === "MEDIUM" ? "border-amber-400/30 bg-amber-400/10 text-amber-200" : "border-slate-400/30"}`}>
                              {r.priority}
                            </Badge>
                            <Badge className="text-[10px]">{r.reminderType}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button onClick={() => handleComplete(r.id)} className="bg-emerald-500/10 border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/20 p-2"><Check className="h-3.5 w-3.5" /></Button>
                          <Button onClick={() => handleDelete(r.id)} className="bg-rose-500/10 border-rose-400/30 text-rose-200 hover:bg-rose-500/20 p-2"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {completed.length > 0 && (
            <Card className="border-white/10 bg-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">Completed ({completed.length})</h3>
              <div className="space-y-3">
                {completed.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm opacity-60">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-white line-through">{r.title}</p>
                        {r.dueDate && <p className="mt-1 text-xs text-slate-500">{format(new Date(r.dueDate), "MMM d, h:mm a")}</p>}
                      </div>
                      <Button onClick={() => handleDelete(r.id)} className="bg-rose-500/10 border-rose-400/30 text-rose-200 hover:bg-rose-500/20 p-2"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <Card className="border-white/10 bg-white/5 h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">Create reminder</h3>
          <form className="space-y-3" onSubmit={submit}>
            <div><Label>Title *</Label><Input placeholder="e.g. PhonePe interview prep" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea placeholder="What do you need to do?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Due date &amp; time</Label><Input type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
            <div><Label>Priority</Label>
              <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Reminder["priority"] })}>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </Select>
            </div>
            <div><Label>Type</Label>
              <Select value={form.reminderType} onChange={(e) => setForm({ ...form, reminderType: e.target.value })}>
                <option value="CUSTOM">Custom</option>
                <option value="INTERVIEW_PREP">Interview Prep</option>
                <option value="DEADLINE">Deadline</option>
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="OA_REMINDER">OA Reminder</option>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">Save reminder</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
