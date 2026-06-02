"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, Button, Input, Textarea } from "@/components/ui";
import { goalList } from "@/lib/app-data";

export default function GoalsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", progressPercentage: "0", status: "NOT_STARTED", targetDate: "" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await api.createGoal({
        title: form.title,
        description: form.description,
        progressPercentage: Number(form.progressPercentage),
        status: form.status,
        targetDate: form.targetDate || undefined,
      });
      toast.success("Goal saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save goal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Career Goals" description="Set measurable targets for your placement journey and keep each goal visible." actionLabel="Add goal" />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Goal progress</h3>
          <div className="mt-4 space-y-4">
            {goalList.map((goal) => (
              <div key={goal.title} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white">{goal.title}</span>
                  <span className="text-slate-400">{goal.progress}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-fuchsia-300 to-pink-400" style={{ width: `${goal.progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-400">Status: {goal.status} · Target: {goal.targetDate}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Add goal</h3>
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <Input placeholder="Goal title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <Input placeholder="Progress percentage" value={form.progressPercentage} onChange={(event) => setForm({ ...form, progressPercentage: event.target.value })} />
            <Input placeholder="Status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} />
            <Input type="date" value={form.targetDate} onChange={(event) => setForm({ ...form, targetDate: event.target.value })} />
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">{loading ? "Saving..." : "Save goal"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
