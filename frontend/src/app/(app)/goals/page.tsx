"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, Card, Input, Label, Select, Textarea } from "@/components/ui";
import { getGoals, addGoal, updateGoal, deleteGoal, seedIfEmpty, type Goal } from "@/lib/store";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [form, setForm] = useState({ title: "", description: "", progressPercentage: "0", status: "NOT_STARTED", targetDate: "" });
  const [mounted, setMounted] = useState(false);

  function reload() { setGoals(getGoals()); }
  useEffect(() => { seedIfEmpty(); reload(); setMounted(true); }, []);

  if (!mounted) return <div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" /></div>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Goal title is required"); return; }
    addGoal({ title: form.title, description: form.description, progressPercentage: Number(form.progressPercentage), status: form.status, targetDate: form.targetDate });
    setForm({ title: "", description: "", progressPercentage: "0", status: "NOT_STARTED", targetDate: "" });
    reload();
    toast.success("Goal added!");
  }

  function handleProgressChange(id: string, value: number) {
    const goal = goals.find((g) => g.id === id);
    const status = value >= 100 ? "COMPLETED" : value > 0 ? "IN_PROGRESS" : "NOT_STARTED";
    updateGoal(id, { progressPercentage: Math.min(100, Math.max(0, value)), status });
    reload();
  }

  function handleDelete(id: string) { deleteGoal(id); reload(); toast.success("Goal removed"); }

  return (
    <div className="space-y-6">
      <PageHeader title="Career Goals" description="Set measurable targets for your placement journey and keep each goal visible." />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Goal progress</h3>
          {goals.length === 0 ? (
            <p className="text-sm text-slate-400">No goals set yet. Define your first target!</p>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{goal.title}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[10px] ${goal.status === "COMPLETED" ? "bg-emerald-400/10 text-emerald-200 border-emerald-400/30" : goal.status === "IN_PROGRESS" ? "bg-cyan-400/10 text-cyan-200 border-cyan-400/30" : "border-slate-400/30"}`}>
                        {goal.status.replace("_", " ")}
                      </Badge>
                      <span className="text-sm text-slate-400">{goal.progressPercentage}%</span>
                      <Button onClick={() => handleDelete(goal.id)} className="bg-rose-500/10 border-rose-400/30 text-rose-200 hover:bg-rose-500/20 p-1.5"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                  <div className="mt-2 h-2.5 rounded-full bg-white/10">
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-fuchsia-300 to-pink-400 transition-all duration-500" style={{ width: `${goal.progressPercentage}%` }} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input type="range" min="0" max="100" value={goal.progressPercentage} onChange={(e) => handleProgressChange(goal.id, Number(e.target.value))} className="flex-1 accent-fuchsia-400 h-1" />
                  </div>
                  {goal.description && <p className="mt-1 text-xs text-slate-400">{goal.description}</p>}
                  {goal.targetDate && <p className="mt-1 text-xs text-slate-500">Target: {goal.targetDate}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="border-white/10 bg-white/5 h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">Add goal</h3>
          <form className="space-y-3" onSubmit={submit}>
            <div><Label>Goal title *</Label><Input placeholder="e.g. Solve 300 DSA questions" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea placeholder="What does success look like?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Progress ({form.progressPercentage}%)</Label><input type="range" min="0" max="100" value={form.progressPercentage} onChange={(e) => setForm({ ...form, progressPercentage: e.target.value })} className="w-full accent-fuchsia-400" /></div>
            <div><Label>Target date</Label><Input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} /></div>
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">Save goal</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
