"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, Card, Input, Label, Select, Textarea } from "@/components/ui";
import { getQuestions, addQuestion, deleteQuestion, seedIfEmpty, type QuestionEntry } from "@/lib/store";

export default function CompanyQuestionBankPage() {
  const [questions, setQuestions] = useState<QuestionEntry[]>([]);
  const [form, setForm] = useState({ companyName: "", question: "", category: "DSA", difficulty: "MEDIUM", tags: "" });
  const [filterCompany, setFilterCompany] = useState("");
  const [mounted, setMounted] = useState(false);

  function reload() { setQuestions(getQuestions()); }
  useEffect(() => { seedIfEmpty(); reload(); setMounted(true); }, []);

  if (!mounted) return <div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" /></div>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.companyName.trim() || !form.question.trim()) { toast.error("Company and question are required"); return; }
    addQuestion(form);
    setForm({ companyName: "", question: "", category: "DSA", difficulty: "MEDIUM", tags: "" });
    reload();
    toast.success("Question saved!");
  }

  function handleDelete(id: string) { deleteQuestion(id); reload(); toast.success("Question deleted"); }

  const companies = [...new Set(questions.map((q) => q.companyName))];
  const filtered = filterCompany ? questions.filter((q) => q.companyName === filterCompany) : questions;

  return (
    <div className="space-y-6">
      <PageHeader title="Company Question Bank" description="Your private knowledge base of questions you've seen in interviews and OAs." />

      {companies.length > 1 && (
        <div className="flex flex-wrap gap-2 rounded-3xl border border-white/10 bg-white/5 p-3">
          <button onClick={() => setFilterCompany("")} className={`rounded-full px-4 py-2 text-sm font-medium transition ${!filterCompany ? "bg-cyan-400/20 text-cyan-100 ring-1 ring-cyan-300/30" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>All</button>
          {companies.map((c) => (
            <button key={c} onClick={() => setFilterCompany(c)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${filterCompany === c ? "bg-cyan-400/20 text-cyan-100 ring-1 ring-cyan-300/30" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>{c}</button>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Saved questions ({filtered.length})</h3>
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-400">No questions saved yet.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-white">{item.companyName}</p>
                      <p className="mt-1 text-sm text-slate-300">{item.question}</p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <Badge className="text-[10px]">{item.category}</Badge>
                        <Badge className={`text-[10px] ${item.difficulty === "HARD" ? "border-rose-400/30 bg-rose-400/10 text-rose-200" : item.difficulty === "MEDIUM" ? "border-amber-400/30 bg-amber-400/10 text-amber-200" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"}`}>{item.difficulty}</Badge>
                        {item.tags && <span className="text-[10px] text-slate-500">{item.tags}</span>}
                      </div>
                    </div>
                    <Button onClick={() => handleDelete(item.id)} className="bg-rose-500/10 border-rose-400/30 text-rose-200 hover:bg-rose-500/20 p-2 shrink-0"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="border-white/10 bg-white/5 h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">Add question</h3>
          <form className="space-y-3" onSubmit={submit}>
            <div><Label>Company *</Label><Input placeholder="e.g. Microsoft" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
            <div><Label>Question *</Label><Textarea placeholder="What was the question?" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></div>
            <div><Label>Category</Label>
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="DSA">DSA</option>
                <option value="System Design">System Design</option>
                <option value="DBMS">DBMS</option>
                <option value="OS">OS</option>
                <option value="CN">Computer Networks</option>
                <option value="OOP">OOP</option>
                <option value="Behavioral">Behavioral</option>
              </Select>
            </div>
            <div><Label>Difficulty</Label>
              <Select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </Select>
            </div>
            <div><Label>Tags</Label><Input placeholder="e.g. cache, hashmap, lru" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">Save question</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
