"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Star, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, Card, Input, Label } from "@/components/ui";
import { getResumes, addResume, setDefaultResume, deleteResume, seedIfEmpty, type Resume } from "@/lib/store";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [form, setForm] = useState({ name: "", tag: "", notes: "" });
  const [mounted, setMounted] = useState(false);

  function reload() { setResumes(getResumes()); }
  useEffect(() => { seedIfEmpty(); reload(); setMounted(true); }, []);

  if (!mounted) return <div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" /></div>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Resume name is required"); return; }
    addResume({ name: form.name, tag: form.tag, notes: form.notes, defaultResume: resumes.length === 0 });
    setForm({ name: "", tag: "", notes: "" });
    reload();
    toast.success("Resume added!");
  }

  function handleSetDefault(id: string) { setDefaultResume(id); reload(); toast.success("Default resume updated"); }
  function handleDelete(id: string) { deleteResume(id); reload(); toast.success("Resume deleted"); }

  return (
    <div className="space-y-6">
      <PageHeader title="Resumes" description="Manage multiple resume versions. Set one as default for quick referencing." />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Resume versions</h3>
          {resumes.length === 0 ? (
            <p className="text-sm text-slate-400">No resumes added yet.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {resumes.map((r) => (
                <div key={r.id} className={`rounded-2xl border p-4 ${r.defaultResume ? "border-emerald-400/30 bg-emerald-500/5" : "border-white/10 bg-slate-950/35"}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{r.name}</p>
                    {r.defaultResume && <Badge className="bg-emerald-400/10 text-emerald-200 border-emerald-400/30 text-[10px]">DEFAULT</Badge>}
                  </div>
                  {r.tag && <p className="mt-1 text-sm text-cyan-200/80">Tag: {r.tag}</p>}
                  {r.notes && <p className="mt-1 text-xs text-slate-400">{r.notes}</p>}
                  <div className="mt-3 flex gap-2">
                    {!r.defaultResume && (
                      <Button onClick={() => handleSetDefault(r.id)} className="bg-emerald-500/10 border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/20 p-2 text-xs gap-1">
                        <Star className="h-3 w-3" /> Set default
                      </Button>
                    )}
                    <Button onClick={() => handleDelete(r.id)} className="bg-rose-500/10 border-rose-400/30 text-rose-200 hover:bg-rose-500/20 p-2"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="border-white/10 bg-white/5 h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">Add resume version</h3>
          <form className="space-y-3" onSubmit={submit}>
            <div><Label>Resume name *</Label><Input placeholder="e.g. Resume V5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Tag</Label><Input placeholder="e.g. Backend, ATS, Frontend" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} /></div>
            <div><Label>Notes</Label><Input placeholder="e.g. Keyword optimized for SDE roles" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">Add resume</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
