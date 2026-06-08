"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, Button, Input, Textarea } from "@/components/ui";

type ProfileResponse = {
  data?: {
    fullName?: string;
    phone?: string;
    department?: string;
    graduationYear?: number;
    cgpa?: number;
    skillSummary?: string;
    dateOfBirth?: string;
  };
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", department: "", graduationYear: "", cgpa: "", skillSummary: "", dateOfBirth: "" });

  useEffect(() => {
    api.profile().then((response) => {
      const profile = response as ProfileResponse;
      if (profile?.data) {
        setForm({
          fullName: profile.data.fullName ?? "",
          phone: profile.data.phone ?? "",
          department: profile.data.department ?? "",
          graduationYear: profile.data.graduationYear ? String(profile.data.graduationYear) : "",
          cgpa: profile.data.cgpa ? String(profile.data.cgpa) : "",
          skillSummary: profile.data.skillSummary ?? "",
          dateOfBirth: profile.data.dateOfBirth ?? "",
        });
      }
    }).catch(() => undefined);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await api.updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        department: form.department,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        cgpa: form.cgpa ? Number(form.cgpa) : undefined,
        skillSummary: form.skillSummary,
        dateOfBirth: form.dateOfBirth,
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Keep your academic and placement profile updated for your own reference and planning." actionLabel="Save changes" />
      <Card className="border-white/10 bg-white/5">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <Input placeholder="Full name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <Input placeholder="Department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
          <Input placeholder="Graduation year" value={form.graduationYear} onChange={(event) => setForm({ ...form, graduationYear: event.target.value })} />
          <Input placeholder="CGPA" value={form.cgpa} onChange={(event) => setForm({ ...form, cgpa: event.target.value })} />
          <Input type="date" value={form.dateOfBirth} onChange={(event) => setForm({ ...form, dateOfBirth: event.target.value })} />
          <Textarea className="md:col-span-2 min-h-36" placeholder="Skill summary" value={form.skillSummary} onChange={(event) => setForm({ ...form, skillSummary: event.target.value })} />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">{loading ? "Saving..." : "Update profile"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
