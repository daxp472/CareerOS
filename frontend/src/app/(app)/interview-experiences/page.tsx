"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, Button, Input, Textarea } from "@/components/ui";
import { interviewExperienceList } from "@/lib/app-data";

export default function InterviewExperiencesPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ companyName: "", questionsAsked: "", topicsCovered: "", learnings: "", notes: "", interviewDate: "" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await api.createInterviewExperience({
        companyName: form.companyName,
        questionsAsked: form.questionsAsked,
        topicsCovered: form.topicsCovered,
        learnings: form.learnings,
        notes: form.notes,
        interviewDate: form.interviewDate || undefined,
      });
      toast.success("Interview experience saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save interview experience");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Interview Experience Journal" description="Capture what was asked, what you learned, and how to answer better next time." actionLabel="Add note" />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Saved interview notes</h3>
          <div className="mt-4 space-y-4">
            {interviewExperienceList.map((item) => (
              <div key={item.company} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                <p className="font-medium text-white">{item.company}</p>
                <p className="mt-1 text-sm text-slate-300">Questions: {item.questions}</p>
                <p className="mt-1 text-sm text-slate-400">Topics: {item.topics}</p>
                <p className="mt-1 text-xs text-slate-500">{item.learnings}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">New experience</h3>
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <Input placeholder="Company name" value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} />
            <Textarea placeholder="Questions asked" value={form.questionsAsked} onChange={(event) => setForm({ ...form, questionsAsked: event.target.value })} />
            <Textarea placeholder="Topics covered" value={form.topicsCovered} onChange={(event) => setForm({ ...form, topicsCovered: event.target.value })} />
            <Textarea placeholder="Learnings" value={form.learnings} onChange={(event) => setForm({ ...form, learnings: event.target.value })} />
            <Textarea placeholder="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            <Input type="datetime-local" value={form.interviewDate} onChange={(event) => setForm({ ...form, interviewDate: event.target.value })} />
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">{loading ? "Saving..." : "Save note"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
