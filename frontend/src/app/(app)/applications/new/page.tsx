"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button, Card, Input, Label, Select, Textarea } from "@/components/ui";
import { addApplication, APPLICATION_STAGES, type ApplicationStatus } from "@/lib/store";

export default function NewApplicationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: "",
    jobRole: "",
    packageCtc: "",
    location: "",
    applicationDate: new Date().toISOString().split("T")[0],
    deadlineDate: "",
    status: "APPLIED" as ApplicationStatus,
    resumeVersionUsed: "",
    referralInformation: "",
    notes: "",
    source: "Manual",
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!form.jobRole.trim()) {
      toast.error("Job role is required");
      return;
    }

    addApplication(form);
    toast.success("Application saved!");
    router.push("/applications");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="New Application" description="Record a company application the moment you apply. Track it through interviews, deadlines, and outcomes." />
      <Card className="border-white/10 bg-white/5">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={submit}>
          <div>
            <Label>Company name *</Label>
            <Input placeholder="e.g. PhonePe, Microsoft" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </div>
          <div>
            <Label>Job role *</Label>
            <Input placeholder="e.g. SDE Intern, Backend Intern" value={form.jobRole} onChange={(e) => setForm({ ...form, jobRole: e.target.value })} />
          </div>
          <div>
            <Label>Package / CTC</Label>
            <Input placeholder="e.g. ₹18 LPA" value={form.packageCtc} onChange={(e) => setForm({ ...form, packageCtc: e.target.value })} />
          </div>
          <div>
            <Label>Location</Label>
            <Input placeholder="e.g. Bengaluru, Remote" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <Label>Application date</Label>
            <Input type="date" value={form.applicationDate} onChange={(e) => setForm({ ...form, applicationDate: e.target.value })} />
          </div>
          <div>
            <Label>Deadline date</Label>
            <Input type="date" value={form.deadlineDate} onChange={(e) => setForm({ ...form, deadlineDate: e.target.value })} />
          </div>
          <div>
            <Label>Current status</Label>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ApplicationStatus })}>
              {APPLICATION_STAGES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Resume version used</Label>
            <Input placeholder="e.g. Resume V4" value={form.resumeVersionUsed} onChange={(e) => setForm({ ...form, resumeVersionUsed: e.target.value })} />
          </div>
          <div>
            <Label>Referral info</Label>
            <Input placeholder="e.g. Alumni referral, Employee name" value={form.referralInformation} onChange={(e) => setForm({ ...form, referralInformation: e.target.value })} />
          </div>
          <div>
            <Label>Source</Label>
            <Select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              <option value="Manual">Manual</option>
              <option value="College portal">College portal</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Referral">Referral</option>
              <option value="Careers page">Careers page</option>
              <option value="Naukri">Naukri</option>
              <option value="Other">Other</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Notes</Label>
            <Textarea className="min-h-28" placeholder="Any additional notes about this application..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" onClick={() => router.back()} className="bg-white/10 text-slate-100 hover:bg-white/15">Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950 hover:opacity-90">Save application</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
