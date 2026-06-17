"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";
import { getInterviewExperiences, addInterviewExperience, deleteInterviewExperience, seedIfEmpty, type InterviewExperience } from "@/lib/store";

export default function InterviewExperiencesPage() {
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [form, setForm] = useState({ companyName: "", questionsAsked: "", topicsCovered: "", learnings: "", notes: "", interviewDate: "" });
  const [mounted, setMounted] = useState(false);

  function reload() { setExperiences(getInterviewExperiences()); }
  useEffect(() => { seedIfEmpty(); reload(); setMounted(true); }, []);

  if (!mounted) return <div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" /></div>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.companyName.trim()) { toast.error("Company name is required"); return; }
    addInterviewExperience(form);
    setForm({ companyName: "", questionsAsked: "", topicsCovered: "", learnings: "", notes: "", interviewDate: "" });
    reload();
    toast.success("Interview note saved!");
  }

  function handleDelete(id: string) { deleteInterviewExperience(id); reload(); toast.success("Note deleted"); }

  return (
    <div className="space-y-6">
      <PageHeader title="Interview Experience Journal" description="Capture what was asked, what you learned, and how to answer better next time." />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Saved interview notes</h3>
          {experiences.length === 0 ? (
            <p className="text-sm text-slate-400">No interview experiences saved yet.</p>
          ) : (
            <div className="space-y-4">
              {experiences.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-white text-lg">{item.companyName}</p>
                      {item.questionsAsked && <div className="mt-2"><span className="text-xs uppercase tracking-widest text-cyan-300/70">Questions</span><p className="mt-1 text-sm text-slate-300">{item.questionsAsked}</p></div>}
                      {item.topicsCovered && <div className="mt-2"><span className="text-xs uppercase tracking-widest text-violet-300/70">Topics</span><p className="mt-1 text-sm text-slate-400">{item.topicsCovered}</p></div>}
                      {item.learnings && <div className="mt-2"><span className="text-xs uppercase tracking-widest text-emerald-300/70">Learnings</span><p className="mt-1 text-sm text-slate-400">{item.learnings}</p></div>}
                      {item.notes && <p className="mt-2 text-xs text-slate-500 italic">{item.notes}</p>}
                    </div>
                    <Button onClick={() => handleDelete(item.id)} className="bg-rose-500/10 border-rose-400/30 text-rose-200 hover:bg-rose-500/20 p-2 shrink-0"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="border-white/10 bg-white/5 h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">New experience</h3>
          <form className="space-y-3" onSubmit={submit}>
            <div><Label>Company name *</Label><Input placeholder="e.g. PhonePe" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
            <div><Label>Questions asked</Label><Textarea placeholder="What questions were asked?" value={form.questionsAsked} onChange={(e) => setForm({ ...form, questionsAsked: e.target.value })} /></div>
            <div><Label>Topics covered</Label><Textarea placeholder="Main topics: DSA, System Design..." value={form.topicsCovered} onChange={(e) => setForm({ ...form, topicsCovered: e.target.value })} /></div>
            <div><Label>Learnings</Label><Textarea placeholder="What did you learn from this experience?" value={form.learnings} onChange={(e) => setForm({ ...form, learnings: e.target.value })} /></div>
            <div><Label>Notes</Label><Textarea placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <div><Label>Interview date</Label><Input type="datetime-local" value={form.interviewDate} onChange={(e) => setForm({ ...form, interviewDate: e.target.value })} /></div>
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">Save note</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
