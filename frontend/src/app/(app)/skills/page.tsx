"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button, Card, Input, Label, Select, Textarea } from "@/components/ui";
import { getSkills, addSkill, updateSkill, deleteSkill, seedIfEmpty, type Skill } from "@/lib/store";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState({ skillName: "", category: "CODING", progressPercentage: "50", notes: "", targetDate: "" });
  const [mounted, setMounted] = useState(false);

  function reload() { setSkills(getSkills()); }
  useEffect(() => { seedIfEmpty(); reload(); setMounted(true); }, []);

  if (!mounted) return <div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" /></div>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.skillName.trim()) { toast.error("Skill name is required"); return; }
    addSkill({ skillName: form.skillName, category: form.category, progressPercentage: Number(form.progressPercentage), notes: form.notes, targetDate: form.targetDate });
    setForm({ skillName: "", category: "CODING", progressPercentage: "50", notes: "", targetDate: "" });
    reload();
    toast.success("Skill added!");
  }

  function handleProgressChange(id: string, value: number) {
    updateSkill(id, { progressPercentage: Math.min(100, Math.max(0, value)) });
    reload();
  }

  function handleDelete(id: string) { deleteSkill(id); reload(); toast.success("Skill removed"); }

  const gradients = ["from-cyan-300 to-blue-400", "from-violet-300 to-purple-400", "from-emerald-300 to-teal-400", "from-amber-300 to-orange-400", "from-fuchsia-300 to-pink-400"];

  return (
    <div className="space-y-6">
      <PageHeader title="Skills" description="Track the skills you are improving for placements, interviews, and long-term career growth." />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Skill progress</h3>
          {skills.length === 0 ? (
            <p className="text-sm text-slate-400">No skills tracked yet. Add your first skill!</p>
          ) : (
            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={skill.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-white">{skill.skillName}</span>
                      <span className="ml-2 text-xs text-slate-500">{skill.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">{skill.progressPercentage}%</span>
                      <Button onClick={() => handleDelete(skill.id)} className="bg-rose-500/10 border-rose-400/30 text-rose-200 hover:bg-rose-500/20 p-1.5"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                  <div className="mt-2 h-2.5 rounded-full bg-white/10">
                    <div className={`h-2.5 rounded-full bg-gradient-to-r ${gradients[idx % gradients.length]} transition-all duration-500`} style={{ width: `${skill.progressPercentage}%` }} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input type="range" min="0" max="100" value={skill.progressPercentage} onChange={(e) => handleProgressChange(skill.id, Number(e.target.value))} className="flex-1 accent-cyan-400 h-1" />
                  </div>
                  {skill.notes && <p className="mt-1 text-xs text-slate-400">{skill.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="border-white/10 bg-white/5 h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">Add skill</h3>
          <form className="space-y-3" onSubmit={submit}>
            <div><Label>Skill name *</Label><Input placeholder="e.g. DSA, System Design" value={form.skillName} onChange={(e) => setForm({ ...form, skillName: e.target.value })} /></div>
            <div><Label>Category</Label>
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="CODING">Coding</option>
                <option value="BACKEND">Backend</option>
                <option value="FRONTEND">Frontend</option>
                <option value="ARCHITECTURE">Architecture</option>
                <option value="DATABASE">Database</option>
                <option value="DEVOPS">DevOps</option>
                <option value="SOFT_SKILLS">Soft Skills</option>
              </Select>
            </div>
            <div><Label>Progress ({form.progressPercentage}%)</Label><input type="range" min="0" max="100" value={form.progressPercentage} onChange={(e) => setForm({ ...form, progressPercentage: e.target.value })} className="w-full accent-cyan-400" /></div>
            <div><Label>Target date</Label><Input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} /></div>
            <div><Label>Notes</Label><Textarea placeholder="What to focus on..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">Save skill</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
