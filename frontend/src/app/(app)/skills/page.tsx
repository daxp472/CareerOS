"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, Button, Input, Textarea } from "@/components/ui";
import { skillList } from "@/lib/app-data";

export default function SkillsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ skillName: "", category: "DSA", progressPercentage: "50", notes: "", targetDate: "" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await api.createSkill({
        skillName: form.skillName,
        category: form.category,
        progressPercentage: Number(form.progressPercentage),
        notes: form.notes,
        targetDate: form.targetDate || undefined,
      });
      toast.success("Skill saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save skill");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Skills" description="Track the skills you are actively improving for placements, interviews, and long-term growth." actionLabel="Add skill" />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Skill progress</h3>
          <div className="mt-4 space-y-4">
            {skillList.map((skill) => (
              <div key={skill.name} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white">{skill.name}</span>
                  <span className="text-slate-400">{skill.progress}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400" style={{ width: `${skill.progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-400">{skill.notes}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Add skill</h3>
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <Input placeholder="Skill name" value={form.skillName} onChange={(event) => setForm({ ...form, skillName: event.target.value })} />
            <Input placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
            <Input placeholder="Progress percentage" value={form.progressPercentage} onChange={(event) => setForm({ ...form, progressPercentage: event.target.value })} />
            <Input type="date" value={form.targetDate} onChange={(event) => setForm({ ...form, targetDate: event.target.value })} />
            <Textarea placeholder="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">{loading ? "Saving..." : "Save skill"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
