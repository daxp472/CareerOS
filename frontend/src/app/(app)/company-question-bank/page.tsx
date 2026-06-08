"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, Button, Input, Textarea } from "@/components/ui";
import { questionBankList } from "@/lib/app-data";

export default function CompanyQuestionBankPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ companyName: "", question: "", category: "DSA", difficulty: "MEDIUM", tags: "" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await api.createQuestion({
        companyName: form.companyName,
        question: form.question,
        category: form.category,
        difficulty: form.difficulty,
        tags: form.tags,
      });
      toast.success("Question saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save question");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Company Question Bank" description="Private knowledge base for questions you have seen during interviews and OAs." actionLabel="Add question" />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Saved questions</h3>
          <div className="mt-4 space-y-3">
            {questionBankList.map((item) => (
              <div key={item.question} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                <p className="font-medium text-white">{item.company}</p>
                <p className="mt-1 text-sm text-slate-300">{item.question}</p>
                <p className="mt-1 text-xs text-slate-500">{item.category} · {item.difficulty} · {item.tags}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Add question</h3>
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <Input placeholder="Company name" value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} />
            <Textarea placeholder="Question" value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} />
            <Input placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
            <Input placeholder="Difficulty" value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: event.target.value })} />
            <Input placeholder="Tags" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">{loading ? "Saving..." : "Save question"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
