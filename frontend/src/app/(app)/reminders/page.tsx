"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, Button, Input, Textarea } from "@/components/ui";
import { dashboardReminders } from "@/lib/app-data";

export default function RemindersPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", priority: "MEDIUM", status: "PENDING", reminderType: "CUSTOM" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await api.createReminder({
        title: form.title,
        description: form.description,
        dueDate: form.dueDate || undefined,
        priority: form.priority,
        status: form.status,
        reminderType: form.reminderType,
      });
      toast.success("Reminder created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save reminder");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Reminders" description="Track OA dates, interview dates, deadlines, follow-ups, and custom tasks from one place." actionLabel="Add reminder" />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Upcoming reminders</h3>
          <div className="mt-4 space-y-3">
            {dashboardReminders.map((reminder) => (
              <div key={reminder.title} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-300">
                <p className="font-medium text-white">{reminder.title}</p>
                <p className="mt-1">Due: {reminder.dueDate}</p>
                <p className="mt-1">Priority: {reminder.priority} · {reminder.status}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Create reminder</h3>
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <Input placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <Input type="datetime-local" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
            <Input placeholder="Priority" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} />
            <Input placeholder="Status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} />
            <Input placeholder="Type" value={form.reminderType} onChange={(event) => setForm({ ...form, reminderType: event.target.value })} />
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">{loading ? "Saving..." : "Save reminder"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
