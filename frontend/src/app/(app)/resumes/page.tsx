"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, Button, Input } from "@/components/ui";
import { resumeList } from "@/lib/app-data";

export default function ResumesPage() {
  const [loading, setLoading] = useState(false);
  const [versionLabel, setVersionLabel] = useState("ATS Resume");
  const [file, setFile] = useState<File | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      toast.error("Choose a resume file first");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("versionLabel", versionLabel);
      formData.append("defaultResume", "false");
      await api.uploadResume(formData);
      toast.success("Resume uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload resume");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Resumes" description="Keep multiple versions, set one default, and reuse the right resume for the right application." actionLabel="Upload resume" />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Resume versions</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {resumeList.map((resume) => (
              <div key={resume.name} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{resume.name}</p>
                  {resume.defaultResume && <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-200">Default</span>}
                </div>
                <p className="mt-1 text-sm text-cyan-200/80">Tag: {resume.tag}</p>
                <p className="mt-1 text-xs text-slate-400">{resume.notes}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Upload new version</h3>
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <Input value={versionLabel} onChange={(event) => setVersionLabel(event.target.value)} placeholder="Version label" />
            <Input type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">{loading ? "Uploading..." : "Upload resume"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
