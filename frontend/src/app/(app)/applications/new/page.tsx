"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Button, Card, Input, Textarea } from "@/components/ui";

export default function NewApplicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ companyName: "", jobRole: "", packageCtc: "", location: "", applicationDate: "", deadlineDate: "", status: "APPLIED", resumeVersionUsed: "", referralInformation: "", notes: "", source: "Manual" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await api.createApplication({
        companyName: form.companyName,
        jobRole: form.jobRole,
        packageCtc: form.packageCtc ? Number(form.packageCtc) : undefined,
        location: form.location,
        applicationDate: form.applicationDate || undefined,
        deadlineDate: form.deadlineDate || undefined,
        status: form.status,
        resumeVersionUsed: form.resumeVersionUsed,
        referralInformation: form.referralInformation,
        notes: form.notes,
        source: form.source,
      });
      toast.success("Application saved");
      router.push("/applications");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save application");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="New Application" description="Capture a company record the moment you apply, then follow it through interviews, deadlines, and outcomes." />
      <Card className="border-white/10 bg-white/5">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <Input placeholder="Company name" value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} />
          <Input placeholder="Job role" value={form.jobRole} onChange={(event) => setForm({ ...form, jobRole: event.target.value })} />
          <Input placeholder="Package / CTC" value={form.packageCtc} onChange={(event) => setForm({ ...form, packageCtc: event.target.value })} />
          <Input placeholder="Location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
          <Input type="date" value={form.applicationDate} onChange={(event) => setForm({ ...form, applicationDate: event.target.value })} />
          <Input type="date" value={form.deadlineDate} onChange={(event) => setForm({ ...form, deadlineDate: event.target.value })} />
          <Input placeholder="Status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} />
          <Input placeholder="Resume version used" value={form.resumeVersionUsed} onChange={(event) => setForm({ ...form, resumeVersionUsed: event.target.value })} />
          <Input placeholder="Referral information" value={form.referralInformation} onChange={(event) => setForm({ ...form, referralInformation: event.target.value })} />
          <Input placeholder="Source" value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })} />
          <Textarea className="md:col-span-2 min-h-32" placeholder="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950 hover:opacity-90">{loading ? "Saving..." : "Save application"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
