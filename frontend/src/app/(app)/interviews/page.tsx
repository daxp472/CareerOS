"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, Card, Input, Label, Select, Textarea } from "@/components/ui";
import { getInterviews, addInterview, deleteInterview, seedIfEmpty, type Interview } from "@/lib/store";

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [form, setForm] = useState({ company: "", round: "", type: "Coding", date: "", feedback: "", applicationId: "" });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  function reload() { setInterviews(getInterviews()); }

  useEffect(() => { seedIfEmpty(); reload(); setMounted(true); }, []);

  if (!mounted) return <div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" /></div>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim() || !form.round.trim()) { toast.error("Company and round are required"); return; }
    addInterview({ ...form, outcome: "Pending", applicationId: form.applicationId });
    setForm({ company: "", round: "", type: "Coding", date: "", feedback: "", applicationId: "" });
    reload();
    toast.success("Interview added!");
  }

  function handleDelete(id: string) { deleteInterview(id); reload(); toast.success("Interview removed"); }

  const pending = interviews.filter((i) => i.outcome === "Pending" || i.outcome === "Scheduled");
  const completed = interviews.filter((i) => i.outcome !== "Pending" && i.outcome !== "Scheduled");

  return (
    <div className="space-y-6">
      <PageHeader title="Interviews" description="Track interview rounds, types, outcomes, and feedback for every company." />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Interview timeline</h3>
          {interviews.length === 0 ? (
            <p className="text-sm text-slate-400">No interviews recorded yet. Add one from the form or from an application detail page.</p>
          ) : (
            <div className="space-y-3">
              {pending.length > 0 && <p className="text-xs uppercase tracking-widest text-amber-300/70">Upcoming</p>}
              {pending.map((item) => (
                <div key={item.id} className="rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4 text-sm text-slate-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white">{item.company} · {item.round}</p>
                      <p className="mt-1">Type: {item.type} · <Badge className="bg-amber-400/10 text-amber-200 border-amber-400/30">{item.outcome}</Badge></p>
                      {item.date && <p className="mt-1 text-slate-400">{format(new Date(item.date), "MMM d, yyyy h:mm a")}</p>}
                      {item.feedback && <p className="mt-1 text-xs text-slate-500 italic">{item.feedback}</p>}
                    </div>
                    <Button onClick={() => handleDelete(item.id)} className="bg-rose-500/10 border-rose-400/30 text-rose-200 hover:bg-rose-500/20 p-2 shrink-0"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
              {completed.length > 0 && <p className="text-xs uppercase tracking-widest text-emerald-300/70 mt-4">Completed</p>}
              {completed.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white">{item.company} · {item.round}</p>
                      <p className="mt-1">Type: {item.type} · <Badge className={item.outcome === "Passed" ? "bg-emerald-400/10 text-emerald-200" : "bg-rose-400/10 text-rose-200"}>{item.outcome}</Badge></p>
                      {item.date && <p className="mt-1 text-slate-400">{format(new Date(item.date), "MMM d, yyyy h:mm a")}</p>}
                      {item.feedback && <p className="mt-1 text-xs text-slate-500 italic">{item.feedback}</p>}
                    </div>
                    <Button onClick={() => handleDelete(item.id)} className="bg-rose-500/10 border-rose-400/30 text-rose-200 hover:bg-rose-500/20 p-2 shrink-0"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Add interview</h3>
          <form className="space-y-3" onSubmit={submit}>
            <div><Label>Company *</Label><Input placeholder="e.g. PhonePe" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div><Label>Round *</Label><Input placeholder="e.g. Round 1, HR, OA" value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} /></div>
            <div><Label>Type</Label>
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="Coding">Coding</option>
                <option value="System Design">System Design</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Online Assessment">Online Assessment</option>
                <option value="Assignment">Assignment</option>
              </Select>
            </div>
            <div><Label>Date &amp; time</Label><Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div><Label>Notes</Label><Textarea placeholder="Any feedback or prep notes..." value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} /></div>
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">Save interview</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
